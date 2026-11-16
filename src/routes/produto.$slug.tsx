import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatBRL } from "@/data/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productQuery } from "@/lib/catalog";
import { CatalogLoading, CatalogError, ProductNotFound } from "@/components/CatalogStates";
import { ProductArt } from "@/components/ProductArt";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return { product };
  },
  pendingMs: 200,
  pendingComponent: CatalogLoading,
  errorComponent: CatalogError,
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.brand} ${p.name} — AH!ROMA Perfumes` : "Produto não encontrado — AH!ROMA";
    const desc = p ? `${p.brand} ${p.name} por ${formatBRL(p.price)} no catálogo AH!ROMA.` : "Produto indisponível.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p?.image?.startsWith("https://") ? [{ property: "og:image", content: p.image }, { name: "twitter:image", content: p.image }] : []),
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(slug));
  if (!p) return <ProductNotFound />;
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Link to="/" className="text-xs tracking-widest text-gold">← CATÁLOGO</Link>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-gold/25 shadow-soft"><ProductArt product={p} /></div>
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{p.brand}</p>
            <h1 className="font-display text-4xl text-foreground">{p.name}</h1>
            <p className="mt-4 text-2xl text-primary">{formatBRL(p.price)}</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}