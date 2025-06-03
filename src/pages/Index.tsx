
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import useStore from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { products, cartItems, addToCart, initializeProducts } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    initializeProducts();
  }, [initializeProducts]);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.nome} foi adicionado ao carrinho.`,
    });
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantidade, 0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">Mercantil 7</h1>
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
          <h2 className="text-3xl font-bold mb-2">Produtos em Destaque</h2>
          <p className="text-muted-foreground">Encontre os melhores produtos com preços incríveis</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.filter(product => product.ativo).map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow h-fit">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.imagem_url}
                  alt={product.nome}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-sm sm:text-base line-clamp-2">{product.nome}</CardTitle>
                <CardDescription className="text-xs sm:text-sm line-clamp-2">{product.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-lg sm:text-xl font-bold text-green-400">
                  R$ {product.preco.toFixed(2).replace('.', ',')}
                </div>
              </CardContent>
              <CardFooter className="p-3 sm:p-4 pt-0">
                <Button 
                  className="w-full text-xs sm:text-sm" 
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Adicionar
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
