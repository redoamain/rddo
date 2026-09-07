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

// ---- Fetch helpers ----

export async function getProfile(): Promise<PROFILE_QUERY_RESULT> {
	return sanityClient.fetch(PROFILE_QUERY);
}

export async function getProjects(): Promise<PROJECTS_QUERY_RESULT> {
	return sanityClient.fetch(PROJECTS_QUERY);
}

export async function getExperiences(): Promise<EXPERIENCES_QUERY_RESULT> {
	return sanityClient.fetch(EXPERIENCES_QUERY);
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
