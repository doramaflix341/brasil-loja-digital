
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  data: string;
  total: number;
  status: string;
  produtos: string[];
}

const Reembolso = () => {
  const { toast } = useToast();
  const [orders] = useState<Order[]>([
    {
      id: "PED001",
      data: "15/12/2024",
      total: 2899.98,
      status: "Entregue",
      produtos: ["Smartphone Pro", "Fone Bluetooth"]
    },
    {
      id: "PED002",
      data: "10/12/2024",
      total: 4999.99,
      status: "Entregue",
      produtos: ["Notebook Gamer"]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");

  const handleRefundRequest = (orderId: string) => {
    if (!motivo.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o motivo do reembolso",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Solicitação Enviada",
      description: "Sua solicitação de reembolso foi enviada com sucesso. Você receberá uma resposta em até 48 horas.",
    });

    setSelectedOrder(null);
    setMotivo("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Reembolsos</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Seus Pedidos</h2>
          <p className="text-gray-600">Selecione um pedido para solicitar reembolso</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-lg">
                      <Package className="h-5 w-5 mr-2" />
                      Pedido #{order.id}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Data: {order.data} | Status: {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Produtos:</p>
                  <ul className="text-sm text-gray-600">
                    {order.produtos.map((produto, index) => (
                      <li key={index}>• {produto}</li>
                    ))}
                  </ul>
                </div>

                {selectedOrder === order.id ? (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <Label htmlFor={`motivo-${order.id}`}>
                        Motivo do reembolso*
                      </Label>
                      <Input
                        id={`motivo-${order.id}`}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Descreva o motivo da solicitação..."
                        className="mt-1"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleRefundRequest(order.id)}
                        className="flex-1"
                      >
                        Enviar Solicitação
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedOrder(null);
                          setMotivo("");
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedOrder(order.id)}
                    disabled={order.status !== "Entregue"}
                  >
                    Solicitar Reembolso
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
              <Link to="/">
                <Button>Fazer Primeiro Pedido</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Reembolso;
