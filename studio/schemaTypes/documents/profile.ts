import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const profile = defineType({
  name: 'profile',
  title: 'Profil',
  type: 'document',
  icon: UserIcon,
  description: 'Data utama company profile: identitas, bio, dan kontak.',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'nickname',
      title: 'Nama Panggilan',
      type: 'string',
      description: 'Contoh: Redo — dipakai di sapaan & judul halaman.',
    }),
    defineField({
      name: 'role',
      title: 'Peran / Job Title',
      type: 'string',
      description: 'Contoh: Full-Stack Developer',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Kalimat singkat untuk bagian hero.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio / Tentang Saya',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'avatar',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'location',
      title: 'Lokasi',
      type: 'string',
    }),
    defineField({
      name: 'socials',
      title: 'Social Media',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
    },
  },
})
