# rddo — Company Profile (Astro + Sanity)

Repo berisi dua aplikasi independen:

```
rddo/
├── studio/              # Sanity Studio (standalone content studio)
├── web/                 # Astro static site (company profile)
├── docker-compose.yml   # Jalankan web + studio via Docker
└── README.md            # Ini
```

Detail setup & skrip masing-masing ada di `web/README.md` dan `studio/README.md`.

## Deploy (Vercel)

Lihat panduan lengkap di [`DEPLOY.md`](./DEPLOY.md):

- `web/` → Vercel Project `rddo-web` (Root Directory `web`, env
  `PUBLIC_SANITY_PROJECT_ID` + `PUBLIC_SANITY_DATASET` + server-only
  `SANITY_API_TOKEN` untuk visitor counter, plus Deploy Hook untuk rebuild otomatis).
- `studio/` → Vercel Project `rddo-studio` (Root Directory `studio`).

## Jalankan dengan Docker (satu perintah)

```bash
docker compose up -d --build
```

Hasilnya:

| Service | URL                   | Keterangan                                  |
| ------- | --------------------- | ------------------------------------------- |
| `web`   | http://localhost:8090 | nginx — static Astro build, konten dari Sanity |
| `studio`| http://localhost:3333 | Sanity Studio                               |

### Catatan penting

- **Konten di-fetch saat build.** Karena `web` adalah static site, konten
  Sanity dirender ke HTML pada waktu `docker build`. Setelah mengubah konten di
  Studio, rebuild image web agar situs ikut terbarui:

  ```bash
  docker compose build web
  docker compose up -d web
  ```

- **Dataset production public-read** → image web bisa di-build tanpa token.
  Untuk mengubah dataset/project, override build args:

  ```bash
  PUBLIC_SANITY_PROJECT_ID=xxx PUBLIC_SANITY_DATASET=yyy docker compose build web
  ```

- **Studio** berjalan via `sanity dev`. Agar terautentikasi tanpa login di
  browser, set token:

  ```bash
  SANITY_AUTH_TOKEN=sk... docker compose up -d
  ```

### Tanpa Docker (dev)

```bash
cd studio && bun run dev    # http://localhost:3333
cd web && bun run dev       # http://localhost:4321
```
