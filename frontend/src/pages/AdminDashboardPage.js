import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Pencil, Trash2, Plus, LogOut, Eye } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [brandDialog, setBrandDialog] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [brandFilter, setBrandFilter] = useState("all");

  const [brandForm, setBrandForm] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    button_text: "",
    order: 0,
    is_active: true,
  });

  const [productForm, setProductForm] = useState({
    brand_id: "",
    name: "",
    description: "",
    image_url: "",
    price: "",
    category: "",
    is_active: true,
  });

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("admin_token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/brands/all`, {
        headers: getHeaders(),
      });
      setBrands(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/giris");
      }
    }
  }, [getHeaders, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/products/all`, {
        headers: getHeaders(),
      });
      setProducts(res.data);
    } catch {
      // silent
    }
  }, [getHeaders]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/giris");
      return;
    }
    fetchBrands();
    fetchProducts();
  }, [navigate, fetchBrands, fetchProducts]);

  const openBrandDialog = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandForm({
        name: brand.name,
        slug: brand.slug,
        description: brand.description || "",
        image_url: brand.image_url || "",
        button_text: brand.button_text || "",
        order: brand.order || 0,
        is_active: brand.is_active !== false,
      });
    } else {
      setEditingBrand(null);
      setBrandForm({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        button_text: "",
        order: brands.length + 1,
        is_active: true,
      });
    }
    setBrandDialog(true);
  };

  const saveBrand = async () => {
    try {
      if (editingBrand) {
        await axios.put(`${API}/brands/${editingBrand.id}`, brandForm, {
          headers: getHeaders(),
        });
      } else {
        await axios.post(`${API}/brands`, brandForm, {
          headers: getHeaders(),
        });
      }
      setBrandDialog(false);
      fetchBrands();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBrand = async (id) => {
    if (!window.confirm("Bu markayı ve tüm ürünlerini silmek istediğinize emin misiniz?"))
      return;
    try {
      await axios.delete(`${API}/brands/${id}`, { headers: getHeaders() });
      fetchBrands();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const openProductDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        brand_id: product.brand_id,
        name: product.name,
        description: product.description || "",
        image_url: product.image_url || "",
        price: product.price || "",
        category: product.category || "",
        is_active: product.is_active !== false,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        brand_id: brands[0]?.id || "",
        name: "",
        description: "",
        image_url: "",
        price: "",
        category: "",
        is_active: true,
      });
    }
    setProductDialog(true);
  };

  const saveProduct = async () => {
    try {
      if (editingProduct) {
        await axios.put(
          `${API}/products/${editingProduct.id}`,
          productForm,
          { headers: getHeaders() }
        );
      } else {
        await axios.post(`${API}/products`, productForm, {
          headers: getHeaders(),
        });
      }
      setProductDialog(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers: getHeaders() });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts =
    brandFilter === "all"
      ? products
      : products.filter((p) => p.brand_id === brandFilter);

  const getBrandName = (brandId) =>
    brands.find((b) => b.id === brandId)?.name || "—";

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/giris");
  };

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E5E5E5] px-6 sm:px-12 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-inter font-thin tracking-[0.3em] text-[#050505] text-sm uppercase">
            FIRAT OPTİK
          </h1>
          <p className="font-inter text-[10px] text-[#999] mt-1 tracking-wider">
            Yönetim Paneli
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            data-testid="admin-view-site"
            className="hidden sm:flex items-center gap-2 font-inter text-xs text-[#999] hover:text-[#050505]"
            style={{ transition: "color 0.3s" }}
          >
            <Eye size={14} />
            Siteyi Görüntüle
          </a>
          <Button
            data-testid="admin-logout"
            onClick={logout}
            variant="outline"
            size="sm"
            className="rounded-none text-xs"
          >
            <LogOut size={14} className="mr-2" /> Çıkış
          </Button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Tabs defaultValue="brands">
          <TabsList data-testid="admin-tabs" className="mb-8">
            <TabsTrigger value="brands" data-testid="tab-brands">
              Markalar ({brands.length})
            </TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">
              Ürünler ({products.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brands">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-inter text-base text-[#050505]">Markalar</h2>
              <Button
                data-testid="add-brand-btn"
                onClick={() => openBrandDialog()}
                className="rounded-none bg-[#050505] text-xs"
              >
                <Plus size={14} className="mr-2" /> Yeni Marka
              </Button>
            </div>
            <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Sıra</TableHead>
                    <TableHead>Marka</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right w-28">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell className="text-[#999]">
                        {brand.order}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {brand.name}
                      </TableCell>
                      <TableCell className="text-[#999] text-xs">
                        {brand.slug}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-inter ${
                            brand.is_active ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {brand.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          data-testid={`edit-brand-${brand.slug}`}
                          onClick={() => openBrandDialog(brand)}
                          variant="ghost"
                          size="sm"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          data-testid={`delete-brand-${brand.slug}`}
                          onClick={() => deleteBrand(brand.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="font-inter text-base text-[#050505]">Ürünler</h2>
              <div className="flex items-center gap-4">
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger
                    data-testid="product-brand-filter"
                    className="w-48 rounded-none text-xs"
                  >
                    <SelectValue placeholder="Marka Filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Markalar</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  data-testid="add-product-btn"
                  onClick={() => openProductDialog()}
                  className="rounded-none bg-[#050505] text-xs"
                >
                  <Plus size={14} className="mr-2" /> Yeni Ürün
                </Button>
              </div>
            </div>
            <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Marka</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead className="text-right w-28">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-sm">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-[#999] text-xs">
                        {getBrandName(product.brand_id)}
                      </TableCell>
                      <TableCell className="text-[#999] text-xs">
                        {product.category || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {product.price || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          data-testid={`edit-product-${product.id}`}
                          onClick={() => openProductDialog(product)}
                          variant="ghost"
                          size="sm"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          data-testid={`delete-product-${product.id}`}
                          onClick={() => deleteProduct(product.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-[#999] font-inter text-sm"
                      >
                        Henüz ürün eklenmemiş
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={brandDialog} onOpenChange={setBrandDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-inter text-base">
              {editingBrand ? "Marka Düzenle" : "Yeni Marka Ekle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Marka Adı
              </Label>
              <Input
                data-testid="brand-name-input"
                value={brandForm.name}
                onChange={(e) =>
                  setBrandForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-1 rounded-none"
              />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Slug (URL)
              </Label>
              <Input
                data-testid="brand-slug-input"
                value={brandForm.slug}
                onChange={(e) =>
                  setBrandForm((f) => ({ ...f, slug: e.target.value }))
                }
                className="mt-1 rounded-none"
                placeholder="ornek: gucci"
              />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Açıklama
              </Label>
              <Textarea
                data-testid="brand-desc-input"
                value={brandForm.description}
                onChange={(e) =>
                  setBrandForm((f) => ({ ...f, description: e.target.value }))
                }
                className="mt-1 rounded-none"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Görsel URL
              </Label>
              <Input
                data-testid="brand-image-input"
                value={brandForm.image_url}
                onChange={(e) =>
                  setBrandForm((f) => ({ ...f, image_url: e.target.value }))
                }
                className="mt-1 rounded-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Buton Metni
              </Label>
              <Input
                data-testid="brand-button-input"
                value={brandForm.button_text}
                onChange={(e) =>
                  setBrandForm((f) => ({ ...f, button_text: e.target.value }))
                }
                className="mt-1 rounded-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[11px] uppercase tracking-wider">
                  Sıra
                </Label>
                <Input
                  data-testid="brand-order-input"
                  type="number"
                  value={brandForm.order}
                  onChange={(e) =>
                    setBrandForm((f) => ({
                      ...f,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1 rounded-none"
                />
              </div>
              <div className="flex items-end gap-3 pb-1">
                <input
                  type="checkbox"
                  id="brand-active"
                  checked={brandForm.is_active}
                  onChange={(e) =>
                    setBrandForm((f) => ({ ...f, is_active: e.target.checked }))
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="brand-active" className="text-sm">
                  Aktif
                </Label>
              </div>
            </div>
            <Button
              data-testid="save-brand-btn"
              onClick={saveBrand}
              className="w-full rounded-none bg-[#050505] mt-2"
            >
              Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={productDialog} onOpenChange={setProductDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-inter text-base">
              {editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Marka
              </Label>
              <Select
                value={productForm.brand_id}
                onValueChange={(v) =>
                  setProductForm((f) => ({ ...f, brand_id: v }))
                }
              >
                <SelectTrigger
                  data-testid="product-brand-select"
                  className="mt-1 rounded-none"
                >
                  <SelectValue placeholder="Marka Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Ürün Adı
              </Label>
              <Input
                data-testid="product-name-input"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-1 rounded-none"
              />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Açıklama
              </Label>
              <Textarea
                data-testid="product-desc-input"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                className="mt-1 rounded-none"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">
                Görsel URL
              </Label>
              <Input
                data-testid="product-image-input"
                value={productForm.image_url}
                onChange={(e) =>
                  setProductForm((f) => ({
                    ...f,
                    image_url: e.target.value,
                  }))
                }
                className="mt-1 rounded-none"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[11px] uppercase tracking-wider">
                  Fiyat
                </Label>
                <Input
                  data-testid="product-price-input"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="mt-1 rounded-none"
                  placeholder="₺4.500"
                />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wider">
                  Kategori
                </Label>
                <Input
                  data-testid="product-category-input"
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      category: e.target.value,
                    }))
                  }
                  className="mt-1 rounded-none"
                  placeholder="Güneş Gözlüğü"
                />
              </div>
            </div>
            <Button
              data-testid="save-product-btn"
              onClick={saveProduct}
              className="w-full rounded-none bg-[#050505] mt-2"
            >
              Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
