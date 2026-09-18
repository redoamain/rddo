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

const SKILLS_QUERY = defineQuery(
	`*[_type == "skill"] | order(category asc, level desc, name asc){
  _id,
  name,
  category,
  level
}`,
);

export type SkillItem = {
	_id: string;
	name: string | null;
	category: string | null;
	level: string | null;
};

// ---- Fallback data (synchronized with real documents in Sanity Studio) ----

const FALLBACK_PROFILE: PROFILE_QUERY_RESULT = {
	_id: 'nXfR47JxO13AdXevw2UdM1',
	name: 'Redho Arifin',
	nickname: 'Redo',
	role: 'Backend Developer',
	tagline: 'Building fast, secure, and easy-to-use web applications.',
	bio: [
		{
			_key: 'bio-en-1',
			_type: 'block',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_key: 'bio-en-1-1',
					_type: 'span',
					marks: [],
					text: "I'm a full-stack web developer who combines solid server-side logic with polished frontend experiences. I specialize in scalable backend systems — from relational and NoSQL database design to RESTful APIs and data security.",
				},
			],
		},
		{
			_key: 'f2c267cf6598',
			_type: 'block',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_key: 'abec37b3da71',
					_type: 'span',
					marks: [],
					text: 'But I go beyond the server. I connect that backend foundation to dynamic, responsive frontends, ensuring flawless data delivery straight to the user.',
				},
			],
		},
	],
	avatar: {
		_type: 'image',
		asset: {
			_ref: 'image-6cfc7e21d83ecf6735f61598abe20583654c37d9-1254x1254-jpg',
			_type: 'reference',
		},
	},
	email: 'redho.arn@gmail.com',
	location: 'Surabaya, Indonesia',
	socials: [
		{ _key: 'seed0002', label: 'GitHub', url: 'https://github.com/redoamain' },
		{ _key: 'seed0003', label: 'LinkedIn', url: 'https://linkedin.com/in/rakapratama' },
	],
};

const FALLBACK_PROJECTS: PROJECTS_QUERY_RESULT = [
	{
		_id: 'nXfR47JxO13AdXevw2UdZT',
		title: 'Company Profile Website',
		slug: { _type: 'slug', current: 'company-profile-website' },
		summary: 'I build full-stack web applications with Next.js and an integrated CMS. I handle everything from database design and APIs to responsive frontends.',
		description: [
			{
				_key: '2b9300ee3c39',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: '661df58caba4',
						_type: 'span',
						marks: [],
						text: "My focus is on writing clean, documented code that's easy to maintain. In this project, I built a company profile website where the CMS lives inside the Next.js app — giving full control, better performance, and zero ongoing costs.",
					},
				],
			},
		],
		coverImage: {
			_type: 'image',
			asset: {
				_ref: 'image-b0761c381bb59e9d61fca3290accdf743857c19e-1901x894-png',
				_type: 'reference',
			},
		},
		tags: ['Next JS', 'Shdcn UI'],
		liveUrl: 'https://citiplumb.id',
		repoUrl: null,
	},
	{
		_id: 'd38e7c96-9779-41a4-aef2-1bc5e354da7a',
		title: 'Neovim Configuration (LazyVim)',
		slug: { _type: 'slug', current: 'neovim-configuration-lazyvim' },
		summary: 'Konfigurasi Neovim pribadi berbasis LazyVim yang dioptimasi untuk pengembangan Web & Backend dengan pengalaman navigasi mirip VSCode dan tema Tokyo Night',
		description: [
			{
				_key: '34fc53b363dd',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'e86b3dd4bbde',
						_type: 'span',
						marks: [],
						text: 'Konfigurasi Neovim pribadi yang dibangun di atas LazyVim, dirancang khusus untuk mempercepat workflow pengembangan Web & Backend. Setup ini menggabungkan performa Neovim dengan kemudahan penggunaan ala VSCode, tanpa mengorbankan fleksibilitas modal editing.',
					},
				],
			},
		],
		coverImage: {
			_type: 'image',
			asset: {
				_ref: 'image-19e8c880f8df29d315e2669c6bf3d897f2fb88aa-1918x1077-png',
				_type: 'reference',
			},
		},
		tags: ['Neovim', 'Lazyvim', 'Lua'],
		liveUrl: null,
		repoUrl: 'https://github.com/redoamain/nvim',
	},
	{
		_id: '8fd90c71-62fe-4946-8440-b2c24b445919',
		title: 'Portal Bea Cukai Kawasan Berikat',
		slug: { _type: 'slug', current: 'portal-bea-cukai-kawasan-berikat' },
		summary: 'Portal aplikasi Bea Cukai untuk manajemen dokumen kepabeanan dan pelaporan barang di perusahaan kawasan berikat.',
		description: [
			{
				_key: 'ee1963bb58ef',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: '13c2c8ca629a',
						_type: 'span',
						marks: ['strong'],
						text: 'BC Citiplumb',
					},
					{
						_key: '3eb3773c199a',
						_type: 'span',
						marks: [],
						text: ' adalah portal aplikasi Bea Cukai yang dirancang khusus untuk perusahaan kawasan berikat dalam mengelola seluruh administrasi kepabeanan secara digital. Portal ini menggantikan proses manual berbasis spreadsheet menjadi sistem terpusat yang real-time, akurat, dan audit-ready.',
					},
				],
			},
		],
		coverImage: {
			_type: 'image',
			asset: {
				_ref: 'image-c74f1ea54718c5beb338fd3ab83aa38ece0187aa-1903x1068-png',
				_type: 'reference',
			},
		},
		tags: ['Next JS', 'Tailwind CSS', 'Shdcn UI'],
		liveUrl: 'https://bc.citiplumb.id/',
		repoUrl: null,
	},
];

const FALLBACK_EXPERIENCES: EXPERIENCES_QUERY_RESULT = [
	{
		_id: 'nXfR47JxO13AdXevw2UeMn',
		position: 'Programmer',
		company: 'Harmoni Software House',
		location: 'Hybrid',
		startDate: '2026-08-09',
		endDate: null,
		current: true,
		summary: 'Leading the development of the company web platform, managing a team of 4 developers, and introducing CI/CD that cut release time from weekly to daily.',
		tags: ['Bun', 'Elysia', 'PostgreSQL', 'Docker'],
	},
	{
		_id: 'nXfR47JxO13AdXevw2UeRH',
		position: 'IT Support Specialist',
		company: 'PT CITI PLUMB',
		location: 'On Site',
		startDate: '2024-08-16',
		endDate: null,
		current: true,
		summary: 'I serve as an IT Support Specialist who wears two hats — server management and programming. On the server side, I handle deployment, monitoring, maintenance, and security across production and development environments.\n\nOn the programming side, I write scripts and build internal applications to solve operational challenges, streamline workflows, and support development teams. My role is to ensure that server systems remain stable while also delivering custom technical solutions that keep the business running smoothly.',
		tags: ['Linux Server', 'Windows Server', 'Typescript', 'ERP '],
	},
];

const FALLBACK_SKILLS: SkillItem[] = [
	{ _id: 'sk-1', name: 'React', category: 'frontend', level: 'expert' },
	{ _id: 'sk-2', name: 'TypeScript', category: 'frontend', level: 'expert' },
	{ _id: 'sk-3', name: 'Tailwind CSS', category: 'frontend', level: 'expert' },
	{ _id: 'sk-4', name: 'Astro', category: 'frontend', level: 'advanced' },
	{ _id: 'sk-5', name: 'Node.js', category: 'backend', level: 'expert' },
	{ _id: 'sk-6', name: 'Express', category: 'backend', level: 'advanced' },
	{ _id: 'sk-7', name: 'PostgreSQL', category: 'database', level: 'advanced' },
	{ _id: 'sk-8', name: 'Redis', category: 'database', level: 'intermediate' },
	{ _id: 'sk-9', name: 'Docker', category: 'devops', level: 'intermediate' },
	{ _id: 'sk-10', name: 'React Native', category: 'mobile', level: 'intermediate' },
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

export async function getSkills(): Promise<SkillItem[]> {
	try {
		const res = await sanityClient.fetch(SKILLS_QUERY);
		return res && res.length > 0 ? res : FALLBACK_SKILLS;
	} catch (err) {
		console.warn('[Sanity] Warning: Failed to fetch skills (using fallback):', (err as Error)?.message);
		return FALLBACK_SKILLS;
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

/** Extract domain name from URL string, with fallback. */
export function getDomain(url: string | null | undefined): string {
	if (!url) return 'system.internal';
	try {
		return new URL(url).hostname;
	} catch {
		return 'system.internal';
	}
}

export type {
	EXPERIENCES_QUERY_RESULT,
	PROFILE_QUERY_RESULT,
	PROJECTS_QUERY_RESULT,
} from '../../sanity.types';

