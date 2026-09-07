import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'l9ie13zf',
    dataset: 'production'
  },
  typegen: {
    // Path berisi query GROQ di sisi frontend (web/)
    path: '../web/src/**/*.{ts,tsx,js,jsx,astro}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
