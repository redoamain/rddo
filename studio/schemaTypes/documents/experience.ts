import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

export const experience = defineType({
  name: 'experience',
  title: 'Pengalaman Kerja',
  type: 'document',
  icon: CaseIcon,
  description: 'Riwayat pekerjaan / pengalaman profesional.',
  fields: [
    defineField({
      name: 'position',
      title: 'Posisi',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Perusahaan',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Lokasi',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Mulai',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Selesai',
      type: 'date',
      description: 'Kosongkan jika masih bekerja di sini.',
      hidden: ({parent}) => parent?.current === true,
    }),
    defineField({
      name: 'current',
      title: 'Masih bekerja di sini?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      title: 'Ringkasan',
      type: 'text',
      rows: 4,
      description: 'Apa yang dikerjakan / dicapai di posisi ini.',
    }),
    defineField({
      name: 'tags',
      title: 'Teknologi / Tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.unique(),
    }),
  ],
  orderings: [
    {
      title: 'Terbaru Dulu',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'position',
      subtitle: 'company',
    },
  },
})
