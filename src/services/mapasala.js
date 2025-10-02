// Servicios para mapasala: crear, actualizar, obtener detalle
import { fetchResourceList, fetchResourceDetail, deleteResource } from './api';

const API_BASE_URL = process.env.REACT_VENUE_API_BASE_URL;

export async function createMapaSala(data) {
  const response = await fetch(`${API_BASE_URL}/mapasala`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear mapa');
  return response.json();
}

export async function updateMapaSala(id, data) {
  const response = await fetch(`${API_BASE_URL}/mapasala/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar mapa');
  return response.json();
}

export async function getMapaSala(id) {
  return fetchResourceDetail('mapasala', id);
}

function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
