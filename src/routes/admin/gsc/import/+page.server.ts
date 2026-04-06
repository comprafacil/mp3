import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const jsonData = formData.get('data')?.toString();

    if (!jsonData) {
      return fail(400, { error: 'No se proporcionaron datos' });
    }

    try {
      if (!locals.env?.DB) {
        return fail(500, { error: 'Error de configuración' });
      }

      const data = JSON.parse(jsonData);
      const now = new Date().toISOString().split('T')[0];
      const snapshotId = `gsc_${now}`;

      let insertCount = 0;

      for (const row of data) {
        const { query, page, clicks, impressions, ctr, position, country, device } = row;

        await locals.env.DB.prepare(`
          INSERT INTO gsc_query_insights (lang, query, page, clicks, impressions, ctr, position, country, device, snapshot_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(
          'es',
          query || '',
          page || '',
          parseInt(clicks) || 0,
          parseInt(impressions) || 0,
          parseFloat(ctr) || 0,
          parseFloat(position) || 0,
          country || null,
          device || null,
          snapshotId
        ).run();

        insertCount++;
      }

      await locals.env.DB.prepare(`
        INSERT INTO gsc_snapshots (date_from, date_to, dimension_type, created_at)
        VALUES (?, ?, 'query', datetime('now'))
      `).bind(now, now).run();

      return { success: true, count: insertCount };
    } catch (error) {
      console.error('GSC import error:', error);
      return fail(500, { error: 'Error al importar datos. Verifica el formato JSON.' });
    }
  }
};
