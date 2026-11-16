import { afterEach, describe, expect, it, vi } from "vitest";
import { catalogQuery, parseCatalog, publicImageUrl, readProduct } from "@/lib/catalog";

const row = { name: "Invictus", brand: "Paco Rabanne", price_cents: 79900, slug: "paco-rabanne-invictus", image_path: null, is_active: true, is_featured: false, sort_order: 1 };
afterEach(() => vi.unstubAllGlobals());

describe("independent public catalog", () => {
  it("only includes active rows", () => {
    expect(parseCatalog([row, { ...row, slug: "inactive", is_active: false }]).map(p => p.slug)).toEqual(["paco-rabanne-invictus"]);
  });
  it("converts price cents to reais", () => {
    expect(parseCatalog([{ ...row, price_cents: 82900 }])[0]?.price).toBe(829);
  });
  it("orders by sort_order", () => {
    expect(parseCatalog([row, { ...row, slug: "first", sort_order: 0 }]).map(p => p.slug)).toEqual(["first", "paco-rabanne-invictus"]);
  });
  it("builds encoded photos from the perfume-images public bucket", () => {
    expect(publicImageUrl("perfume-images/lattafa/foto real.jpg")).toBe("https://dzyjidfgdcsgwgchfjsq.supabase.co/storage/v1/object/public/perfume-images/lattafa/foto%20real.jpg");
  });
  it("never fabricates a photo for empty image_path", () => {
    expect(publicImageUrl(null)).toBeNull();
    expect(publicImageUrl(" ")).toBeNull();
  });
  it("uses GET with only the public apikey and active filter", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([row])));
    vi.stubGlobal("fetch", mockFetch);
    await catalogQuery.queryFn?.({} as never);
    const call = mockFetch.mock.calls[0];
    if (!call) throw new Error("Expected a catalog request");
    const [url, init] = call;
    expect(new URL(url).searchParams.get("is_active")).toBe("eq.true");
    expect(init.method).toBe("GET");
    expect(init.headers.apikey).toBe("sb_publishable_OBoKmAkL2I7ZByeppcIkMg_oXPHzx-X");
    expect(init.headers.Authorization).toBeUndefined();
  });
  it("resolves the original Invictus URL to the same remote perfume", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([row])));
    vi.stubGlobal("fetch", mockFetch);
    expect((await readProduct("invictus"))?.slug).toBe("paco-rabanne-invictus");
    const call = mockFetch.mock.calls[0];
    if (!call) throw new Error("Expected a product request");
    expect(new URL(call[0]).searchParams.get("slug")).toBe("eq.paco-rabanne-invictus");
  });
  it("preserves Angel Mugler's original URL when absent from the remote catalog", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[]")));
    expect((await readProduct("angel-mugler-eau-de-parfum-100ml"))?.price).toBe(829);
  });
});

describe("individual Sabah Al Ward originals", () => {
  const montage = "a_rich_glossy_perfume_advertisement_layout_with_a.png";
  it.each([
    ["al-wataniah-sabah-al-ward-roxo", "Sabah Al Ward — Roxo", "/images/sabah-al-ward-roxo.png"],
    ["al-wataniah-sabah-al-ward-vermelho", "Sabah Al Ward — Vermelho", "/images/sabah-al-ward-vermelho.jpg"],
  ])("prioritizes the individual original for %s and preserves product data", async (slug, name, image) => {
    const source = { ...row, slug, name, brand: "Al Wataniah", price_cents: 19900, image_path: montage };
    const [product] = parseCatalog([source]);
    expect(product).toMatchObject({ slug, name, brand: "Al Wataniah", price: 199, image, featured: false });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify([source]))));
    expect(await readProduct(slug)).toEqual(product);
  });
  it("leaves Sugar Rosa and every other slug using their remote image", () => {
    const rosa = { ...row, slug: "sabahat-sabahat-al-ward", price_cents: 19900, image_path: "a_polished_luxurious_perfume_advertisement_poster.png" };
    const other = { ...row, image_path: montage };
    const products = parseCatalog([rosa, other]);
    expect(products.find(p => p.slug === rosa.slug)?.image).toBe(publicImageUrl(rosa.image_path));
    expect(products.find(p => p.slug === rosa.slug)?.price).toBe(199);
    expect(products.find(p => p.slug === other.slug)?.image).toBe(publicImageUrl(montage));
  });
});

describe("original photos", () => {
  it("links the uploaded Invictus photo without changing the price", () => {
    const [p] = parseCatalog([row]);
    expect(p?.image).toMatch(/paco-rabanne-invictus/);
    expect(p?.price).toBe(799);
  });
  it("keeps a placeholder for products without an original photo", () => {
    expect(parseCatalog([{ ...row, slug: "carolina-herrera-good-girl" }])[0]?.image).toBeNull();
  });
});