from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'firat-optik-jwt-secret-2024')
JWT_ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")


# --- Models ---
class BrandCreate(BaseModel):
    name: str
    slug: str
    description: str = ""
    image_url: str = ""
    button_text: str = ""
    order: int = 0
    is_active: bool = True


class BrandUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    button_text: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class ProductCreate(BaseModel):
    brand_id: str
    name: str
    description: str = ""
    image_url: str = ""
    price: str = ""
    category: str = ""
    is_active: bool = True


class ProductUpdate(BaseModel):
    brand_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None


class AdminLogin(BaseModel):
    username: str
    password: str


class SettingsUpdate(BaseModel):
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None


# --- Auth ---
def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def hash_password(password):
    return pwd_context.hash(password)


def create_token(data: dict):
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Geçersiz token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Geçersiz token")


# --- Admin Login ---
@api_router.post("/admin/login")
async def admin_login(data: AdminLogin):
    admin = await db.admin_users.find_one({"username": data.username}, {"_id": 0})
    if not admin or not verify_password(data.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Geçersiz kullanıcı adı veya şifre")
    token = create_token({"sub": admin["username"]})
    return {"token": token, "username": admin["username"]}


# --- Brand Routes ---
@api_router.get("/brands")
async def get_brands():
    brands = await db.brands.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return brands


@api_router.get("/brands/all")
async def get_all_brands(admin: str = Depends(get_current_admin)):
    brands = await db.brands.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return brands


@api_router.get("/brands/{slug}")
async def get_brand(slug: str):
    brand = await db.brands.find_one({"slug": slug}, {"_id": 0})
    if not brand:
        raise HTTPException(status_code=404, detail="Marka bulunamadı")
    products = await db.products.find(
        {"brand_id": brand["id"], "is_active": True}, {"_id": 0}
    ).to_list(100)
    return {**brand, "products": products}


@api_router.post("/brands")
async def create_brand(data: BrandCreate, admin: str = Depends(get_current_admin)):
    brand_dict = data.model_dump()
    brand_dict["id"] = str(uuid.uuid4())
    brand_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.brands.insert_one(brand_dict)
    created = await db.brands.find_one({"id": brand_dict["id"]}, {"_id": 0})
    return created


@api_router.put("/brands/{brand_id}")
async def update_brand(brand_id: str, data: BrandUpdate, admin: str = Depends(get_current_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Güncellenecek veri yok")
    result = await db.brands.update_one({"id": brand_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Marka bulunamadı")
    updated = await db.brands.find_one({"id": brand_id}, {"_id": 0})
    return updated


@api_router.delete("/brands/{brand_id}")
async def delete_brand(brand_id: str, admin: str = Depends(get_current_admin)):
    result = await db.brands.delete_one({"id": brand_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Marka bulunamadı")
    await db.products.delete_many({"brand_id": brand_id})
    return {"message": "Marka silindi"}


# --- Product Routes ---
@api_router.get("/products")
async def get_products(brand_id: Optional[str] = None):
    query = {"is_active": True}
    if brand_id:
        query["brand_id"] = brand_id
    products = await db.products.find(query, {"_id": 0}).to_list(500)
    return products


@api_router.get("/products/all")
async def get_all_products(admin: str = Depends(get_current_admin)):
    products = await db.products.find({}, {"_id": 0}).to_list(500)
    return products


@api_router.post("/products")
async def create_product(data: ProductCreate, admin: str = Depends(get_current_admin)):
    product_dict = data.model_dump()
    product_dict["id"] = str(uuid.uuid4())
    product_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.products.insert_one(product_dict)
    created = await db.products.find_one({"id": product_dict["id"]}, {"_id": 0})
    return created


@api_router.put("/products/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, admin: str = Depends(get_current_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Güncellenecek veri yok")
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin: str = Depends(get_current_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return {"message": "Ürün silindi"}


# --- Settings ---
@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({}, {"_id": 0})
    if not settings:
        return {
            "phone": "+90 555 123 4567",
            "whatsapp": "+905551234567",
            "address": "Fırat Optik, İstanbul",
            "email": "info@firatoptik.com",
        }
    return settings


@api_router.put("/settings")
async def update_settings(data: SettingsUpdate, admin: str = Depends(get_current_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    await db.settings.update_one({}, {"$set": update_data}, upsert=True)
    settings = await db.settings.find_one({}, {"_id": 0})
    return settings


# --- Seed Data ---
async def seed_data():
    brand_count = await db.brands.count_documents({})
    if brand_count > 0:
        logger.info("Data already seeded, skipping.")
        return

    admin_exists = await db.admin_users.find_one({"username": "admin"})
    if not admin_exists:
        await db.admin_users.insert_one({
            "username": "admin",
            "password_hash": hash_password("firatoptik2024"),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user created: admin / firatoptik2024")

    brands_data = [
        {
            "name": "Christian Dior",
            "slug": "dior",
            "description": "Paris'in zarafeti, Dior'un vizyonu. Haute couture'un gözlük koleksiyonlarına yansıması.",
            "image_url": "https://images.unsplash.com/photo-1762843353098-4b314068442e?crop=entropy&cs=srgb&fm=jpg&q=85",
            "button_text": "DIOR KOLEKSİYONUNU DENEYİMLE",
            "order": 1,
        },
        {
            "name": "Gucci",
            "slug": "gucci",
            "description": "Retro-glam tarzında, maksimalist ve cesur. İtalyan modasının en ikonik ifadesi.",
            "image_url": "https://images.unsplash.com/photo-1764627511537-61f5fb030d72?crop=entropy&cs=srgb&fm=jpg&q=85",
            "button_text": "GUCCI ECLECTIC VISION",
            "order": 2,
        },
        {
            "name": "Cartier",
            "slug": "cartier",
            "description": "Mücevher işçiliğini ön plana çıkaran, prestijin en saf hali.",
            "image_url": "https://images.pexels.com/photos/5549374/pexels-photo-5549374.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "button_text": "CARTIER PRESTİJ SERİSİ",
            "order": 3,
        },
        {
            "name": "Tom Ford",
            "slug": "tom-ford",
            "description": "Minimalist, keskin hatlı ve sofistike. Modern zarafetin tanımı.",
            "image_url": "https://images.unsplash.com/photo-1762843354674-adabdd6c4072?crop=entropy&cs=srgb&fm=jpg&q=85",
            "button_text": "TOM FORD SIGNATURE",
            "order": 4,
        },
        {
            "name": "Celine",
            "slug": "celine",
            "description": "Modern, eforsuz şıklık. Siyah kemik çerçevelerle sade bir estetik.",
            "image_url": "https://images.unsplash.com/photo-1591843336300-89d113fcacd8?crop=entropy&cs=srgb&fm=jpg&q=85",
            "button_text": "CELINE PARIS LOOK",
            "order": 5,
        },
        {
            "name": "Prada",
            "slug": "prada",
            "description": "Fütüristik çizgiler ve mimari derinlik. Modanın sınırlarını zorlayan tasarımlar.",
            "image_url": "https://images.unsplash.com/photo-1762843353907-45a6ce8447a0?crop=entropy&cs=srgb&fm=jpg&q=85",
            "button_text": "PRADA UNIVERSE",
            "order": 6,
        },
        {
            "name": "Miu Miu",
            "slug": "miu-miu",
            "description": "Genç, enerjik ve avangart. Oyuncu lüksün en cesur yorumu.",
            "image_url": "https://images.unsplash.com/photo-1760551733370-78b60b3bb962?crop=entropy&cs=srgb&fm=jpg&q=85",
            "button_text": "MIU MIU PLAYFUL LUXURY",
            "order": 7,
        },
        {
            "name": "Bvlgari",
            "slug": "bvlgari",
            "description": "Roma esintili tasarımlar. Lüks ve zarafetin İtalyan yorumu.",
            "image_url": "https://images.pexels.com/photos/1191084/pexels-photo-1191084.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "button_text": "BVLGARI HERITAGE",
            "order": 8,
        },
        {
            "name": "Fendi",
            "slug": "fendi",
            "description": "Logo detayları ve İtalyan işçiliğinin mükemmel buluşması.",
            "image_url": "https://images.pexels.com/photos/36072527/pexels-photo-36072527.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "button_text": "FENDI ROMA",
            "order": 9,
        },
        {
            "name": "Bottega Veneta",
            "slug": "bottega-veneta",
            "description": "Sessiz lüks. İkonik örgü detaylarından ilham alan sanatsal tasarımlar.",
            "image_url": "https://images.pexels.com/photos/6539156/pexels-photo-6539156.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "button_text": "THE ART OF BOTTEGA",
            "order": 10,
        },
        {
            "name": "Persol",
            "slug": "persol",
            "description": "Vintage İtalyan estetiği. Sinematik bir Dolce Vita deneyimi.",
            "image_url": "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "button_text": "PERSOL CLASSICS",
            "order": 11,
        },
        {
            "name": "Etnia Barcelona",
            "slug": "etnia-barcelona",
            "description": "Renklerin ve sanatın harmonisi. Picasso ve Dali'den ilham alan kreatif tasarımlar.",
            "image_url": "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "button_text": "ART & VISION",
            "order": 12,
        },
    ]

    for brand_data in brands_data:
        brand_data["id"] = str(uuid.uuid4())
        brand_data["is_active"] = True
        brand_data["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.brands.insert_one(brand_data)

    await db.settings.insert_one({
        "phone": "+90 555 123 4567",
        "whatsapp": "+905551234567",
        "address": "Fırat Optik, İstanbul",
        "email": "info@firatoptik.com",
    })

    logger.info(f"Seeded {len(brands_data)} brands and default settings.")


@app.on_event("startup")
async def startup():
    await seed_data()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
