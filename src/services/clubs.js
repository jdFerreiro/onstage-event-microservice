const URL_BASE = process.env.REACT_APP_IDENTITY_API_BASE_URL;
sessionStorage.setItem('uToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmM4M2YwZC1kZDI2LTQ1ZjAtOTAzOS05NTc4YjM3N2Q3YTIiLCJlbWFpbCI6ImR1bW15X2FkbWluaXN0cmFkb3JAZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJEdW1teUFkbWluaXN0cmFkb3IiLCJsYXN0TmFtZSI6IkV4YW1wbGUiLCJyb2xlSWQiOiI0ZWM1ZjY0NS1hYTc1LTRiNmQtYjlkOS02MzIzMjQ4OTU5MTQiLCJyb2xlTmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTk0OTY0OTUsImV4cCI6MTc1OTUwMDA5NX0.fG-KpkaqcnHnWKv1lLFUI-SBUdV4Ns7JvasmlDv__qs');

export async function fetchClubs() {
  const token = sessionStorage.getItem('uToken');
  const res = await fetch(`${URL_BASE}/clubs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al obtener clubes');
  return res.json();
}
