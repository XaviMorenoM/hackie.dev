# hackie.dev — infra notes (GitHub Pages + GoDaddy DNS)

## GitHub side (done)
- Repo: https://github.com/XaviMorenoM/hackie.dev (public)
- Pages: build_type=workflow, cname=hackie.dev, https_enforced=false (pending cert)
- Workflow: `.github/workflows/deploy.yml` (withastro/action@v3 → deploy-pages@v4, push to main + workflow_dispatch)
- `public/CNAME` = `hackie.dev`

## DNS records to set at GoDaddy (apex custom domain on GitHub Pages)

Remove first:
- Any parked/placeholder A record on `@`.
- Stale `_vercel` TXT record (leftover from a previous host).

Add:
| Type  | Host | Value                   |
|-------|------|-------------------------|
| A     | @    | 185.199.108.153         |
| A     | @    | 185.199.109.153         |
| A     | @    | 185.199.110.153         |
| A     | @    | 185.199.111.153         |
| AAAA  | @    | 2606:50c0:8000::153     |
| AAAA  | @    | 2606:50c0:8001::153     |
| AAAA  | @    | 2606:50c0:8002::153     |
| AAAA  | @    | 2606:50c0:8003::153     |
| CNAME | www  | xavimorenom.github.io   |

## Verification commands

```bash
dig hackie.dev +short          # expect the 4 A records above
dig www.hackie.dev +short      # expect xavimorenom.github.io. (then GH's A/AAAA)
curl -sI https://hackie.dev    # expect 200/301 once cert is issued + first deploy exists
```

## Post-deploy commands

If the custom domain PUT was deferred (Pages refused cname before a first deployment
existed), set it after the first successful deploy to `main`:

```bash
gh api -X PUT /repos/XaviMorenoM/hackie.dev/pages -f cname=hackie.dev -f build_type=workflow
```

Once DNS has propagated and GitHub has issued the TLS cert (see below), enforce HTTPS:

```bash
gh api -X PUT /repos/XaviMorenoM/hackie.dev/pages -F https_enforced=true
```

## Checking cert status

```bash
gh api /repos/XaviMorenoM/hackie.dev/pages --jq '.https_certificate'
```

Also watch `protected_domain_state` and `pending_domain_unverified_at` in the same
response — non-null values there mean GitHub hasn't finished verifying domain
ownership yet (DNS not propagated, or a CAA record blocking issuance).
