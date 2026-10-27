export async function sendInquiry(payload, endpoint, fetchRequest = fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetchRequest(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gandia-Inquiry': '1' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: 'same-origin',
    });
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('El envío por email no está disponible. Puedes enviarnos la consulta por WhatsApp.');
    }
    const result = await response.json();
    if (!response.ok || result?.ok !== true || typeof result.reference !== 'string' || !result.reference) {
      throw new Error(typeof result?.message === 'string' ? result.message : 'No se ha podido enviar la consulta. Puedes contactar por WhatsApp.');
    }
    return result;
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError || error instanceof SyntaxError) {
      throw new Error('No hemos podido confirmar el envío. Puedes contactar por WhatsApp o intentarlo más tarde.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
