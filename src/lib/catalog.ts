import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getProduct, type Product } from "@/data/products";
import { photoBySlug } from "@/data/photos";

export const catalogUrl = "https://dzyjidfgdcsgwgchfjsq.supabase.co";
// Public read-only credential supplied for this independent catalog.
const publishableKey = "sb_publishable_OBoKmAkL2I7ZByeppcIkMg_oXPHzx-X";
const rowSchema = z.object({
  name: z.string(), brand: z.string(), price_cents: z.number().int().nonnegative(),
  slug: z.string().min(1), image_path: z.string().nullable(),
  is_active: z.boolean(), is_featured: z.boolean(), sort_order: z.number().nullable(),
});
export type CatalogProduct = Product & { featured: boolean };

// Verified individual originals override the shared remote montage only for these slugs.
const individualPhotoBySlug: Readonly<Record<string, string>> = {
  "al-wataniah-sabah-al-ward-roxo": "/images/sabah-al-ward-roxo.png",
  "al-wataniah-sabah-al-ward-vermelho": "/images/sabah-al-ward-vermelho.jpg",
};

export function publicImageUrl(path: string | null): string | null {
  if (!path?.trim()) return null;
  const normalized = path.trim().replace(/^\/+/, "").replace(/^perfume-images\//, "");
  const segments = normalized.split("/");
  if (segments.some((s) => s === ".." || s === ".") || /^https?:/i.test(normalized)) return null;
  return `${catalogUrl}/storage/v1/object/public/perfume-images/${segments.map(encodeURIComponent).join("/")}`;
}

export function parseCatalog(input: unknown): CatalogProduct[] {
  return z.array(rowSchema).parse(input).filter((p) => p.is_active)
    .sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER) || a.slug.localeCompare(b.slug))
    .map((p) => ({ slug: p.slug, name: p.name, brand: p.brand, price: p.price_cents / 100,
      artId: p.name, image: individualPhotoBySlug[p.slug] ?? publicImageUrl(p.image_path) ?? photoBySlug[p.slug] ?? null, featured: p.is_featured }));
}

async function readProducts(slug?: string): Promise<CatalogProduct[]> {
  const params = new URLSearchParams({
    select: "name,brand,price_cents,slug,image_path,is_active,is_featured,sort_order",
    is_active: "eq.true", order: "sort_order.asc.nullslast,slug.asc",
  });
  if (slug) params.set("slug", `eq.${slug}`);
  try {
    const response = await fetch(`${catalogUrl}/rest/v1/products?${params}`, {
      method: "GET", headers: { apikey: publishableKey, Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Catalog request failed");
    return parseCatalog(await response.json());
  } catch {
    throw new Error("Não foi possível carregar os perfumes. Tente novamente.");
  }
}

export const catalogQuery = queryOptions({
  queryKey: ["catalog", "active"], queryFn: () => readProducts(), staleTime: 60_000, retry: false,
});

export async function readProduct(slug: string): Promise<Product | null> {
  // Original URLs remain valid; never substitute a different perfume.
  const sourceSlug = slug === "invictus" ? "paco-rabanne-invictus" : slug;
  const rows = await readProducts(sourceSlug);
  if (rows[0]) return rows[0];
  const legacy = getProduct(slug);
  return legacy ? { ...legacy, image: legacy.image ?? photoBySlug[slug] ?? null } : null;
}

export const productQuery = (slug: string) => queryOptions({
  queryKey: ["catalog", "product", slug], queryFn: () => readProduct(slug), staleTime: 60_000, retry: false,
});