import {defineArrayMember, defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons/Projects'

export const project = defineType({
  name: 'project',
  title: 'Proyek',
  type: 'document',
  icon: ProjectsIcon,
  description: 'Proyek portofolio yang pernah dikerjakan.',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Ringkasan',
      type: 'text',
      rows: 3,
      description: 'Deskripsi singkat yang tampil di kartu proyek.',
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Lengkap',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'coverImage',
      title: 'Gambar Sampul',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'tags',
      title: 'Teknologi / Tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'liveUrl',
      title: 'URL Live / Demo',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'repoUrl',
      title: 'URL Repository',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'order',
      title: 'Urutan',
      type: 'number',
      description: 'Urutan tampil (kecil = tampil lebih dulu).',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Urutan Tampil',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}, {field: '_createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      media: 'coverImage',
    },
  },
})
