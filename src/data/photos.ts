// Fotos originais enviadas pela AH!ROMA, associadas manualmente por slug.
// A foto do banco (image_path) tem prioridade; sem foto aqui, aparece o placeholder.
const files = import.meta.glob<{ url: string }>("../assets/fotos/*.asset.json", { eager: true, import: "default" });
export const photoBySlug: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, a]) => [path.split("/").pop()!.replace(".asset.json", ""), a.url]),
);