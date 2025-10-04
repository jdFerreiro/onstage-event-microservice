import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  DialogContentText,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateEvent from './CreateEvent.tsx';
import { fetchClubs } from '../../services/clubs';
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchGenres } from '../../services/api';

const formatDate = (iso: string) => {
  if (!iso) return '';
  // iso = "2025-11-16"
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
};

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Título', flex: 1 },
  {
    field: 'genreName',
    headerName: 'Género',
    flex: 1,
  },
  { field: 'durationMinutes', headerName: 'Tiempo (min)', flex: 0.5 },
  {
    field: 'firstDate',
    headerName: 'Estreno',
    flex: 1,
  },
  { field: 'memberPrice', headerName: 'Precio socio', flex: 0.5 },
  { field: 'nonMemberPrice', headerName: 'Precio no socio', flex: 0.5 },
  {
    field: 'statusName',
    headerName: 'Estado',
    flex: 1,
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    sortable: false,
    flex: 0.7,
    renderCell: (params) => params.value,
  },
];

const EventsPage: React.FC = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editEvent, setEditEvent] = useState<any | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<any | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);

  useEffect(() => {
    fetchClubs().then(setClubs);
    fetchGenres().then(setGenres);
  }, []);

  useEffect(() => {
    if (selectedClub) {
      setLoading(true);
      fetchEvents()
        .then(setEvents)
        .finally(() => setLoading(false));
    }
  }, [selectedClub]);

  const handleCreate = () => {
    setEditEvent(null);
    setOpenModal(true);
  };

  const handleEdit = (event: any) => {
    setEditEvent(event);
    setOpenModal(true);
  };

  const handleDelete = (event: any) => {
    setDeleteEvent(event);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteEvent(deleteEvent.id).then(() => {
      setEvents(events.filter(e => e.id !== deleteEvent.id));
      setConfirmDeleteOpen(false);
      setDeleteEvent(null);
    });
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setEditEvent(null);
  };

  const handleSave = (eventData: any) => {
    if (editEvent) {
      updateEvent(editEvent.id, eventData).then((updated) => {
        setEvents(events.map(e => (e.id === updated.id ? updated : e)));
        setOpenModal(false);
        setEditEvent(null);
      });
    } else {
      createEvent(eventData).then((created) => {
        setEvents([...events, created]);
        setOpenModal(false);
      });
    }
  };

  return (
    <Box
      sx={{
        width: '95vw',
        height: '95vh',
        margin: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        p: { xs: 0.5, sm: 1 },
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom>Eventos</Typography>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1">Selecciona un club:</Typography>
          <Select
            value={selectedClub}
            onChange={e => setSelectedClub(e.target.value)}
            displayEmpty
            sx={{ minWidth: 450 }}
          >
            <MenuItem value=""><em>Seleccione...</em></MenuItem>
            {clubs.map(club => (
              <MenuItem key={club.id} value={club.id}>{club.name}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <Tooltip title="Crear evento">
            <span>
              <IconButton color="primary" onClick={handleCreate} disabled={!selectedClub}>
                <AddIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
        <DataGrid
          rows={events.map(event => ({
            ...event,
            genreName: event.genre?.name ?? 'No definido',
            statusName: event.status?.name ?? 'No definido',
            firstDate: formatDate(event.releaseDate),
            actions: (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Editar evento">
                  <IconButton color="info" onClick={() => handleEdit(event)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar evento">
                  <IconButton color="error" onClick={() => handleDelete(event)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          }))}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          sx={{ width: '100%', height: '100%', border: 'none', minWidth: 0, maxWidth: '100vw' }}
          autoHeight={false}
          hideFooterSelectedRowCount
        />
      <CreateEvent
        open={openModal}
        onClose={handleModalClose}
        onSave={handleSave}
        event={editEvent}
        clubId={selectedClub}
      />
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el evento "{deleteEvent?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">Cancelar</Button>
          <Button onClick={confirmDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default EventsPage;
