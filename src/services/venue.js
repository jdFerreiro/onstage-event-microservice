// Servicio para obtener clubes desde el microservicio de identity
const URL_BASE = process.env.REACT_APP_VENUE_API_BASE_URL;
sessionStorage.setItem('uToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmM4M2YwZC1kZDI2LTQ1ZjAtOTAzOS05NTc4YjM3N2Q3YTIiLCJlbWFpbCI6ImR1bW15X2FkbWluaXN0cmFkb3JAZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJEdW1teUFkbWluaXN0cmFkb3IiLCJsYXN0TmFtZSI6IkV4YW1wbGUiLCJyb2xlSWQiOiI0ZWM1ZjY0NS1hYTc1LTRiNmQtYjlkOS02MzIzMjQ4OTU5MTQiLCJyb2xlTmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTkyMzc0MjksImV4cCI6MTc1OTI0MTAyOX0.7R-AAGIb4fK8iYxTV9yv6pNCDvqcELmzx6swYKdl_cw'); // Asegúrate de establecer el token en algún lugar de tu aplicación

export async function fetchSalas() {
  const token = sessionStorage.getItem('uToken');
  const res = await fetch(`${URL_BASE}/sala`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al obtener salas');
  return res.json();
}

