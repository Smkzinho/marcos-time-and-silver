<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Pages/components read catalog only via `src/services/catalog.ts`; Nuvemshop code lives in `src/services/nuvemshop/` with credentials server-only — keeps the data source swappable without touching UI. See `docs/ESTRUTURA.md`.
