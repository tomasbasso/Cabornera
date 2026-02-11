
import React, { useEffect, useState } from 'react';
import { getReservations, createReservation, updateReservationStatus, getTables } from '../services/api';

const ReservationsManager = () => {
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        CustomerName: '',
        CustomerPhone: '',
        Date: '',
        Time: '20:00',
        Pax: 2,
        TableId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const resData = await getReservations();
            const tableData = await getTables();
            setReservations(resData);
            setTables(tableData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const timeSlots = [];
    for (let i = 12; i < 24; i++) {
        for (let j = 0; j < 60; j += 15) {
            const hour = i.toString().padStart(2, '0');
            const minute = j.toString().padStart(2, '0');
            timeSlots.push(`${hour}:${minute}`);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.Date || !formData.Time) {
            alert('Por favor selecciona fecha y hora');
            return;
        }

        const fullDate = `${formData.Date}T${formData.Time}`;
        const payload = {
            CustomerName: formData.CustomerName,
            CustomerPhone: formData.CustomerPhone,
            ReservationDate: fullDate,
            Pax: formData.Pax,
            TableId: formData.TableId
        };

        try {
            await createReservation(payload);
            setFormData({ ...formData, CustomerName: '', CustomerPhone: '', Pax: 2, TableId: '' });
            alert('¡Reserva creada con éxito!');
            fetchData();
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert('Error al crear reserva: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`¿Cambiar estado a ${newStatus}?`)) return;
        try {
            await updateReservationStatus(id, newStatus);
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed':
                return <span className="badge badge-green">Confirmada</span>;
            case 'Cancelled':
                return <span className="badge badge-red">Cancelada</span>;
            case 'Completed':
                return <span className="badge badge-gold">Completada</span>;
            default:
                return <span className="badge badge-gray">{status}</span>;
        }
    };

    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('es-ES', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    if (loading) return (
        <div style={{ padding: '5rem', textAlign: 'center' }}>
            <div className="loading-spinner" />
            <p style={{ marginTop: '1rem', color: 'var(--gris-medio)', fontFamily: "'Inter', sans-serif" }}>
                Cargando reservas...
            </p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="section-title">Gestión de Reservas</h1>
                <div className="section-divider" />
                <p className="section-subtitle" style={{ marginBottom: 0 }}>
                    Administra las reservas de tu restaurante
                </p>
            </div>

            {/* Reservation Form */}
            <div className="card-cabornera animate-fade-in-up" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'var(--verde-montana)'
                    }}>
                        Nueva Reserva
                    </h2>
                    <div className="section-divider" style={{ marginTop: '0.5rem', marginBottom: '0' }} />
                </div>
                <form onSubmit={handleSubmit} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    alignItems: 'end'
                }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--gris-medio)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            Nombre del cliente
                        </label>
                        <input
                            name="CustomerName"
                            placeholder="Nombre completo"
                            value={formData.CustomerName}
                            onChange={handleInputChange}
                            className="input-cabornera"
                            required
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--gris-medio)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            Teléfono
                        </label>
                        <input
                            name="CustomerPhone"
                            placeholder="+34 600 000 000"
                            value={formData.CustomerPhone}
                            onChange={handleInputChange}
                            className="input-cabornera"
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--gris-medio)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            Fecha y Hora
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                name="Date"
                                type="date"
                                value={formData.Date}
                                onChange={handleInputChange}
                                className="input-cabornera"
                                required
                            />
                            <select
                                name="Time"
                                value={formData.Time}
                                onChange={handleInputChange}
                                className="select-cabornera"
                                style={{ minWidth: '120px' }}
                            >
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--gris-medio)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            Comensales
                        </label>
                        <input
                            name="Pax"
                            type="number"
                            min="1"
                            placeholder="Nº personas"
                            value={formData.Pax}
                            onChange={handleInputChange}
                            className="input-cabornera"
                            required
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--gris-medio)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            Mesa (opcional)
                        </label>
                        <select
                            name="TableId"
                            value={formData.TableId}
                            onChange={handleInputChange}
                            className="select-cabornera"
                        >
                            <option value="">Sin asignar</option>
                            {tables.map(t => (
                                <option key={t.Id} value={t.Id}>{t.Name} ({t.Capacity} pax)</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn-gold" style={{
                        width: '100%',
                        height: 'fit-content',
                        padding: '0.85rem 2rem'
                    }}>
                        ✦ Crear Reserva
                    </button>
                </form>
            </div>

            {/* Reservations Table */}
            <div className="card-cabornera animate-fade-in-up" style={{
                overflow: 'hidden',
                animationDelay: '0.2s',
                opacity: 0
            }}>
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--crema-oscura)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.3rem',
                        fontWeight: 600,
                        color: 'var(--verde-montana)'
                    }}>
                        Listado de Reservas
                    </h2>
                    <span className="badge badge-gold">
                        {reservations.length} reserva{reservations.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {reservations.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table-cabornera">
                            <thead>
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Cliente</th>
                                    <th>Mesa</th>
                                    <th>Comensales</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(res => (
                                    <tr key={res.Id} style={{
                                        opacity: res.Status === 'Cancelled' ? 0.5 : 1
                                    }}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>
                                                {formatDate(res.ReservationDate)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{res.CustomerName}</div>
                                            {res.CustomerPhone && (
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--gris-medio)',
                                                    marginTop: '2px'
                                                }}>
                                                    📞 {res.CustomerPhone}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {res.TableName || (
                                                <span style={{
                                                    color: 'var(--oro-otono)',
                                                    fontStyle: 'italic',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    Sin asignar
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: 600,
                                                color: 'var(--verde-montana)'
                                            }}>
                                                {res.Pax}
                                            </span>
                                            <span style={{ color: 'var(--gris-medio)', fontSize: '0.85rem' }}>
                                                {' '}pax
                                            </span>
                                        </td>
                                        <td>{getStatusBadge(res.Status)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {res.Status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => handleStatusChange(res.Id, 'Cancelled')}
                                                        className="btn-danger"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                                {res.Status === 'Confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusChange(res.Id, 'Completed')}
                                                        className="btn-primary"
                                                        style={{
                                                            padding: '0.4rem 0.8rem',
                                                            fontSize: '0.75rem',
                                                            boxShadow: 'none'
                                                        }}
                                                    >
                                                        Completar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: 'var(--gris-medio)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📅</div>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.2rem',
                            marginBottom: '0.5rem'
                        }}>
                            No hay reservas registradas
                        </p>
                        <p style={{ fontSize: '0.9rem' }}>
                            Crea tu primera reserva usando el formulario de arriba
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationsManager;
