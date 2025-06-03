
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  ativo: boolean;
}

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  imagem_url: string;
  quantidade: number;
}

interface Store {
  products: Product[];
  cartItems: CartItem[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  updateCartQuantity: (id: string, quantidade: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  initializeProducts: () => void;
}

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      products: [],
      cartItems: [], // Carrinho sempre vazio inicialmente
      
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),
      
      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ),
        })),
      
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cartItems.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantidade: item.quantidade + 1 }
                  : item
              ),
            };
          } else {
            return {
              cartItems: [
                ...state.cartItems,
                {
                  id: product.id,
                  nome: product.nome,
                  preco: product.preco,
                  imagem_url: product.imagem_url,
                  quantidade: 1,
                },
              ],
            };
          }
        }),
      
      updateCartQuantity: (id, quantidade) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantidade } : item
          ),
        })),
      
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
      
      clearCart: () => set({ cartItems: [] }),
      
      initializeProducts: () => {
        const currentProducts = get().products;
        // Só adiciona produtos de exemplo se não houver nenhum produto no store
        if (currentProducts.length === 0) {
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
          set({ products: sampleProducts });
        }
      },
    }),
    {
      name: 'mercantil-storage',
      partialize: (state) => ({
        products: state.products,
        // Não persistir o carrinho - sempre começar vazio
      }),
    }
  )
);

export default useStore;
