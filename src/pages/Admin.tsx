
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, LogOut, Users, Package, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  ativo: boolean;
}

interface RefundRequest {
  id: string;
  pedidoId: string;
  clienteEmail: string;
  motivo: string;
  data: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("produtos");
  const [products, setProducts] = useState<Product[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newAdmin, setNewAdmin] = useState({ email: "", nome: "" });

  useEffect(() => {
    // Verificar se o usuário é admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.papel || user.papel !== "admin") {
      toast({
        title: "Acesso negado",
        description: "Você precisa ser um administrador para acessar esta página",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    // Dados de exemplo
    setProducts([
      {
        id: "1",
        nome: "Smartphone Pro",
        descricao: "Smartphone de última geração com câmera de 108MP",
        preco: 2599.99,
        imagem_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        ativo: true
      },
      {
        id: "2",
        nome: "Notebook Gamer",
        descricao: "Notebook para jogos com placa de vídeo dedicada",
        preco: 4999.99,
        imagem_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        ativo: true
      }
    ]);

    setRefundRequests([
      {
        id: "1",
        pedidoId: "PED001",
        clienteEmail: "cliente@email.com",
        motivo: "Produto com defeito",
        data: "16/12/2024",
        status: "Pendente"
      }
    ]);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate("/");
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    if (editingProduct.id === "new") {
      const newProduct = {
        ...editingProduct,
        id: Math.random().toString(36).substr(2, 9)
      };
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Produto criado",
        description: "O produto foi adicionado com sucesso",
      });
    } else {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso",
      });
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Produto removido",
      description: "O produto foi excluído com sucesso",
    });
  };

  const handleCreateAdmin = () => {
    if (!newAdmin.email || !newAdmin.nome) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Administrador criado",
      description: `${newAdmin.nome} foi adicionado como administrador`,
    });
    setNewAdmin({ email: "", nome: "" });
  };

  const handleRefundAction = (id: string, action: "Aprovado" | "Rejeitado") => {
    setRefundRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: action } : r
    ));
    toast({
      title: `Reembolso ${action.toLowerCase()}`,
      description: `A solicitação foi ${action.toLowerCase()} com sucesso`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 mb-6">
          <Button 
            variant={activeTab === "produtos" ? "default" : "outline"}
            onClick={() => setActiveTab("produtos")}
          >
            <Package className="h-4 w-4 mr-2" />
            Produtos
          </Button>
          <Button 
            variant={activeTab === "admins" ? "default" : "outline"}
            onClick={() => setActiveTab("admins")}
          >
            <Users className="h-4 w-4 mr-2" />
            Administradores
          </Button>
          <Button 
            variant={activeTab === "reembolsos" ? "default" : "outline"}
            onClick={() => setActiveTab("reembolsos")}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reembolsos
          </Button>
        </div>

        {activeTab === "produtos" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Produtos</h2>
              <Button onClick={() => setEditingProduct({
                id: "new",
                nome: "",
                descricao: "",
                preco: 0,
                imagem_url: "",
                ativo: true
              })}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            {editingProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingProduct.id === "new" ? "Criar Produto" : "Editar Produto"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input
                      id="nome"
                      value={editingProduct.nome}
                      onChange={(e) => setEditingProduct({...editingProduct, nome: e.target.value})}
                      placeholder="Nome do produto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input
                      id="descricao"
                      value={editingProduct.descricao}
                      onChange={(e) => setEditingProduct({...editingProduct, descricao: e.target.value})}
                      placeholder="Descrição do produto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={editingProduct.preco}
                      onChange={(e) => setEditingProduct({...editingProduct, preco: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imagem">URL da Imagem</Label>
                    <Input
                      id="imagem"
                      value={editingProduct.imagem_url}
                      onChange={(e) => setEditingProduct({...editingProduct, imagem_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingProduct.ativo}
                      onCheckedChange={(checked) => setEditingProduct({...editingProduct, ativo: checked})}
                    />
                    <Label>Produto ativo</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProduct}>Salvar</Button>
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancelar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <img
                      src={product.imagem_url}
                      alt={product.nome}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h3 className="font-semibold">{product.nome}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.descricao}</p>
                    <p className="font-bold text-green-600">
                      R$ {product.preco.toFixed(2).replace('.', ',')}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant={product.ativo ? "default" : "secondary"}>
                        {product.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "admins" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Criar Novo Administrador</h2>
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Administrador</CardTitle>
                <CardDescription>
                  Crie uma nova conta de administrador para o sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="adminNome">Nome Completo</Label>
                  <Input
                    id="adminNome"
                    value={newAdmin.nome}
                    onChange={(e) => setNewAdmin({...newAdmin, nome: e.target.value})}
                    placeholder="Nome do administrador"
                  />
                </div>
                <div>
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    placeholder="email@techstore.com"
                  />
                </div>
                <Button onClick={handleCreateAdmin}>
                  <Users className="h-4 w-4 mr-2" />
                  Criar Administrador
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reembolsos" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Solicitações de Reembolso</h2>
            <div className="space-y-4">
              {refundRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Pedido #{request.pedidoId}</h3>
                        <p className="text-sm text-gray-600">Cliente: {request.clienteEmail}</p>
                        <p className="text-sm text-gray-600">Data: {request.data}</p>
                        <p className="mt-2"><strong>Motivo:</strong> {request.motivo}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge 
                          variant={
                            request.status === "Pendente" ? "secondary" :
                            request.status === "Aprovado" ? "default" : "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                        {request.status === "Pendente" && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleRefundAction(request.id, "Aprovado")}
                            >
                              Aprovar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRefundAction(request.id, "Rejeitado")}
                            >
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
