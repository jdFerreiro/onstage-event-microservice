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
import InputMask from 'react-input-mask';

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
  genreId: '',
  durationMinutes: '',
  imageUrl: '',
  posterImage: '', // base64
  releaseDate: '',
  statusId: '',
  preSeasonStart: '',
  preSeasonEnd: '',
  preSaleStart: '',
  preSaleEnd: '',
  memberPrice: '',
  nonMemberPrice: '',
  // type eliminado
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

  useEffect(() => {
    if (genres.length > 0 && !genres.some(g => g.id === form.genreId)) {
      setForm(prev => ({ ...prev, genreId: '' }));
    }
    if (statusOptions.length > 0 && !statusOptions.some(s => s.id === form.statusId)) {
      setForm(prev => ({ ...prev, statusId: '' }));
    }
  }, [genres, statusOptions]);

  // Convierte dd/mm/yyyy a ISO para el value del input tipo date
  function ddmmToISO(str: string) {
    console.log(str);
  // Espera formato dd/mm/yyyy
  const [day, month, year] = str.split('/');
  if (!day || !month || !year) return '';
  // Crea la fecha como local, no UTC
  console.log({day, month, year});
  const date = new Date(Number(year), Number(month), Number(day));
  // Devuelve solo la parte de fecha, sin hora ni zona
  return date.toISOString().slice(0, 10);
}

  // Convierte ISO a dd/mm/yyyy para guardar en el estado
  function isoToDDMMYYYY(iso: string) {
    if (!iso) return '';
    const [year, month, day] = iso.split('-');
    if (!year || !month || !day) return '';
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  // Modifica el handleChange para campos de fecha
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    // Si es campo de fecha, convierte a dd/mm/yyyy
    if (type === 'date') {
      setForm(prev => ({ ...prev, [name]: isoToDDMMYYYY(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
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
  const newErrors: any = {};

  if (form.releaseDate && !isValidDDMMYYYY(form.releaseDate)) {
    newErrors.releaseDate = 'Fecha inválida';
  }
  if (form.preSaleStart && !isValidDDMMYYYY(form.preSaleStart)) {
    newErrors.preSaleStart = 'Fecha inválida';
  }
  if (form.preSaleEnd && !isValidDDMMYYYY(form.preSaleEnd)) {
    newErrors.preSaleEnd = 'Fecha inválida';
  }
  if (form.preSeasonStart && !isValidDDMMYYYY(form.preSeasonStart)) {
    newErrors.preSeasonStart = 'Fecha inválida';
  }
  if (form.preSeasonEnd && !isValidDDMMYYYY(form.preSeasonEnd)) {
    newErrors.preSeasonEnd = 'Fecha inválida';
  }

  // Validación simple
  if (!form.title) newErrors.title = 'El título es obligatorio';
  if (!form.description) newErrors.description = 'La descripción es obligatoria';
  if (!form.genreId) newErrors.genreId = 'El género es obligatorio';
  if (!form.durationMinutes) newErrors.durationMinutes = 'La duración es obligatoria';
  if (!form.releaseDate) newErrors.releaseDate = 'La fecha de estreno es obligatoria';
  if (!form.statusId) newErrors.statusId = 'El estatus es obligatorio';
  if (!form.memberPrice) newErrors.memberPrice = 'El precio de socios es obligatorio';
  if (!form.nonMemberPrice) newErrors.nonMemberPrice = 'El precio de no socios es obligatorio';
  // Validación de fechas dd/mm/yyyy
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (form.preSaleStart && !dateRegex.test(form.preSaleStart)) newErrors.preSaleStart = 'Formato dd/mm/yyyy';
  if (form.preSaleEnd && !dateRegex.test(form.preSaleEnd)) newErrors.preSaleEnd = 'Formato dd/mm/yyyy';
  if (form.preSeasonStart && !dateRegex.test(form.preSeasonStart)) newErrors.preSeasonStart = 'Formato dd/mm/yyyy';
  if (form.preSeasonEnd && !dateRegex.test(form.preSeasonEnd)) newErrors.preSeasonEnd = 'Formato dd/mm/yyyy';

  // Validación de rango de fechas pre-venta
  if (form.preSaleStart && form.preSaleEnd && dateRegex.test(form.preSaleStart) && dateRegex.test(form.preSaleEnd)) {
    const [d1, m1, y1] = form.preSaleStart.split('/');
    const [d2, m2, y2] = form.preSaleEnd.split('/');
    const start = new Date(`${y1}-${m1}-${d1}`);
    const end = new Date(`${y2}-${m2}-${d2}`);
    if (end <= start) {
      newErrors.preSaleEnd = 'Fin de pre-venta debe ser posterior al inicio';
    }
  }
  // Validación de rango de fechas pre-temporada
  if (form.preSeasonStart && form.preSeasonEnd && dateRegex.test(form.preSeasonStart) && dateRegex.test(form.preSeasonEnd)) {
    const [d1, m1, y1] = form.preSeasonStart.split('/');
    const [d2, m2, y2] = form.preSeasonEnd.split('/');
    const start = new Date(`${y1}-${m1}-${d1}`);
    const end = new Date(`${y2}-${m2}-${d2}`);
    if (end <= start) {
      newErrors.preSeasonEnd = 'Fin de pre-temporada debe ser posterior al inicio';
    }
  }

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;
  setSaving(true);
  // Prepara el objeto para enviar al backend, ajustando tipos
  const eventToSend = {
    ...form,
    clubId,
    releaseDate: form.releaseDate && /^\d{2}\/\d{2}\/\d{4}$/.test(form.releaseDate)
      ? parseDDMMYYYYToISO(form.releaseDate)
      : undefined,
    preSaleStart: form.preSaleStart && /^\d{2}\/\d{2}\/\d{4}$/.test(form.preSaleStart)
      ? parseDDMMYYYYToISO(form.preSaleStart)
      : undefined,
    preSaleEnd: form.preSaleEnd && /^\d{2}\/\d{2}\/\d{4}$/.test(form.preSaleEnd)
      ? parseDDMMYYYYToISO(form.preSaleEnd)
      : undefined,
    preSeasonStart: form.preSeasonStart && /^\d{2}\/\d{2}\/\d{4}$/.test(form.preSeasonStart)
      ? parseDDMMYYYYToISO(form.preSeasonStart)
      : undefined,
    preSeasonEnd: form.preSeasonEnd && /^\d{2}\/\d{2}\/\d{4}$/.test(form.preSeasonEnd)
      ? parseDDMMYYYYToISO(form.preSeasonEnd)
      : undefined,
    durationMinutes: form.durationMinutes !== '' && !isNaN(Number(form.durationMinutes))
      ? Number(form.durationMinutes)
      : undefined,
    memberPrice: form.memberPrice !== '' && !isNaN(Number(form.memberPrice))
      ? Number(form.memberPrice)
      : undefined,
    nonMemberPrice: form.nonMemberPrice !== '' && !isNaN(Number(form.nonMemberPrice))
      ? Number(form.nonMemberPrice)
      : undefined,
    statusId: form.statusId !== '' && !isNaN(Number(form.statusId))
      ? Number(form.statusId)
      : undefined,
    genreId: form.genreId,
    // type eliminado
  };
  // Construye un nuevo objeto limpio sin campos vacíos, undefined o NaN
  const cleanEvent = Object.fromEntries(
    Object.entries(eventToSend).filter(([key, v]) => v !== '' && v !== undefined && v !== null && !(typeof v === 'number' && isNaN(v)))
  );
  await onSave(cleanEvent);
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

  function isValidDDMMYYYY(dateStr: string) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return false;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    return true;
  }

  return (
    <>
      <Dialog open={open} onClose={undefined} maxWidth="md" fullWidth>
        <DialogTitle>{event ? 'Editar Evento' : 'Crear Evento'}</DialogTitle>
        <DialogContent dividers sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', borderRadius: 3, boxShadow: 4 }}>
          <Box sx={{ background: 'rgba(255,255,255,0.85)', p: 3 }}>
            {/* Título y descripción al 100% */}
            <TextField label="Título" name="title" value={form.title} onChange={handleChange} fullWidth tabIndex={1} sx={{ fontWeight: 'bold', bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
            {errors.title && (
              <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.title}</Typography>
            )}
            <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={4} tabIndex={2} sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 2 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
            {errors.description && (
              <Typography color="error" variant="caption" sx={{ mb: 2, minHeight: 20, display: 'block' }}>{errors.description}</Typography>
            )}
            {/* Bloque de dos columnas: controles y área de imagen */}
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              {/* Columna izquierda: género, duración, fecha, estatus */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <FormControl fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}>
                  <InputLabel sx={{ fontWeight: 600 }}>Género</InputLabel>
                  <Select
                    label="Género"
                    name="genreId"
                    value={genres.length > 0 ? form.genreId : ''}
                    onChange={handleSelectChange}
                    fullWidth
                    error={!!errors.genreId}
                  >
                    {genres.map((g) => (
                      <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.genreId && (
                    <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.genreId}</Typography>
                  )}
                </FormControl>
                <TextField label="Duración (min)" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} type="number" fullWidth tabIndex={4} sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
                {errors.durationMinutes && (
                  <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.durationMinutes}</Typography>
                )}
                {/* Fecha de estreno */}
                <TextField
                  label="Fecha de estreno"
                  name="releaseDate"
                  value={form.releaseDate}
                  onChange={handleChange}
                  type="text"
                  placeholder="dd/mm/yyyy"
                  InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }}
                  fullWidth
                  sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}
                  error={!!errors.releaseDate}
                  helperText={errors.releaseDate}
                />
                <FormControl fullWidth sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}>
                  <InputLabel sx={{ fontWeight: 600 }}>Estatus</InputLabel>
                  <Select
                    label="Estatus"
                    name="statusId"
                    value={statusOptions.length > 0 ? form.statusId : ''}
                    onChange={handleSelectChange}
                    fullWidth
                    error={!!errors.statusId}
                  >
                    {statusOptions.map((s) => (
                      <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.statusId && (
                    <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.statusId}</Typography>
                  )}
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
                        const result = ev.target?.result as string;
                        setForm(prev => ({
                          ...prev,
                          imageUrl: result,
                          posterImage: result?.split(',')[1] || '', // base64 sin encabezado
                        }));
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
                {errors.memberPrice && (
                  <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.memberPrice}</Typography>
                )}
              </Box>
              {/* Columna derecha: precio no socios, fin pre-venta, fin pre-temporada */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <TextField label="Precio no socios" name="nonMemberPrice" value={form.nonMemberPrice} onChange={handleChange} type="number" fullWidth tabIndex={10} sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }} InputLabelProps={{ style: { fontWeight: 600 } }} />
                {errors.nonMemberPrice && (
                  <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.nonMemberPrice}</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Inicio pre-venta */}
                <TextField
                  label="Inicio pre-venta"
                  name="preSaleStart"
                  value={form.preSaleStart}
                  onChange={handleChange}
                  type="text"
                  placeholder="dd/mm/yyyy"
                  InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }}
                  fullWidth
                  sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}
                  error={!!errors.preSaleStart}
                  helperText={errors.preSaleStart}
                />
                {errors.preSaleStart && (
                  <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.preSaleStart}</Typography>
                )}
              </Box>
              {/* Columna derecha: precio no socios, fin pre-venta, fin pre-temporada */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Fin pre-venta */}
                <TextField
                  label="Fin pre-venta"
                  name="preSaleEnd"
                  value={form.preSaleEnd}
                  onChange={handleChange}
                  type="text"
                  placeholder="dd/mm/yyyy"
                  InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }}
                  fullWidth
                  sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}
                  error={!!errors.preSaleEnd}
                  helperText={errors.preSaleEnd}
                />
                {errors.preSaleEnd && (
                  <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.preSaleEnd}</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Inicio pre-temporada */}
                <TextField
                  label="Inicio pre-temporada"
                  name="preSeasonStart"
                  value={form.preSeasonStart}
                  onChange={handleChange}
                  type="text"
                  placeholder="dd/mm/yyyy"
                  InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }}
                  fullWidth
                  sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}
                  error={!!errors.preSeasonStart}
                  helperText={errors.preSeasonStart}
                />
                {errors.preSeasonStart && (
                  <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.preSeasonStart}</Typography>
                )}
              </Box>
              {/* Columna derecha: precio no socios, fin pre-venta, fin pre-temporada */}
              <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Fin pre-temporada */}
                <TextField
                  label="Fin pre-temporada"
                  name="preSeasonEnd"
                  value={form.preSeasonEnd}
                  onChange={handleChange}
                  type="text"
                  placeholder="dd/mm/yyyy"
                  InputLabelProps={{ shrink: true, style: { fontWeight: 600 } }}
                  fullWidth
                  sx={{ bgcolor: '#f7fafd', borderRadius: 2, mb: 1 }}
                  error={!!errors.preSeasonEnd}
                  helperText={errors.preSeasonEnd}
                />
                {errors.preSeasonEnd && (
                  <Typography color="error" variant="caption" sx={{ mb: 1, minHeight: 20, display: 'block' }}>{errors.preSeasonEnd}</Typography>
                )}
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
