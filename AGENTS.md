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

## Architecture rules
- Public ticket creation goes through the `criarChamado` server function calling the service-role-only `criar_chamado` DB function; anon has no direct table access (keeps validation and rate limiting server-side).
- Admin access is decided only by membership in `public.admin_users` via `is_admin()`; never by user metadata.
