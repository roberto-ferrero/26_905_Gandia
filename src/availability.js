import { parseDate, addDays } from './calendar.js';

export async function fetchAvailability(endpoint, calendar, fetchRequest = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetchRequest(endpoint, { headers: { Accept: 'application/json' }, cache: 'no-store', signal: controller.signal });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error();
    const data = await response.json();
    if (data.ok !== true || data.firstDate !== calendar.firstDate || data.lastDate !== calendar.lastDate || !Array.isArray(data.reservations)
      || data.reservations.length > 366 || !Number.isFinite(Date.parse(data.checkedAt)) || data.reservations.some((range) =>
        !range || !parseDate(range.arrival) || !parseDate(range.departure) || range.arrival >= range.departure
        || range.arrival < calendar.firstDate || range.departure > addDays(calendar.lastDate, 1))) throw new Error();
    return { reservations: data.reservations.map(({ arrival, departure }) => ({ arrival, departure })), checkedAt: data.checkedAt };
  } catch {
    throw new Error('No podemos consultar la disponibilidad. Contacta por WhatsApp o inténtalo más tarde.');
  } finally { clearTimeout(timer); }
}
