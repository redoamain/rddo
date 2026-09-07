#!/usr/bin/env node
/**
 * Seed contoh konten untuk company profile programmer.
 *
 * Membuat dokumen Sanity via HTTP API:
 *   - 1 profile
 *   - 3 project
 *   - 10 skill
 *   - 3 experience
 *
 * Penggunaan:
 *   node scripts/seed-sample.mjs            # pakai token login dari ~/.config/sanity
 *   SANITY_AUTH_TOKEN=sk... node scripts/seed-sample.mjs
 *
 * Token TIDAK disimpan di repo — dibaca dari config login lokal.
 */

import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const PROJECT_ID = 'l9ie13zf'
const DATASET = 'production'
const API_VERSION = 'v1'

const here = resolve(fileURLToPath(import.meta.url), '..')
const assetDir = join(here, 'assets')

function getToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN
  try {
    const cfg = JSON.parse(readFileSync(join(homedir(), '.config', 'sanity', 'config.json'), 'utf8'))
    if (cfg.authToken) return cfg.authToken
  } catch {
    /* ignore */
  }
  throw new Error(
    'Tidak menemukan token. Jalankan `npx sanity login` dulu atau set env SANITY_AUTH_TOKEN.'
  )
}

const token = getToken()

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

let keyCounter = 0
const key = () => `seed${(keyCounter++).toString(36).padStart(4, '0')}`

// ---------- Portable Text helper ----------
function pt(text) {
  return [
    {
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: key(), text, marks: []}],
    },
  ]
}

// ---------- Asset upload ----------
async function uploadAsset(fileName) {
  const filePath = join(assetDir, fileName)
  const body = readFileSync(filePath)
  const mime = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg'
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/assets/images/${DATASET}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': mime,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
      body,
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Upload ${fileName} gagal: ${res.status} ${err}`)
  }
  const payload = await res.json()
  const assetId = payload.document?._id ?? payload._id
  if (!assetId) throw new Error(`Upload ${fileName}: tidak ada _id pada respons`)
  return {_type: 'image', asset: {_type: 'reference', _ref: assetId}}
}

// ---------- Mutate ----------
async function mutate(mutations) {
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({mutations}),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Mutasi gagal: ${res.status} ${err}`)
  }
  return res.json()
}

// ---------- Data ----------
const profile = {
  _type: 'profile',
  name: 'Raka Pratama',
  role: 'Full-Stack Developer',
  tagline: 'Membangun aplikasi web yang cepat, aman, dan mudah dipakai.',
  bio: pt(
    'Saya programmer dengan lebih dari 5 tahun pengalaman membangun aplikasi web end-to-end — dari desain database, REST API, sampai frontend yang responsif. Fokus saya: menulis kode yang bersih, terdokumentasi, dan bisa dirawat dalam jangka panjang.'
  ),
  email: 'halo@rddo.dev',
  location: 'Jakarta, Indonesia',
  socials: [
    {_type: 'socialLink', _key: key(), label: 'GitHub', url: 'https://github.com/rakapratama'},
    {_type: 'socialLink', _key: key(), label: 'LinkedIn', url: 'https://linkedin.com/in/rakapratama'},
    {_type: 'socialLink', _key: key(), label: 'Twitter', url: 'https://twitter.com/rakapratama'},
  ],
}

const projects = [
  {
    _type: 'project',
    title: 'API E-Commerce',
    slug: {_type: 'slug', current: 'api-e-commerce'},
    summary: 'REST API toko online dengan autentikasi JWT, manajemen produk, dan integrasi pembayaran.',
    coverImage: 'project1.jpg',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/rakapratama/ecommerce-api',
    order: 1,
  },
  {
    _type: 'project',
    title: 'Dashboard Analitik',
    slug: {_type: 'slug', current: 'dashboard-analitik'},
    summary: 'Dashboard real-time untuk visualisasi data penjualan dengan grafik interaktif.',
    coverImage: 'project2.jpg',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/rakapratama/analytics-dashboard',
    order: 2,
  },
  {
    _type: 'project',
    title: 'Company Profile Website',
    slug: {_type: 'slug', current: 'company-profile-website'},
    summary: 'Website company profile statis dengan Astro, konten dikelola lewat Sanity.',
    coverImage: 'project3.jpg',
    tags: ['Astro', 'Sanity', 'Tailwind CSS'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/rakapratama/astro-sanity',
    order: 3,
  },
]

const skills = [
  {name: 'React', category: 'frontend', level: 'expert'},
  {name: 'TypeScript', category: 'frontend', level: 'expert'},
  {name: 'Astro', category: 'frontend', level: 'advanced'},
  {name: 'Tailwind CSS', category: 'frontend', level: 'expert'},
  {name: 'Node.js', category: 'backend', level: 'expert'},
  {name: 'Express', category: 'backend', level: 'advanced'},
  {name: 'PostgreSQL', category: 'database', level: 'advanced'},
  {name: 'Redis', category: 'database', level: 'intermediate'},
  {name: 'Docker', category: 'devops', level: 'intermediate'},
  {name: 'React Native', category: 'mobile', level: 'intermediate'},
]

const experiences = [
  {
    _type: 'experience',
    position: 'Senior Web Developer',
    company: 'PT Teknologi Nusantara',
    location: 'Jakarta',
    startDate: '2022-03-01',
    current: true,
    summary:
      'Memimpin pengembangan platform web perusahaan, mengelola tim 4 developer, dan memperkenalkan CI/CD yang memangkas waktu rilis dari mingguan menjadi harian.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    _type: 'experience',
    position: 'Full-Stack Developer',
    company: 'Startup Digital ID',
    location: 'Remote',
    startDate: '2019-06-01',
    endDate: '2022-02-28',
    current: false,
    summary:
      'Membangun fitur end-to-end untuk produk SaaS dengan 10.000+ pengguna aktif, termasuk sistem pembayaran dan panel admin.',
    tags: ['Vue.js', 'Laravel', 'MySQL'],
  },
  {
    _type: 'experience',
    position: 'Junior Web Developer',
    company: 'Studio Kreatif Abadi',
    location: 'Bandung',
    startDate: '2017-01-01',
    endDate: '2019-05-31',
    current: false,
    summary:
      'Mengerjakan website company profile dan landing page untuk berbagai klien UKM.',
    tags: ['PHP', 'jQuery', 'Bootstrap'],
  },
]

// ---------- Main ----------
async function main() {
  console.log('Mengunggah gambar sampul…')
  const [avatar, p1, p2, p3] = await Promise.all([
    uploadAsset('avatar.jpg'),
    uploadAsset('project1.jpg'),
    uploadAsset('project2.jpg'),
    uploadAsset('project3.jpg'),
  ])

  profile.avatar = avatar
  projects[0].coverImage = p1
  projects[1].coverImage = p2
  projects[2].coverImage = p3

  const mutations = []
  mutations.push({create: profile})
  for (const p of projects) {
    const {coverImage, ...rest} = p
    mutations.push({create: {...rest, coverImage}})
  }
  for (const s of skills) {
    mutations.push({create: {...s, _type: 'skill'}})
  }
  for (const e of experiences) {
    mutations.push({create: e})
  }

  const result = await mutate(mutations)
  const created = result.results.filter((r) => r.operation === 'create').length
  console.log(`Selesai. ${created} dokumen dibuat.`)
  console.log('Cek di Studio: cd studio && bun run dev')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
