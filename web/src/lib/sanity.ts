import { sanityClient } from 'sanity:client';
import { defineQuery } from 'groq';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import type {
	EXPERIENCES_QUERY_RESULT,
	PROFILE_QUERY_RESULT,
	PROJECTS_QUERY_RESULT,
} from '../../sanity.types';

// ---- Queries (module-scope, typed via TypeGen) ----

const PROFILE_QUERY = defineQuery(
	`*[_type == "profile"][0]{
  _id,
  name,
  nickname,
  role,
  tagline,
  bio,
  avatar,
  email,
  location,
  socials[]{
    _key,
    label,
    url
  }
}`,
);

const PROJECTS_QUERY = defineQuery(
	`*[_type == "project"] | order(order asc, _createdAt desc){
  _id,
  title,
  slug,
  summary,
  description,
  coverImage,
  tags,
  liveUrl,
  repoUrl
}`,
);

const EXPERIENCES_QUERY = defineQuery(
	`*[_type == "experience"] | order(startDate desc){
  _id,
  position,
  company,
  location,
  startDate,
  endDate,
  current,
  summary,
  tags
}`,
);

// ---- Fallback data (prevent build/runtime crash when offline or network fails) ----

const FALLBACK_PROFILE: PROFILE_QUERY_RESULT = {
	_id: 'fallback-profile',
	name: 'Redho Arifin',
	nickname: 'Redo',
	role: 'Backend Developer & Systems Specialist',
	tagline: 'Building resilient backend architecture, Linux server infrastructure, and robust automated tools.',
	bio: null,
	avatar: null,
	email: 'redhoarifin@gmail.com',
	location: 'Surabaya, Indonesia',
	socials: [
		{ _key: 'gh', label: 'GitHub', url: 'https://github.com/redoamain' },
		{ _key: 'li', label: 'LinkedIn', url: 'https://linkedin.com/in/redho-arifin' },
	],
};

const FALLBACK_PROJECTS: PROJECTS_QUERY_RESULT = [
	{
		_id: 'p-1',
		title: 'PT CITI PLUMB Inventory & Operations System',
		slug: { _type: 'slug', current: 'citi-plumb-operations' },
		summary: 'Arsitektur sistem manajemen operasional, inventory tracking, dan otomatisasi sinkronisasi data distribusi skala industri.',
		description: null,
		coverImage: null,
		tags: ['Go', 'PostgreSQL', 'Docker', 'Linux', 'Tailwind'],
		liveUrl: null,
		repoUrl: 'https://github.com/redoamain',
	},
	{
		_id: 'p-2',
		title: 'Harmoni Multi-Tenant Service Gateway',
		slug: { _type: 'slug', current: 'harmoni-platform' },
		summary: 'Backend API gateway dengan autentikasi terpusat, rate limiting, dan background worker untuk sistem pelaporan bisnis.',
		description: null,
		coverImage: null,
		tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
		liveUrl: null,
		repoUrl: 'https://github.com/redoamain',
	},
	{
		_id: 'p-3',
		title: 'High-Throughput Distributed Queue Engine',
		slug: { _type: 'slug', current: 'distributed-queue-engine' },
		summary: 'Sistem pemrosesan antrean pesan background dengan fault-tolerance tinggi, retry mechanism, dan telemetry logging.',
		description: null,
		coverImage: null,
		tags: ['Go', 'RabbitMQ', 'Redis', 'Prometheus', 'Grafana'],
		liveUrl: null,
		repoUrl: 'https://github.com/redoamain',
	},
];

const FALLBACK_EXPERIENCES: EXPERIENCES_QUERY_RESULT = [
	{
		_id: 'exp-1',
		position: 'Backend Developer',
		company: 'Harmoni Software House',
		location: 'Surabaya, Indonesia',
		startDate: '2023-01-01',
		endDate: null,
		current: true,
		summary: 'Membangun arsitektur backend, REST/gRPC API, dan manajemen database relasional dengan performa tinggi.',
		tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
	},
	{
		_id: 'exp-2',
		position: 'Systems & Infrastructure Specialist',
		company: 'PT CITI PLUMB',
		location: 'Surabaya, Indonesia',
		startDate: '2022-01-01',
		endDate: null,
		current: true,
		summary: 'Mengelola server Linux, otomatisasi deployment, monitoring uptime, serta backup & disaster recovery.',
		tags: ['Linux', 'Ubuntu Server', 'Bash', 'Docker', 'PostgreSQL'],
	},
];

// ---- Fetch helpers ----

export async function getProfile(): Promise<PROFILE_QUERY_RESULT> {
	try {
		const res = await sanityClient.fetch(PROFILE_QUERY);
		return res ?? FALLBACK_PROFILE;
	} catch (err) {
		console.warn('[Sanity] Warning: Failed to fetch profile (using fallback):', (err as Error)?.message);
		return FALLBACK_PROFILE;
	}
}

export async function getProjects(): Promise<PROJECTS_QUERY_RESULT> {
	try {
		const res = await sanityClient.fetch(PROJECTS_QUERY);
		return res && res.length > 0 ? res : FALLBACK_PROJECTS;
	} catch (err) {
		console.warn('[Sanity] Warning: Failed to fetch projects (using fallback):', (err as Error)?.message);
		return FALLBACK_PROJECTS;
	}
}

export async function getExperiences(): Promise<EXPERIENCES_QUERY_RESULT> {
	try {
		const res = await sanityClient.fetch(EXPERIENCES_QUERY);
		return res && res.length > 0 ? res : FALLBACK_EXPERIENCES;
	} catch (err) {
		console.warn('[Sanity] Warning: Failed to fetch experiences (using fallback):', (err as Error)?.message);
		return FALLBACK_EXPERIENCES;
	}
}

// ---- Image URL helpers ----

// Generated Sanity image fields carry {asset?: {_ref|_id|url}} plus crop/hotspot.
type ImageSource = { asset?: { _ref?: string } | { url?: string } | null } | null | undefined;

const builder = createImageUrlBuilder(sanityClient);

/** Builder chain helper; returns null when no asset is set. */
export function urlFor(source: ImageSource) {
	if (!source?.asset) return null;
	return builder.image(source as SanityImageSource);
}

/** Convenience: full URL string with auto format + width. */
export function imageUrl(source: ImageSource, width = 800): string | null {
	const img = urlFor(source);
	if (!img) return null;
	return img.width(width).auto('format').url();
}

/** "2022-03-01" → "March 2022" (en-US). */
export function formatMonthYear(iso: string | null | undefined): string {
	if (!iso) return '';
	const d = new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso ?? '';
	return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
}
