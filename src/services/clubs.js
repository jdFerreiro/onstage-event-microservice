const URL_BASE = process.env.REACT_APP_IDENTITY_API_BASE_URL;
sessionStorage.setItem('uToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmM4M2YwZC1kZDI2LTQ1ZjAtOTAzOS05NTc4YjM3N2Q3YTIiLCJlbWFpbCI6ImR1bW15X2FkbWluaXN0cmFkb3JAZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJEdW1teUFkbWluaXN0cmFkb3IiLCJsYXN0TmFtZSI6IkV4YW1wbGUiLCJyb2xlSWQiOiI0ZWM1ZjY0NS1hYTc1LTRiNmQtYjlkOS02MzIzMjQ4OTU5MTQiLCJyb2xlTmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTk1MTU3NzUsImV4cCI6MTc1OTUxOTM3NX0.DmLRui16Ml4h7q-5BS6hnoBTfVKcCj4HfIqo1RQO79M');

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
