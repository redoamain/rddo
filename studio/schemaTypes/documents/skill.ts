import {defineField, defineType} from 'sanity'
import {CodeIcon} from '@sanity/icons/Code'

export const skill = defineType({
  name: 'skill',
  title: 'Keahlian',
  type: 'document',
  icon: CodeIcon,
  description: 'Keahlian teknis yang dimiliki.',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Keahlian',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Frontend', value: 'frontend'},
          {title: 'Backend', value: 'backend'},
          {title: 'Database', value: 'database'},
          {title: 'DevOps', value: 'devops'},
          {title: 'Mobile', value: 'mobile'},
          {title: 'Desain', value: 'design'},
          {title: 'Lainnya', value: 'other'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'level',
      title: 'Tingkat',
      type: 'string',
      options: {
        list: [
          {title: 'Dasar', value: 'beginner'},
          {title: 'Menengah', value: 'intermediate'},
          {title: 'Mahir', value: 'advanced'},
          {title: 'Expert', value: 'expert'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
})
