# Deploy rddo ke Vercel — Web (Astro) + Studio (Sanity)

Monorepo ini berisi dua app independen, masing-masing jadi **1 Vercel Project**:

```
rddo/
├── web/      # Astro static site + Function api/visits → Vercel Project #1
└── studio/   # Sanity Studio (Vite SPA)                  → Vercel Project #2
```

## 0. Push repo ke GitHub

Vercel deploy dari GitHub, jadi semua file harus ter-commit + ter-push:

```bash
cd /home/user/Documents/project/rddo
git add -A
git status --short          # pastikan web/api/visits.js & studio/vercel.json ikut
git commit -m "chore: deploy web + studio ke Vercel"
git push origin main
```

## 1. Deploy web (Astro) ke Vercel — Project #1

`web/vercel.json` sudah berisi build `bun run build`, output `dist`,
framework `astro`. Folder `web/api/` otomatis jadi Serverless Functions
(`web/api/visits.js` → `GET /api/visits`).

Langkah di dashboard Vercel:

1. **Add New → Project → Import** repo `redoamain/rddo` (beri nama mis. `rddo-web`).
2. **Root Directory = `web`** (penting — jangan deploy dari root).
3. Framework preset otomatis terdeteksi `Astro`. Pastikan:
   - Build Command: `bun run build`
   - Output Directory: `dist`
   - Install Command: `bun install` (otomatis karena ada `bun.lock`)
4. **Environment Variables** (Production + Preview):
   | Key | Value | Keterangan |
   | --- | ----- | ---------- |
   | `PUBLIC_SANITY_PROJECT_ID` | `l9ie13zf` | publik, aman ke browser |
   | `PUBLIC_SANITY_DATASET` | `production` | publik, aman ke browser |
   | `SANITY_API_TOKEN` | `sk...` | **server-only** (tanpa prefix `PUBLIC_`), dipakai Vercel Function `api/visits.js` untuk visitor counter. Buat di manage.sanity.io → project `l9ie13zf` → **API → Tokens** (role **Editor**). Jangan pernah pakai prefix `PUBLIC_` agar tidak terbundle ke browser. |
5. **Deploy.** Setiap `git push` ke `main` otomatis redeploy.
   ⚠️ Setiap **ubah/tambah env var wajib Redeploy** (Deployments → ⋯ → Redeploy)
   agar function ikut restart dengan env baru.

## 2. Deploy Studio (Sanity) ke Vercel — Project #2

`studio/vercel.json` sudah berisi build `bun run build` (`sanity build` →
`dist/`) + rewrite SPA fallback ke `index.html` agar routing Studio tidak 404.

Langkah di dashboard Vercel:

1. **Add New → Project → Import** repo `redoamain/rddo` **lagi**
   (satu repo bisa dipakai banyak project — beri nama mis. `rddo-studio`).
2. **Root Directory = `studio`**.
3. Framework preset pilih **Other** (atau Vite). Pastikan:
   - Build Command: `bun run build`
   - Output Directory: `dist`
   - Install Command: `bun install`
4. Tidak perlu env var (projectId/dataset sudah hardcoded di `sanity.config.ts`).
5. **Deploy.** Hasilnya mis. `https://rddo-studio.vercel.app`.

> Alternatif: `cd studio && bun run deploy` (Sanity hosting,
> `https://<nama>.sanity.studio`). Tidak wajib kalau Studio sudah di Vercel.

### Visitor counter real (tiap refresh +1)

Counter "You are visitor number" bukan lagi angka statis: tiap page load /
refresh, browser memanggil `GET /api/visits` (Vercel Function di `web/api/`),
yang menambah `visits` +1 secara atomik di dokumen Sanity `siteStats`
(dibuat otomatis saat hit pertama) lalu mengembalikan totalnya.

- Tanpa `SANITY_API_TOKEN`, endpoint mengembalikan 500 dan halaman tetap
  menampilkan angka fallback (tidak merusak tampilan).
- `astro dev` lokal tidak menjalankan Vercel Function, jadi di lokal selalu
  tampil angka fallback — angka real hanya terlihat di deployment Vercel
  (atau via `vercel dev`).
- Reset counter: ubah field `visits` di dokumen `Statistik Situs` lewat Studio.

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

## 3. Deploy Studio ke Sanity hosting (opsional)

Kalau Studio sudah jalan di Vercel (bagian 2), bagian ini boleh dilewati.

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

## 4. Ringkasan service

| App | Vercel Project | Root Directory | Deploy | URL contoh |
| --- | -------------- | -------------- | ------ | ---------- |
| `web` | `rddo-web` | `web` | otomatis tiap push + Deploy Hook | `https://rddo-web.vercel.app` |
| `studio` | `rddo-studio` | `studio` | otomatis tiap push | `https://rddo-studio.vercel.app` |

## 5. Troubleshooting (kalau hanya Astro yang jalan)

### A. Counter visitor tidak bertambah / angka tidak berubah

Tes langsung endpoint-nya di browser:

```
https://<domain-web-kamu>/api/visits
```

| Hasil | Artinya | Perbaikan |
| ----- | ------- | --------- |
| `{"visits": N}` dan N bertambah tiap refresh | ✅ Function OK | — |
| `404` | Function tidak ter-deploy (umumnya Root Directory bukan `web`, atau file belum ter-push) | Pastikan Vercel → Settings → General → Root Directory = `web`; pastikan `web/api/visits.js` ada di GitHub; Redeploy |
| `500` + `...belum dikonfigurasi` | `SANITY_API_TOKEN` / `PUBLIC_SANITY_PROJECT_ID` belum diset | Tambah env di Vercel → Settings → Environment Variables (Production), lalu **Redeploy** |
| `502` + `stage: "mutate"`, `upstreamStatus: 401/403` | Token salah / role bukan Editor | Buat token baru role **Editor** di manage.sanity.io → API → Tokens, update env, Redeploy |
| `502` + `stage` lain | Sanity API gangguan / projectId/dataset salah | Cek `PUBLIC_SANITY_PROJECT_ID` dan `PUBLIC_SANITY_DATASET` |

Catatan: halaman tetap tampil normal saat API error (counter memakai angka
fallback) — jadi "web jalan tapi counter mati" = salah satu baris di atas.

### B. Deploy project Studio gagal di Vercel

- Pastikan ini project **terpisah** dengan Root Directory = `studio`
  (bukan satu project dengan root repo).
- Build Command `bun run build`, Output Directory `dist`.
- Error `sanity: command not found` → Install Command belum jalan / `bun.lock`
  tidak terbaca: set Install Command = `bun install` secara eksplisit.
- Halaman Studio 404 saat navigasi dalam (mis. refresh di `/structure/...`)
  → pastikan `studio/vercel.json` (rewrite ke `/index.html`) ter-push.

### C. Studio terbuka tapi error `NetworkError ... (xxx.api.sanity.io)`

Ini **CORS**: browser memblokir Studio di domain Vercel karena origin-nya
belum diizinkan di project Sanity. Perbaikan (sekali saja per domain):

1. Buka [manage.sanity.io](https://manage.sanity.io) → project `l9ie13zf` →
   **API → CORS Origins → Add CORS origin**.
2. Origin: `https://<domain-studio-kamu>.vercel.app`
   (mis. `https://redoamain-rddo.vercel.app`), centang **Allow credentials**.
3. Ulangi untuk domain web (`https://<domain-web>.vercel.app`) dan domain
   custom bila ada.
4. Refresh halaman Studio.

> Catatan: URL Preview Vercel (`*.vercel.app` acak per deployment) tidak bisa
> didaftarkan sekaligus (Sanity tidak mendukung wildcard) — tes Studio di URL
> Production.

### D. Konten Sanity baru tidak muncul di web

`web` adalah static site (konten di-fetch saat build). Ikuti
"Rebuild otomatis saat konten Sanity berubah" di bagian 1 di atas
(Deploy Hook Vercel + webhook Sanity).

## 6. Catatan Docker

`docker-compose.yml` di root tetap ada untuk jalan lokal
(`docker compose up -d --build`), tapi **tidak dipakai** untuk deploy Vercel.
