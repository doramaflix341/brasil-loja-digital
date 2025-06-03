
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const EntradaInicial = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEntrarLoja = () => {
    navigate("/loja");
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@mercantil7.com" && senha === "admin123") {
        localStorage.setItem("user", JSON.stringify({
          id: "1",
          email: email,
          nome: "Administrador",
          papel: "admin"
        }));
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel administrativo...",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Mercantil 7</h1>
          <p className="text-lg text-muted-foreground">
            Bem-vindo à nossa loja online
          </p>
        </div>

        <Button 
          onClick={handleEntrarLoja}
          className="w-full text-lg p-6 bg-green-600 hover:bg-green-700 transition-colors rounded-xl"
          size="lg"
        >
          <ShoppingBag className="h-6 w-6 mr-3" />
          Entrar
        </Button>
      </div>

      <div className="fixed bottom-8 w-full text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdminLogin(true)}
          className="text-xs text-gray-500 hover:text-gray-400 px-2 py-1"
        >
          Área do Admin
        </Button>
      </div>

      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Área Administrativa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mercantil7.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="senha">Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2 text-sm">Credenciais de teste:</h4>
            <div className="text-xs text-muted-foreground">
              <p><strong>Email:</strong> admin@mercantil7.com</p>
              <p><strong>Senha:</strong> admin123</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EntradaInicial;
