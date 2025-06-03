
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-green-400 text-2xl">
            🎉 Compra efetuada com sucesso!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg mb-4">
              Seu pagamento foi confirmado! Assista ao vídeo abaixo para instruções de recebimento:
            </p>
          </div>
          
          <div className="aspect-video">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              frameBorder="0" 
              allowFullScreen
              className="rounded-lg"
            />
          </div>
          
          <div className="text-center">
            <Button onClick={onClose} className="w-full">
              Continuar Comprando
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
