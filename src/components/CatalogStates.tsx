import { Link, useRouter } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";

export function CatalogLoading() {
  return <div className="min-h-screen bg-background"><SiteHeader />
    <main className="mx-auto max-w-5xl px-4 py-8" role="status" aria-live="polite">
      <p className="mb-6 text-center text-sm text-muted-foreground">Carregando perfumes…</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => <div key={i} className="aspect-[4/5] rounded-xl bg-secondary motion-safe:animate-pulse" />)}
      </div>
    </main></div>;
}

export function CatalogError() {
  const router = useRouter();
  const boundary = useQueryErrorResetBoundary();
  return <div className="min-h-screen bg-background"><SiteHeader />
    <main className="mx-auto max-w-md px-4 py-16 text-center" role="alert">
      <h1 className="font-display text-3xl text-foreground">Catálogo indisponível</h1>
      <p className="my-4 text-sm text-muted-foreground">Não foi possível carregar os perfumes. Tente novamente em instantes.</p>
      <Button onClick={() => { boundary.reset(); void router.invalidate(); }}><RefreshCw />Tentar novamente</Button>
    </main></div>;
}

export function ProductNotFound() {
  return <div className="min-h-screen bg-background"><SiteHeader />
    <p className="p-10 text-center text-muted-foreground">Produto não encontrado. <Link to="/" className="text-primary underline">Ver catálogo</Link></p>
  </div>;
}