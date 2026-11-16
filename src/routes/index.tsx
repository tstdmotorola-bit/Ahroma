import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatBRL } from "@/data/products";
import { catalogQuery } from "@/lib/catalog";
import { CatalogLoading, CatalogError, ProductNotFound } from "@/components/CatalogStates";
import { ProductArt } from "@/components/ProductArt";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => (typeof search['q'] === "string" ? { q: search['q'] } : {}),
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(catalogQuery); },
  pendingMs: 200,
  pendingComponent: CatalogLoading,
  errorComponent: CatalogError,
  notFoundComponent: ProductNotFound,
  head: () => ({
    meta: [
      { title: "AH!ROMA Perfumes — Catálogo" },
      { name: "description", content: "Catálogo de perfumes AH!ROMA: fragrâncias importadas e árabes selecionadas." },
      { property: "og:title", content: "AH!ROMA Perfumes — Catálogo" },
      { property: "og:description", content: "Fragrâncias importadas e árabes selecionadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Index() {
  const { q = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: products } = useSuspenseQuery(catalogQuery);
  const list = products.filter((p) => norm(`${p.brand} ${p.name}`).includes(norm(q)));
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-16">
        <section className="py-8 text-center">
          <h1 className="font-display text-4xl italic text-foreground">Nosso Catálogo</h1>
          <p className="mt-2 text-sm text-muted-foreground">Fragrâncias que contam a sua história.</p>
        </section>
        <input
          type="search"
          value={q}
          onChange={(e) => { void navigate({ search: { q: e.target.value }, replace: true, resetScroll: false }); }}
          placeholder="Buscar perfume ou marca…"
          aria-label="Buscar perfume"
          className="w-full rounded-full border border-gold/40 bg-card px-5 py-3 text-sm outline-none focus:border-gold"
        />
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <li key={p.slug}>
              <Link to="/produto/$slug" params={{ slug: p.slug }} className="group block overflow-hidden rounded-xl border border-gold/25 bg-card shadow-soft transition hover:-translate-y-1">
                <ProductArt product={p} />
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold">{p.brand}</p>
                  <h2 className="font-display text-lg leading-tight text-foreground">{p.name}</h2>
                  <p className="mt-1 text-sm font-medium text-primary">{formatBRL(p.price)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="mt-10 text-center text-sm text-muted-foreground">{products.length === 0 ? "Nenhum perfume disponível no momento." : "Nenhum perfume encontrado."}</p>}
      </main>
      <SiteFooter />
    </div>
  );
}