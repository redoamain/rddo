# Deploy rddo — Web ke Vercel, Studio ke Sanity hosting

Monorepo ini berisi dua app independen:

```
rddo/
├── web/      # Astro static site → deploy ke Vercel
└── studio/   # Sanity Studio   → deploy ke Sanity hosting (`sanity deploy`)
```

## 0. Push repo gabungan ke GitHub

Repo ini sudah 1 git di root (`main`). Remote: `origin → https://github.com/redoamain/rddo.git`.

```bash
cd /home/user/Documents/project/rddo
git add -A
git commit -m "chore: monorepo web + studio, deploy Vercel + Sanity hosting"
git remote add origin https://github.com/redoamain/rddo.git  # jika belum ada
git push -u origin main
```

## 1. Deploy web (Astro) ke Vercel

`web/` adalah **static site** — konten Sanity di-fetch saat `bun run build`.
Tidak perlu adapter tambahan. `web/vercel.json` sudah berisi:

- Build command: `bun run build`
- Output directory: `dist`
- Framework: `astro`

Langkah di dashboard Vercel:

1. **Add New → Project → Import** repo `redoamain/rddo`.
2. **Root Directory = `web`** (penting — jangan deploy dari root).
3. Framework preset otomatis terdeteksi `Astro`. Pastikan:
   - Build Command: `bun run build`
   - Output Directory: `dist`
   - Install Command: `bun install` (otomatis karena ada `bun.lock`)
4. **Environment Variables** (Production + Preview):
   | Key | Value |
   | --- | ----- |
   | `PUBLIC_SANITY_PROJECT_ID` | `l9ie13zf` |
   | `PUBLIC_SANITY_DATASET` | `production` |
5. **Deploy.** Setiap `git push` ke `main` otomatis redeploy.

### Rebuild otomatis saat konten Sanity berubah (wajib untuk static site)

Karena konten di-fetch saat build, buat Deploy Hook agar publish di Studio
otomatis membangun ulang web:

1. Vercel → Project (`web`) → **Settings → Git → Deploy Hooks** → buat hook
   (mis. nama `sanity-publish`) → salin URL-nya.
2. Sanity → [manage.sanity.io](https://manage.sanity.io) → project `l9ie13zf`
   → **API → Webhooks** → Create webhook:
   - Dataset: `production`
   - Trigger on: Create, Update, Delete (atau Publish)
   - URL: tempel URL Deploy Hook Vercel
   - Method: POST
3. Uji: ubah konten di Studio → Publish → web ter-rebuild otomatis.

## 2. Deploy Studio ke Sanity hosting

Butuh akun dengan akses ke project `l9ie13zf`.

```bash
cd studio
bun install
npx sanity login          # login via browser, sekali saja
bun run deploy            # pilih hostname, mis. `rddo`
```

Hasilnya mis. `https://rddo.sanity.studio`.
`sanity.cli.ts` sudah mengaktifkan `deployment.autoUpdates: true`,
jadi Studio selalu memakai versi Sanity terbaru.

Update berikutnya tinggal:

```bash
cd studio && bun run deploy
```

### CORS origins (jika web memanggil API Sanity dari browser)

Jika ada fetch client-side ke Sanity API, daftarkan domain Vercel di:

- [manage.sanity.io](https://manage.sanity.io) → project `l9ie13zf`
  → **API → CORS Origins** → Add:
  - `https://<project-web>.vercel.app`
  - domain custom (jika ada)

## 3. Ringkasan service

| App | Hosting | Deploy | URL contoh |
| --- | ------- | ------ | ---------- |
| `web` | Vercel (Root Dir `web`) | otomatis tiap push + Deploy Hook | `https://rddo-web.vercel.app` |
| `studio` | Sanity hosting | `cd studio && bun run deploy` | `https://rddo.sanity.studio` |

## 4. Catatan Docker

`docker-compose.yml` di root tetap ada untuk jalan lokal
(`docker compose up -d --build`), tapi **tidak dipakai** untuk deploy
Vercel + Sanity hosting.
