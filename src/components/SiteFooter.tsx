import { Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";
import marca from "@/assets/marca/ahroma-marca.jpg.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/40 bg-brand-rose py-8 text-center">
      <Link to="/" aria-label="AH!ROMA Perfumes — voltar ao catálogo" className="inline-block">
        <img
          src={marca.url}
          alt="AH!ROMA Perfumes"
          width={160}
          height={161}
          className="mx-auto h-20 w-auto rounded-md shadow-soft"
        />
      </Link>
      <p className="mt-4 text-xs tracking-[0.2em] text-brand-rose-foreground/90">© AH!ROMA PERFUMES</p>
      <a href="https://www.instagram.com/thiago_souzaa1/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs text-brand-rose-foreground"><Instagram size={16} /> @thiago_souzaa1</a>
    </footer>
  );
}