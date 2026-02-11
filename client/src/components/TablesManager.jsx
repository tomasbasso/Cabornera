
import React, { useEffect, useState, useRef } from 'react';
import { getTables, updateTablePosition, toggleTableStatus } from '../services/api';

const TablesManager = () => {
    const [tables, setTables] = useState([]);
    const [draggingId, setDraggingId] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            const data = await getTables();
            setTables(data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };

    const handleDragStart = (e, id) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        if (draggingId === null) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - containerRect.left - 50;
        const y = e.clientY - containerRect.top - 50;

        setTables(tables.map(t => t.Id === draggingId ? { ...t, PosX: x, PosY: y } : t));

        try {
            await updateTablePosition(draggingId, x, y);
        } catch (error) {
            console.error('Error moving table:', error);
            loadTables();
        }
        setDraggingId(null);
    };

    const toggleStatus = async (table) => {
        try {
            await toggleTableStatus(table.Id, !table.IsOccupied);
            loadTables();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    const freeCount = tables.filter(t => !t.IsOccupied).length;
    const occupiedCount = tables.filter(t => t.IsOccupied).length;

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 className="section-title">Plano del Salón</h1>
                    <div className="section-divider" />
                    <p className="section-subtitle" style={{ marginBottom: 0 }}>
                        Arrastra las mesas para organizarlas · Clic para cambiar estado
                    </p>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <div className="card-cabornera" style={{
                        padding: '0.8rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'var(--verde-montana)',
                            boxShadow: '0 0 8px rgba(45, 80, 22, 0.4)'
                        }} />
                        <span style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.9rem',
                            color: 'var(--gris-pizarra)'
                        }}>
                            <strong style={{ color: 'var(--verde-montana)' }}>{freeCount}</strong> Libres
                        </span>
                    </div>
                    <div className="card-cabornera" style={{
                        padding: '0.8rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'var(--rojo-leones)',
                            boxShadow: '0 0 8px rgba(139, 26, 26, 0.4)'
                        }} />
                        <span style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.9rem',
                            color: 'var(--gris-pizarra)'
                        }}>
                            <strong style={{ color: 'var(--rojo-leones)' }}>{occupiedCount}</strong> Ocupadas
                        </span>
                    </div>
                </div>
            </div>

            {/* Floor Map */}
            <div className="card-cabornera" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                <div
                    ref={containerRef}
                    className="floor-map"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {/* Decorative elements */}
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '0.8rem',
                        color: 'var(--marron-roble)',
                        opacity: 0.4,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>
                        ◇ Salón Principal
                    </div>

                    {tables.map(table => (
                        <div
                            key={table.Id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, table.Id)}
                            onClick={() => toggleStatus(table)}
                            className={`table-item ${table.IsOccupied ? 'ocupada' : 'libre'} ${table.Shape === 'circle' ? 'circle' : 'square'}`}
                            style={{
                                left: table.PosX,
                                top: table.PosY,
                                width: '110px',
                                height: '110px'
                            }}
                        >
                            <span style={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 700,
                                fontSize: '1.1rem'
                            }}>
                                {table.Name}
                            </span>
                            <span style={{
                                fontSize: '0.7rem',
                                fontFamily: "'Inter', sans-serif",
                                opacity: 0.85,
                                marginTop: '2px'
                            }}>
                                {table.Capacity} personas
                            </span>
                            <span style={{
                                fontSize: '0.6rem',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                marginTop: '4px',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '2px 8px',
                                borderRadius: '10px'
                            }}>
                                {table.IsOccupied ? 'Ocupada' : 'Libre'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '1.5rem',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem',
                color: 'var(--gris-medio)'
            }}>
                <span>🖱️ Clic = Cambiar estado</span>
                <span>↕️ Arrastrar = Mover mesa</span>
            </div>
        </div>
    );
};

export default TablesManager;
