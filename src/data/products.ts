// Catálogo AH!ROMA. Para adicionar um produto, acrescente um item ao final.
// O "slug" define a URL (/produto/<slug>) — nunca altere slugs existentes.
// "image": deixe null até receber a arte real; o placeholder mostra o "artId".
export type Product = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  artId: string;
  image: string | null;
};

export const products: Product[] = [
  { slug: "brand-collection-326", name: "Brand Collection 326", brand: "Brand Collection", price: 599, artId: "ARTE-01", image: null },
  { slug: "dolce-gabbana-the-only-one-intense", name: "The Only One Intense", brand: "Dolce & Gabbana", price: 599, artId: "ARTE-02", image: null },
  { slug: "lattafa-the-kingdom", name: "The Kingdom", brand: "Lattafa", price: 269, artId: "ARTE-03", image: null },
  { slug: "lattafa-atheeri", name: "Atheeri", brand: "Lattafa", price: 499, artId: "ARTE-04", image: null },
  { slug: "lady-million", name: "Lady Million", brand: "Paco Rabanne", price: 699, artId: "ARTE-05", image: null },
  { slug: "212-vip-rose", name: "212 VIP Rosé", brand: "Carolina Herrera", price: 629, artId: "ARTE-06", image: null },
  { slug: "invictus", name: "Invictus", brand: "Paco Rabanne", price: 799, artId: "ARTE-07", image: null },
  { slug: "angel-mugler-eau-de-parfum-100ml", name: "Angel Eau de Parfum 100 ml", brand: "Mugler", price: 829, artId: "Angel Mugler", image: null },
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);