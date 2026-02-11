
import React, { useEffect, useState } from 'react';
import { getCategories, getProducts, createProduct, updateProduct } from '../services/api';

// Base URL for static assets (images) - strips '/api' from the API URL
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');

const MenuManager = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({ Name: '', Description: '', Price: '', CategoryId: '' });
    const [imageFile, setImageFile] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const cats = await getCategories();
            const prods = await getProducts();
            setCategories(cats);
            setProducts(prods);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newProduct.CategoryId) return alert('Selecciona una categoría');

        const formData = new FormData();
        formData.append('Name', newProduct.Name);
        formData.append('Description', newProduct.Description);
        formData.append('Price', newProduct.Price);
        formData.append('CategoryId', newProduct.CategoryId);
        if (imageFile) {
            formData.append('image', imageFile);
        } else {
            formData.append('ImageUrl', 'https://via.placeholder.com/150');
        }

        try {
            await createProduct(formData);
            setNewProduct({ Name: '', Description: '', Price: '', CategoryId: '' });
            setImageFile(null);
            document.getElementById('fileInput').value = "";
            setShowForm(false);
            fetchData();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const toggleActive = async (product) => {
        try {
            await updateProduct(product.Id, { ...product, IsActive: !product.IsActive });
            fetchData();
        } catch (error) {
            console.error("Error updating product", error);
        }
    }

    if (loading) return (
        <div style={{ padding: '5rem', textAlign: 'center' }}>
            <div className="loading-spinner" />
            <p style={{ marginTop: '1rem', color: 'var(--gris-medio)', fontFamily: "'Inter', sans-serif" }}>
                Cargando nuestra carta...
            </p>
        </div>
    );

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
                    <h1 className="section-title">Nuestra Carta</h1>
                    <div className="section-divider" />
                    <p className="section-subtitle" style={{ marginBottom: 0 }}>
                        Gestiona los manjares de nuestra cocina tradicional. Añade nuevos platos, actualiza precios y controla la disponibilidad.
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    style={{ marginTop: '0.5rem' }}
                >
                    {showForm ? '✕ Cerrar' : '+ Nuevo Plato'}
                </button>
            </div>

            {/* Form - Collapsible */}
            {showForm && (
                <div className="card-cabornera animate-slide-down" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: 'var(--verde-montana)'
                        }}>
                            Agregar Nuevo Plato
                        </h2>
                        <div className="section-divider" style={{ marginTop: '0.5rem', marginBottom: '0' }} />
                    </div>
                    <form onSubmit={handleSubmit} style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1rem'
                    }}>
                        <input
                            name="Name"
                            placeholder="Nombre del Plato"
                            value={newProduct.Name}
                            onChange={handleInputChange}
                            className="input-cabornera"
                            required
                        />
                        <input
                            name="Price"
                            type="number"
                            step="0.01"
                            placeholder="Precio (€)"
                            value={newProduct.Price}
                            onChange={handleInputChange}
                            className="input-cabornera"
                            required
                        />
                        <input
                            name="Description"
                            placeholder="Descripción del plato"
                            value={newProduct.Description}
                            onChange={handleInputChange}
                            className="input-cabornera"
                        />
                        <div style={{
                            padding: '1.2rem',
                            border: '2px dashed var(--crema-oscura)',
                            borderRadius: '10px',
                            background: 'rgba(245, 236, 215, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'border-color 0.3s ease'
                        }}
                            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--oro-otono)'}
                            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--crema-oscura)'}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <span style={{ fontSize: '1.5rem' }}>📷</span>
                            <span style={{
                                fontSize: '0.85rem',
                                fontFamily: "'Inter', sans-serif",
                                color: 'var(--gris-medio)',
                                fontWeight: 500
                            }}>
                                {imageFile ? imageFile.name : 'Arrastra o haz clic para subir foto'}
                            </span>
                            <span style={{
                                fontSize: '0.7rem',
                                color: 'var(--gris-medio)',
                                opacity: 0.6
                            }}>
                                PNG, JPG (Max. 5MB)
                            </span>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <select
                            name="CategoryId"
                            value={newProduct.CategoryId}
                            onChange={handleInputChange}
                            className="select-cabornera"
                            required
                        >
                            <option value="">Seleccionar Categoría</option>
                            {categories.map(cat => <option key={cat.Id} value={cat.Id}>{cat.Name}</option>)}
                        </select>
                        <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                            Agregar a la Carta
                        </button>
                    </form>
                </div>
            )}

            {/* Categories & Products */}
            {categories.map(cat => {
                const catProducts = products.filter(p => p.CategoryId === cat.Id);
                if (catProducts.length === 0) return null;

                return (
                    <div key={cat.Id} style={{ marginBottom: '3rem' }} className="animate-fade-in-up">
                        {/* Category Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.8rem',
                                fontWeight: 600,
                                color: 'var(--marron-roble)'
                            }}>
                                {cat.Name}
                            </h2>
                            <div style={{
                                flex: 1,
                                height: '1px',
                                background: 'linear-gradient(90deg, var(--crema-oscura), transparent)'
                            }} />
                            <span className="badge badge-gold">
                                {catProducts.length} plato{catProducts.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Products Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {catProducts.map(product => (
                                <div key={product.Id} className="card-cabornera" style={{
                                    opacity: product.IsActive ? 1 : 0.55,
                                    transition: 'all 0.4s ease'
                                }}>
                                    {/* Image */}
                                    <div style={{
                                        height: '200px',
                                        background: 'linear-gradient(135deg, var(--crema-oscura), var(--crema-piedra))',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {product.ImageUrl ? (
                                            <img
                                                src={product.ImageUrl.startsWith('http') ? product.ImageUrl : `${API_BASE}${product.ImageUrl}`}
                                                alt={product.Name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease'
                                                }}
                                                onMouseOver={e => e.target.style.transform = 'scale(1.08)'}
                                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                            />
                                        ) : (
                                            <div style={{
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '3rem',
                                                opacity: 0.3
                                            }}>
                                                🍽️
                                            </div>
                                        )}
                                        {/* Price badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '0.75rem',
                                            right: '0.75rem',
                                            background: 'rgba(45, 80, 22, 0.9)',
                                            color: 'white',
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '20px',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            fontFamily: "'Inter', sans-serif",
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            €{product.Price}
                                        </div>
                                        {/* Active status */}
                                        {!product.IsActive && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '0.75rem',
                                                left: '0.75rem',
                                                background: 'rgba(139, 26, 26, 0.9)',
                                                color: 'white',
                                                padding: '0.3rem 0.7rem',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                fontFamily: "'Inter', sans-serif"
                                            }}>
                                                No Disponible
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '1.25rem' }}>
                                        <h3 style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1.2rem',
                                            fontWeight: 600,
                                            color: 'var(--gris-pizarra)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {product.Name}
                                        </h3>
                                        <p style={{
                                            color: 'var(--gris-medio)',
                                            fontSize: '0.88rem',
                                            lineHeight: 1.5,
                                            marginBottom: '1rem',
                                            minHeight: '2.5rem'
                                        }}>
                                            {product.Description || 'Plato tradicional de la montaña leonesa.'}
                                        </p>
                                        <button
                                            onClick={() => toggleActive(product)}
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                fontFamily: "'Inter', sans-serif",
                                                transition: 'all 0.3s ease',
                                                background: product.IsActive
                                                    ? 'rgba(139, 26, 26, 0.08)'
                                                    : 'rgba(45, 80, 22, 0.08)',
                                                color: product.IsActive
                                                    ? 'var(--rojo-leones)'
                                                    : 'var(--verde-montana)'
                                            }}
                                        >
                                            {product.IsActive ? '✕ Desactivar' : '✓ Activar'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {products.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    color: 'var(--gris-medio)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.4 }}>🍽️</div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem' }}>
                        La carta está vacía
                    </p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Agrega tu primer plato para empezar
                    </p>
                </div>
            )}
        </div>
    );
};

export default MenuManager;
