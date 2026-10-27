const DAY = 86_400_000;

export function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10) === value ? date : null;
}

export function toISO(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(value, count) {
  const date = parseDate(value);
  if (!date || !Number.isInteger(count)) throw new RangeError('Fecha o intervalo no válido');
  return toISO(new Date(date.getTime() + count * DAY));
}

export function nightCount(arrival, departure) {
  const start = parseDate(arrival);
  const end = parseDate(departure);
  return start && end ? (end.getTime() - start.getTime()) / DAY : NaN;
}

export function isReserved(value, config) {
  return config.reservations.some((booking) => value >= booking.arrival && value < booking.departure);
}

export function seasonFor(value, config) {
  const date = parseDate(value);
  if (!date) throw new RangeError('Fecha no válida');
  const month = date.getUTCMonth() + 1;
  const season = config.highSeasonMonths.includes(month)
    ? 'high'
    : config.midSeasonMonths.includes(month) ? 'mid' : 'low';
  return config.seasons.find((entry) => entry.id === season);
}

export function quoteStay(arrival, departure, config) {
  const nights = nightCount(arrival, departure);
  if (!Number.isFinite(nights)) return { valid: false, message: 'Selecciona las fechas de llegada y salida.' };
  if (nights <= 0) return { valid: false, message: 'La salida debe ser posterior a la llegada.' };
  if (nights < config.minimumNights) return { valid: false, message: 'La estancia mínima es de ' + config.minimumNights + ' noches.' };
  if (nights > config.maximumNights) {
    return { valid: false, message: 'Selecciona una estancia de hasta ' + config.maximumNights + ' noches.' };
  }
  if (arrival < config.firstDate || departure > addDays(config.lastDate, 1)) {
    return { valid: false, message: 'El calendario de ejemplo está disponible para 2027.' };
  }
  const breakdown = new Map();
  let total = 0;
  for (let value = arrival; value < departure; value = addDays(value, 1)) {
    if (isReserved(value, config)) {
      return { valid: false, message: 'La estancia incluye noches reservadas. Prueba con otras fechas.' };
    }
    const season = seasonFor(value, config);
    total += season.price;
    const row = breakdown.get(season.id) || { ...season, nights: 0, total: 0 };
    row.nights++;
    row.total += season.price;
    breakdown.set(season.id, row);
  }
  return { valid: true, nights, total, breakdown: [...breakdown.values()] };
}

export function monthCells(month) {
  const parsed = parseDate(month);
  if (!parsed) throw new RangeError('Mes no válido');
  const first = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const cells = Array(offset).fill(null);
  for (let day = 1; day <= last; day++) cells.push(toISO(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), day))));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function shiftMonth(month, direction) {
  const date = parseDate(month);
  return toISO(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + direction, 1)));
}

export function formatDate(value, options = {}) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', timeZone: 'UTC', ...options }).format(date) : '';
}

export function currency(value) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}
