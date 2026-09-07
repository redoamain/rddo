# rddo — Company Profile (Astro + Sanity)

Website company profile programmer. Monorepo dengan dua folder independen:

```
rddo/
├── studio/   # Sanity Studio (standalone) — kelola konten
└── web/      # Astro app — tampilkan konten dari Sanity
```

## Konten model (di Sanity)

| Type       | Isi                                  |
| ---------- | ------------------------------------ |
| `profile`  | Nama, peran, bio, foto, email, sosial |
| `project`  | Proyek portofolio (gambar, tags, link) |
| `skill`    | Keahlian teknis + kategori + level    |
| `experience` | Riwayat kerja                       |

## Menjalankan

```bash
# Studio (kelola konten) — http://localhost:3333
cd studio && bun run dev

# Web (Astro) — http://localhost:4321
cd web && bun run dev
```

Kedua dev server berjalan sendiri-sendiri (Studio tidak di-embed ke web app).

## Docker (web)

Build image statis (konten Sanity di-fetch saat build) dan jalankan:

```bash
docker build -t rddo-web .
docker run -p 8080:80 rddo-web     # http://localhost:8090
```

Opsional override project saat build:

```bash
docker build --build-arg PUBLIC_SANITY_PROJECT_ID=xxx --build-arg PUBLIC_SANITY_DATASET=yyy -t rddo-web .
```

Atau pakai `docker compose` dari root repo untuk menjalankan web + studio sekaligus.

## Environment (web)

Salin `.env.example` ke `.env`:

```
PUBLIC_SANITY_PROJECT_ID=l9ie13zf
PUBLIC_SANITY_DATASET=production
```

Nilai tersebut publik (aman dibaca browser). Jangan pernah menaruh token/secret
di file `.env` yang dibundle ke frontend.

## TypeScript types dari Sanity (TypeGen)

Jenis skema + hasil query GROQ di-generate ke `web/sanity.types.ts`.

```bash
cd studio && bun run typegen
```

Jalankan ulang setiap kali mengubah skema atau query.

## Contoh konten (opsional)

```bash
cd studio && node scripts/seed-sample.mjs
```

Membuat dokumen contoh (1 profil, 3 proyek, 10 skill, 3 pengalaman) memakai
token login Sanity lokal. Hapus atau ganti isinya lewat Studio.
