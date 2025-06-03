
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  ativo: boolean;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});

  useEffect(() => {
    // Dados de exemplo dos produtos
    const sampleProducts: Product[] = [
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
      },
      {
        id: "3",
        nome: "Fone Bluetooth",
        descricao: "Fone de ouvido sem fio com cancelamento de ruído",
        preco: 299.99,
        imagem_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        ativo: true
      }
    ];
    setProducts(sampleProducts);
  }, []);

  const addToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/carrinho" className="relative">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Carrinho
                  {getTotalCartItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2 py-1">
                      {getTotalCartItems()}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/reembolso">
                <Button variant="outline" size="sm">
                  Reembolsos
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Produtos em Destaque</h2>
          <p className="text-gray-600">Encontre os melhores produtos com preços incríveis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(product => product.ativo).map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.imagem_url}
                  alt={product.nome}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.nome}</CardTitle>
                <CardDescription>{product.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {product.preco.toFixed(2).replace('.', ',')}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(product.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
