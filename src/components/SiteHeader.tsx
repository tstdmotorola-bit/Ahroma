import { Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";
import marca from "@/assets/marca/ahroma-marca.jpg.asset.json";

export function SiteHeader() {
  return (
    <header className="border-b border-gold/40 bg-brand-rose py-6 text-center">
      <Link to="/" aria-label="AH!ROMA Perfumes — voltar ao catálogo" className="inline-block">
        <img
          src={marca.url}
          alt="AH!ROMA Perfumes"
          width={320}
          height={321}
          className="mx-auto h-32 w-auto rounded-md shadow-soft sm:h-40"
        />
      </Link>
      <a href="https://www.instagram.com/thiago_souzaa1/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Ahroma" className="mt-3 inline-flex items-center gap-2 text-sm text-brand-rose-foreground hover:opacity-80"><Instagram size={18} /> @thiago_souzaa1</a>
    </header>
  );
}