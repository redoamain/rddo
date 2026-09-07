import {defineField, defineType} from 'sanity'

export const siteStats = defineType({
  name: 'siteStats',
  title: 'Statistik Situs',
  type: 'document',
  description:
    'Penghitung kunjungan halaman utama. Field visits bertambah otomatis (+1 tiap page load) lewat API — jangan diubah manual kecuali untuk reset.',
  fields: [
    defineField({
      name: 'visits',
      title: 'Jumlah Kunjungan',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().min(0).integer(),
    }),
  ],
  preview: {
    select: {
      visits: 'visits',
    },
    prepare({visits}) {
      return {
        title: 'Statistik Situs',
        subtitle: `${visits ?? 0} kunjungan`,
      }
    },
  },
})
