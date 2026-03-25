import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, {
        username,
        password,
      });
      localStorage.setItem("admin_token", res.data.token);
      navigate("/admin");
    } catch {
      setError("Geçersiz kullanıcı adı veya şifre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="admin-login-page"
      className="min-h-screen bg-white flex items-center justify-center px-6"
    >
      <div className="w-full max-w-sm">
        <h1 className="font-inter font-thin tracking-[0.3em] text-[#050505] text-base uppercase text-center mb-12">
          FIRAT OPTİK
        </h1>
        <h2 className="font-playfair font-light text-2xl text-[#050505] mb-10 text-center">
          Yönetim Paneli
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label
              htmlFor="username"
              className="font-inter text-[10px] tracking-[0.15em] uppercase text-[#555]"
            >
              Kullanıcı Adı
            </Label>
            <Input
              id="username"
              data-testid="admin-username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 border-[#E5E5E5] focus:border-[#050505] rounded-none h-12"
              placeholder="admin"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="font-inter text-[10px] tracking-[0.15em] uppercase text-[#555]"
            >
              Şifre
            </Label>
            <Input
              id="password"
              data-testid="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 border-[#E5E5E5] focus:border-[#050505] rounded-none h-12"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p
              data-testid="admin-login-error"
              className="font-inter text-xs text-red-500"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            data-testid="admin-login-button"
            disabled={loading}
            className="w-full rounded-none bg-[#050505] text-white hover:bg-[#333] font-inter text-[11px] tracking-[0.15em] uppercase h-12"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
        <Link
          to="/"
          className="block text-center mt-10 font-inter text-xs text-[#AAAAAA] hover:text-[#050505]"
          style={{ transition: "color 0.3s" }}
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
