# Sanity Studio — rddo

Content Studio standalone untuk company profile programmer (project `l9ie13zf`,
dataset `production`). Dipakai untuk mengelola konten yang ditampilkan aplikasi
Astro di folder `web/`.

## Menjalankan

```bash
bun install
bun run dev   # http://localhost:3333
```

## Docker (studio)

```bash
docker build -t rddo-studio .
docker run -p 3333:3333 rddo-studio   # http://localhost:3333
```

Opsional, berikan token agar CLI/studio terautentikasi tanpa login browser:

```bash
docker run -p 3333:3333 -e SANITY_AUTH_TOKEN=sk... rddo-studio
```

Atau pakai `docker compose` dari root repo.

## Skema

Skema ada di `schemaTypes/`:

```
schemaTypes/
├── index.ts                  # Daftar semua tipe
├── documents/                # Dokumen: profile, project, skill, experience
└── objects/                  # Objek reusable: socialLink
```

## TypeGen

TypeScript types untuk frontend di-generate dari skema dan query GROQ di `web/`:

```bash
bun run typegen   # -> ../web/sanity.types.ts
```

## Contoh konten

```bash
node scripts/seed-sample.mjs
```

## Deploy Studio

```bash
bun run deploy
```
