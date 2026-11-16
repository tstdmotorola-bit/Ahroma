import type { Product } from "@/data/products";
import { useState } from "react";

export function ProductArt({ product }: { product: Product }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  if (product.image && failedImage !== product.image)
    return <img src={product.image} alt={`${product.brand} ${product.name}`} className="aspect-[4/5] w-full object-contain bg-card" loading="lazy" onError={() => setFailedImage(product.image)} />;
  return (
    <div data-art-placeholder={product.artId} className="art-placeholder flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 text-center">
      <span className="font-display text-3xl italic text-gold">Ah!</span>
      <span className="max-w-full break-words px-4 text-xs text-muted-foreground">{product.artId}</span>
      <span className="text-[10px] text-muted-foreground">Imagem em breve</span>
    </div>
  );
}