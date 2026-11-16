<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->
- Product catalog lives in src/data/products.ts; slugs are permanent URLs (/produto/<slug>) so new items append only.
- Public catalog reads use src/lib/catalog.ts REST GET with an apikey header and TanStack Query loaders; this supports the independent read-only source without provisioning a second backend.
- Preserve src/data/products.ts as a legacy URL fallback only; the live storefront uses active remote rows and the Invictus alias resolves to its remote slug to keep old links valid.
- Original product photos are Lovable Assets in src/assets/fotos/<slug>.asset.json, used only when the remote image_path is empty; the remote base stays read-only.
- Verified individual photo overrides in catalog parsing apply only to explicitly mapped slugs, shared by list and detail queries, to correct remote image mistakes without writing to the independent catalog.