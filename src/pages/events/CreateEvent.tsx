import React, { useState, useEffect } from 'react';
import { fetchEventStatuses, fetchGenres } from '../../services/api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// Eliminado Grid, usaremos Box y flex
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { SelectChangeEvent } from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';


  interface CreateEventProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    event?: any;
    clubId: string;
  }

const initialEvent = {
  title: '',
  description: '',
  genreId: '', // Cambiado de 'genre' a 'genreId'
  durationMinutes: '',
  imageUrl: '',
  posterImage: '',
  type: '',
  releaseDate: '', // dd/mm/yyyy
  statusId: '',
  preSeasonStart: '',
  preSeasonEnd: '',
  preSaleStart: '',
  preSaleEnd: '',
  memberPrice: '',
  nonMemberPrice: '',
};

const CreateEvent: React.FC<CreateEventProps> = ({ open, onClose, onSave, event, clubId }) => {
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState(initialEvent);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        ...initialEvent,
        ...event,
        releaseDate: event.releaseDate ? formatDateToDDMMYYYY(event.releaseDate) : '',
        preSeasonStart: event.preSeasonStart ? formatDateToDDMMYYYY(event.preSeasonStart) : '',
        preSeasonEnd: event.preSeasonEnd ? formatDateToDDMMYYYY(event.preSeasonEnd) : '',
        preSaleStart: event.preSaleStart ? formatDateToDDMMYYYY(event.preSaleStart) : '',
        preSaleEnd: event.preSaleEnd ? formatDateToDDMMYYYY(event.preSaleEnd) : '',
      });
    } else {
      setForm(initialEvent);
    }
    setErrors({}); // Limpiar errores al abrir la ventana

    // Obtener géneros y estados desde el API
    const token = sessionStorage.getItem('uToken');
    setLoadingGenres(true);
    fetchGenres()
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Respuesta inesperada de géneros:', data);
          setGenres([]);
        } else {
          setGenres(data);
        }
        setLoadingGenres(false);
      })
      .catch((err) => {
        setLoadingGenres(false);
        console.error('Error al obtener géneros:', err);
      });

    setLoadingStatuses(true);
    fetchEventStatuses()
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Respuesta inesperada de estados:', data);
          setStatusOptions([]);
        } else {
          setStatusOptions(data);
        }
        setLoadingStatuses(false);
      })
      .catch((err) => {
        setLoadingStatuses(false);
        console.error('Error al obtener estados:', err);
      });
  }, [event, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo si se corrige
    setErrors((prev: any) => {
      const newErrors = { ...prev };
      if (value && newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name!]: value }));
    // Limpiar error del campo si se corrige
    setErrors((prev: any) => {
      const newErrors = { ...prev };
      if (value && newErrors[name!]) {
        delete newErrors[name!];
      }
      return newErrors;
    });
  };

  const handleCancel = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmAccept = () => {
    setConfirmOpen(false);
    onClose();
  };

  const handleSave = async () => {
  // Validación simple
  const newErrors: any = {};
  if (!form.title) newErrors.title = 'El título es obligatorio';
  if (!form.description) newErrors.description = 'La descripción es obligatoria';
  if (!form.genreId) newErrors.genreId = 'El género es obligatorio';
  if (!form.durationMinutes) newErrors.durationMinutes = 'La duración es obligatoria';
  if (!form.releaseDate) newErrors.releaseDate = 'La fecha de estreno es obligatoria';
  if (!form.statusId) newErrors.statusId = 'El estatus es obligatorio';
  if (!form.memberPrice) newErrors.memberPrice = 'El precio de socios es obligatorio';
  if (!form.nonMemberPrice) newErrors.nonMemberPrice = 'El precio de no socios es obligatorio';
  if (!form.preSaleStart) newErrors.preSaleStart = 'La fecha de inicio de pre-venta es obligatoria';
    // Eliminada validación de fecha de presentación
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;
  setSaving(true);
  await onSave({ ...form, clubId });
  setSaving(false);
  };

  // Utilidad para formatear fecha dd/mm/yyyy
  function formatDateToDDMMYYYY(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function parseDDMMYYYYToISO(str: string) {
    if (!str) return '';
    const [day, month, year] = str.split('/');
    if (!day || !month || !year) return str;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return (
    <>
      <Dialog open={open} onClose={undefined} maxWidth="md" fullWidth>
        <DialogTitle>{event ? 'Editar Evento' : 'Crear Evento'}</DialogTitle>
        <DialogContent dividers sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', borderRadius: 3, boxShadow: 4 }}>
          <Box sx={{ background: 'rgba(255,255,255,0.85)', p: 3 }}>
            {/* Título y descripción al 100% */}
            <TextField label="Título" name="title" value={form.title} onChange={handleChange} fullWidth tabIndex={1} sx={{ fontWeight: 'bold', bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
            <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={4} tabIndex={2} sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 2 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
            {/* Bloque de dos columnas: controles y área de imagen */}
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              {/* Columna izquierda: género, duración, fecha, estatus */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <FormControl fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}>
                  <InputLabel sx={{ fontWeight: 600 }}>Género</InputLabel>
                  <Select name="genreId" value={form.genreId || ''} label="Género" onChange={handleSelectChange} disabled={loadingGenres} tabIndex={3}>
                    {loadingGenres ? (
                      <MenuItem value=""><CircularProgress size={20} /></MenuItem>
                    ) : genres.length === 0 ? (
                      <MenuItem value="">Sin géneros</MenuItem>
                    ) : (
                      genres.map((g: any) => (
                        <MenuItem key={g.id} value={g.id}>{g.name || g.nombre}</MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                <TextField label="Duración (min)" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} type="number" fullWidth tabIndex={4} sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
                <TextField label="Fecha de estreno" name="releaseDate" value={form.releaseDate} onChange={handleChange} type="text" placeholder="dd/mm/yyyy" tabIndex={5} InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }} fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} />
                <FormControl fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}>
                  <InputLabel sx={{ fontWeight: 600 }}>Estatus</InputLabel>
                  <Select name="statusId" value={form.statusId} label="Estatus" onChange={handleSelectChange} disabled={loadingStatuses} tabIndex={6}>
                    {loadingStatuses ? (
                      <MenuItem value=""><CircularProgress size={20} /></MenuItem>
                    ) : statusOptions.length === 0 ? (
                      <MenuItem value="">Sin estados</MenuItem>
                    ) : (
                      statusOptions.map((status: any) => (
                        <MenuItem key={status.id} value={status.id}>{status.name || status.nombre}</MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Box>
              {/* Columna derecha: área de imagen y botón */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220 }}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #90caf9', borderRadius: 3, mb: 1, minHeight: 210, maxHeight: 210, background: '#e3f2fd' }}>
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="Imagen" style={{ maxWidth: '100%', maxHeight: '190px', objectFit: 'contain', borderRadius: 8, boxShadow: '0 2px 8px #90caf9' }} />
                  ) : (
                    <Typography variant="body2" color="textSecondary">Sin imagen</Typography>
                  )}
                </Box>
                <Button variant="contained" color="primary" component="label" startIcon={<PhotoCamera />} sx={{ alignSelf: 'flex-end', borderRadius: 2, boxShadow: 2, fontWeight: 600, textTransform: 'none', mt: 0, mb: 1, ':hover': { bgcolor: '#1976d2' } }} tabIndex={-1}>
                  Cargar poster
                  <input type="file" accept="image/*" hidden onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        setForm(prev => ({ ...prev, imageUrl: ev.target?.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                </Button>
              </Box>
            </Box>
            {/* Bloque inferior de dos columnas para precios y fechas */}
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              {/* Columna izquierda: precio socios, inicio pre-venta, inicio pre-temporada */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <TextField label="Precio socios" name="memberPrice" value={form.memberPrice} onChange={handleChange} type="number" fullWidth tabIndex={7} sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
              </Box>
              {/* Columna derecha: precio no socios, fin pre-venta, fin pre-temporada */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <TextField label="Precio no socios" name="nonMemberPrice" value={form.nonMemberPrice} onChange={handleChange} type="number" fullWidth tabIndex={10} sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <TextField label="Inicio pre-venta" name="preSaleStart" value={form.preSaleStart} onChange={handleChange} type="text" placeholder="dd/mm/yyyy" tabIndex={8} InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }} fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} />
              </Box>
              {/* Columna derecha: precio no socios, fin pre-venta, fin pre-temporada */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <TextField label="Fin pre-venta" name="preSaleEnd" value={form.preSaleEnd} onChange={handleChange} type="text" placeholder="dd/mm/yyyy" tabIndex={11} InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }} fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} />
                {errors.preSaleEnd ? (
                  <Typography color="error" variant="caption" sx={{ mb: 2, minHeight: 20, display: 'block' }}>{errors.preSaleEnd}</Typography>
                ) : (
                  <Typography variant="caption" sx={{ mb: 2, minHeight: 20, display: 'block', visibility: 'hidden' }}>.</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <TextField label="Inicio pre-temporada" name="preSeasonStart" value={form.preSeasonStart} onChange={handleChange} type="text" placeholder="dd/mm/yyyy" tabIndex={9} InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }} fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} />
              </Box>
              {/* Columna derecha: precio no socios, fin pre-venta, fin pre-temporada */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <TextField label="Fin pre-temporada" name="preSeasonEnd" value={form.preSeasonEnd} onChange={handleChange} type="text" placeholder="dd/mm/yyyy" tabIndex={12} InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }} fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">Cancelar</Button>
          <Button onClick={handleSave} color="success" variant="contained" disabled={saving}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>¿Cerrar sin guardar?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas cerrar la ventana? Se perderán los cambios no guardados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">No</Button>
          <Button onClick={handleConfirmAccept} color="error" variant="contained">Sí, cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CreateEvent;
