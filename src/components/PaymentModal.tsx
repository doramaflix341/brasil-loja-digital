
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QRCode from "qrcode";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentSuccess: () => void;
}

const PaymentModal = ({ isOpen, onClose, total, onPaymentSuccess }: PaymentModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [checkingPayment, setCheckingPayment] = useState(false);
  const { toast } = useToast();

  const generatePixCharge = async () => {
    if (!email || !email.includes('@gmail.com')) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email Gmail válido",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-pix-charge', {
        body: {
          email,
          amount: total,
          description: "Pedido via Mercantil 7"
        }
      });

      if (error) {
        throw error;
      }

      setQrCodeData(data);
      
      // Gerar QR Code visual
      const qrImage = await QRCode.toDataURL(data.qr_code);
      setQrCodeImage(qrImage);
      
      // Iniciar verificação de pagamento
      setCheckingPayment(true);
      startPaymentPolling(data.id);

      toast({
        title: "PIX gerado!",
        description: "Escaneie o QR Code para pagar"
      });
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar cobrança PIX. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startPaymentPolling = (chargeId: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase.functions.invoke('check-payment-status', {
          body: { chargeId }
        });

        if (data && data.status === 'paid') {
          clearInterval(interval);
          setCheckingPayment(false);
          onPaymentSuccess();
          onClose();
          toast({
            title: "Pagamento confirmado!",
            description: "Compra efetuada com sucesso!"
          });
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      }
    }, 10000); // Verificar a cada 10 segundos

    // Limpar após 10 minutos
    setTimeout(() => {
      clearInterval(interval);
      setCheckingPayment(false);
    }, 600000);
  };

  const resetModal = () => {
    setEmail("");
    setQrCodeData(null);
    setQrCodeImage("");
    setCheckingPayment(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Compra - PIX</DialogTitle>
        </DialogHeader>
        
        {!qrCodeData ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-green-400">
                Total: R$ {total.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <div>
              <Label htmlFor="email">Email (Gmail obrigatório)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@gmail.com"
                required
                className="mt-1"
              />
            </div>

            <Button 
              onClick={generatePixCharge}
              disabled={loading || !email.includes('@gmail.com')}
              className="w-full"
            >
              {loading ? "Gerando PIX..." : "Pagar com PIX"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold">Escaneie o QR Code para pagar</p>
            
            {qrCodeImage && (
              <div className="flex justify-center">
                <img src={qrCodeImage} alt="QR Code PIX" className="max-w-64" />
              </div>
            )}
            
            <div className="p-4 bg-muted rounded">
              <p className="text-sm text-muted-foreground mb-2">Ou copie o código PIX:</p>
              <p className="text-xs break-all font-mono bg-background p-2 rounded">
                {qrCodeData.qr_code}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Valor: R$ {total.toFixed(2).replace('.', ',')}</p>
              {qrCodeData.expiration && (
                <p>Expira em: {new Date(qrCodeData.expiration).toLocaleString()}</p>
              )}
            </div>

            {checkingPayment && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                <span className="text-sm">Aguardando pagamento...</span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
