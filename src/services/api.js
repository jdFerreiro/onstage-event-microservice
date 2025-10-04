const API_BASE = process.env.REACT_APP_EVENT_API_BASE_URL || 'http://localhost:7030';

function getAuthHeaders() {
	const token = sessionStorage.getItem('uToken');
	return {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`,
	};
}

// EVENTOS
export async function fetchEvents() {
  const data = await fetch(`${API_BASE}/events`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
  return data;
} 

export async function createEvent(eventDto) {
  return fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventDto)
  }).then(res => res.json());
}

export async function updateEvent(id, eventDto) {
  return fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventDto)
  }).then(res => res.json());
}

export async function deleteEvent(id) {
  return fetch(`${API_BASE}/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}

export async function fetchEventStatuses() {
  const data = await fetch(`${API_BASE}/events/statuses/all`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
  return data;
}

// GENEROS
export async function fetchGenres() {
  const data = fetch(`${API_BASE}/genres`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
  return data;
}

export async function createGenre(genreDto) {
  return fetch(`${API_BASE}/genres`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(genreDto)
  }).then(res => res.json());
}

export async function updateGenre(id, genreDto) {
  return fetch(`${API_BASE}/genres/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(genreDto)
  }).then(res => res.json());
}

export async function deleteGenre(id) {
  return fetch(`${API_BASE}/genres/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}

// FUNCIONES
export async function fetchFunctions() {
  return fetch(`${API_BASE}/functions`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
}

export async function createFunction(functionDto) {
  return fetch(`${API_BASE}/functions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(functionDto)
  }).then(res => res.json());
}

export async function updateFunction(id, functionDto) {
  return fetch(`${API_BASE}/functions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(functionDto)
  }).then(res => res.json());
}

export async function deleteFunction(id) {
  return fetch(`${API_BASE}/functions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}

export async function fetchFunctionStatuses() {
  return fetch(`${API_BASE}/functions/statuses/all`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
}

export async function fetchFunctionsByVenue(venueId) {
  return fetch(`${API_BASE}/functions/venue/${venueId}`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
}

// RESERVACIONES
export async function fetchReservations() {
  return fetch(`${API_BASE}/reservations`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
}

export async function createReservation(reservationDto) {
  return fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reservationDto)
  }).then(res => res.json());
}

export async function updateReservation(id, reservationDto) {
  return fetch(`${API_BASE}/reservations/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(reservationDto)
  }).then(res => res.json());
}

export async function deleteReservation(id) {
  return fetch(`${API_BASE}/reservations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}

export async function fetchReservationStatuses() {
  return fetch(`${API_BASE}/reservations/statuses/all`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
}

// DISPONIBILIDAD DE BUTACAS
export async function fetchSeatAvailability() {
  return fetch(`${API_BASE}/seat-availability`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
}

export async function createSeatAvailability(seatAvailabilityDto) {
  return fetch(`${API_BASE}/seat-availability`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(seatAvailabilityDto)
  }).then(res => res.json());
}

export async function updateSeatAvailability(id, seatAvailabilityDto) {
  return fetch(`${API_BASE}/seat-availability/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(seatAvailabilityDto)
  }).then(res => res.json());
}

export async function deleteSeatAvailability(id) {
  return fetch(`${API_BASE}/seat-availability/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}

export async function fetchSeatAvailabilityStatuses() {
  return fetch(`${API_BASE}/seat-availability/statuses/all`, {
    headers: getAuthHeaders()
  }).then(res => res.json());
}
