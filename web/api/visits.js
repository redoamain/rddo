// Vercel Serverless Function — penghitung kunjungan real.
//
// Tiap request GET menambah `visits` +1 secara atomik di dokumen Sanity
// `siteStats` (dibuat otomatis saat pertama kali hit), lalu mengembalikan
// total terbarunya. Karena halaman web adalah static site, tiap page load /
// refresh di browser = 1 request ke sini = +1.
//
// Env yang dibutuhkan (Vercel → Project web → Settings → Environment Variables):
//   SANITY_API_TOKEN          (server-only, JANGAN pakai prefix PUBLIC_)
//   PUBLIC_SANITY_PROJECT_ID  (sudah ada)
//   PUBLIC_SANITY_DATASET     (sudah ada, default "production")
//
// Token dibuat di manage.sanity.io → project → API → Tokens (role Editor).
// Tanpa fetch API eksternal — hanya memakai fetch bawaan Node.

const API_VERSION = '2024-01-01';
const DOC_ID = 'siteStats';

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
	const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
	const token = process.env.SANITY_API_TOKEN;

	if (!projectId || !token) {
		return res.status(500).json({
			error: 'Visitor counter belum dikonfigurasi (SANITY_API_TOKEN / PUBLIC_SANITY_PROJECT_ID).',
		});
	}

	const base = `https://${projectId}.api.sanity.io/v${API_VERSION}/data`;
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		// 1) Pastikan dokumen ada, lalu tambah 1 secara atomik (satu transaksi).
		const mutateRes = await fetch(`${base}/mutate/${dataset}?returnDocuments=true`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				mutations: [
					{ createIfNotExists: { _id: DOC_ID, _type: 'siteStats', visits: 0 } },
					{ patch: { id: DOC_ID, inc: { visits: 1 } } },
				],
			}),
		});
		if (!mutateRes.ok) {
			const detail = await mutateRes.text();
			throw new Error(`Sanity mutate gagal (${mutateRes.status}): ${detail}`);
		}

		// 2) Baca total terbaru.
		const query = encodeURIComponent(`*[_id == "${DOC_ID}"][0]{visits}`);
		const queryRes = await fetch(`${base}/query/${dataset}?query=${query}`, { headers });
		if (!queryRes.ok) {
			const detail = await queryRes.text();
			throw new Error(`Sanity query gagal (${queryRes.status}): ${detail}`);
		}
		const { result } = await queryRes.json();

		res.setHeader('Cache-Control', 'no-store');
		return res.status(200).json({ visits: result?.visits ?? 0 });
	} catch (err) {
		console.error('[api/visits]', err);
		return res.status(502).json({ error: 'Gagal membaca penghitung kunjungan.' });
	}
}
