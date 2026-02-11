
import React, { useState, useEffect } from 'react';
import MenuManager from './components/MenuManager';
import TablesManager from './components/TablesManager';
import ReservationsManager from './components/ReservationsManager';

function App() {
  const [view, setView] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'menu', label: 'Carta' },
    { id: 'tables', label: 'Mesas' },
    { id: 'reservations', label: 'Reservas' },
  ];

  const handleNavClick = (id) => {
    setView(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--crema-piedra)' }}>
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled || view !== 'home' ? 'scrolled' : ''}`}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => handleNavClick('home')}
            className="nav-logo"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Cabornera<span>.</span>
          </button>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${view === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ===== HERO (HOME) ===== */}
      {view === 'home' && (
        <section className="hero-section">
          <div style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            padding: '0 2rem',
            maxWidth: '900px'
          }}>
            {/* Decorative badge */}
            <div className="animate-fade-in" style={{
              marginBottom: '1.5rem',
              opacity: 0,
              animationDelay: '0.2s'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1.5rem',
                border: '1px solid rgba(201, 150, 59, 0.5)',
                borderRadius: '30px',
                color: 'var(--oro-claro)',
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif"
              }}>
                ✦ Montaña Central de León ✦
              </span>
            </div>

            {/* Main title */}
            <h1 className="animate-fade-in-up" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
              opacity: 0,
              animationDelay: '0.4s'
            }}>
              Restaurante
              <br />
              <span style={{ color: 'var(--oro-otono)' }}>Cabornera</span>
            </h1>

            {/* Stitch-inspired subtitle */}
            <p className="animate-fade-in" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.3rem',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--oro-claro)',
              letterSpacing: '0.08em',
              margin: '0.5rem 0',
              opacity: 0,
              animationDelay: '0.5s'
            }}>
              Alta Cocina de Montaña
            </p>

            {/* Ornamental divider */}
            <div className="animate-fade-in" style={{
              margin: '1.5rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              opacity: 0,
              animationDelay: '0.6s'
            }}>
              <div style={{ width: '60px', height: '1px', background: 'rgba(201, 150, 59, 0.5)' }} />
              <span style={{ color: 'var(--oro-otono)', fontSize: '1.2rem' }}>❖</span>
              <div style={{ width: '60px', height: '1px', background: 'rgba(201, 150, 59, 0.5)' }} />
            </div>

            {/* Description */}
            <p className="animate-fade-in-up" style={{
              fontSize: '1.15rem',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 300,
              maxWidth: '620px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.8,
              fontFamily: "'Inter', sans-serif",
              opacity: 0,
              animationDelay: '0.8s'
            }}>
              Descubra la esencia culinaria de la Reserva de la Biosfera Alto Bernesga.
              Tradición viva y producto local en el corazón de la montaña leonesa.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up" style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: 0,
              animationDelay: '1s'
            }}>
              <button
                className="btn-gold"
                onClick={() => handleNavClick('menu')}
                style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
              >
                Ver Nuestra Carta
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleNavClick('reservations')}
                style={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.4)',
                  fontSize: '1rem',
                  padding: '1rem 2.5rem'
                }}
              >
                Reservar Mesa
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURES (HOME) ===== */}
      {view === 'home' && (
        <section style={{
          padding: '5rem 2rem',
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Sabores de la Montaña Leonesa
            </h2>
            <div className="section-divider" style={{ margin: '0.75rem auto 1rem' }} />
            <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Cocina tradicional con productos de la tierra, en un entorno que rinde homenaje
              al pueblo de Cabornera y el valle del río Casares.
            </p>
          </div>

          <div className="stagger-children" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '🏔️',
                title: 'Del Valle a la Mesa',
                desc: 'Ingredientes recolectados a menos de 20km, garantizando la frescura y el apoyo a productores locales.'
              },
              {
                icon: '🍷',
                title: 'Bodega Selecta',
                desc: 'Una cuidada selección de vinos de la DO León y El Bierzo, maridados para realzar cada bocado.'
              },
              {
                icon: '⛪',
                title: 'Tradición Viva',
                desc: 'Recetas ancestrales interpretadas con técnicas modernas, respetando el alma de nuestra tierra.'
              },
              {
                icon: '🌿',
                title: 'Reserva de la Biosfera',
                desc: 'Comprometidos con el entorno del Alto Bernesga, reconocido mundialmente por su biodiversidad.'
              }
            ].map((feature, i) => (
              <div key={i} className="card-cabornera" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '1.25rem',
                  display: 'block',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: 'var(--verde-montana)',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'var(--gris-medio)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  fontWeight: 300
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== CULINARY JOURNEY (HOME) - Stitch-inspired ===== */}
      {view === 'home' && (
        <section style={{
          padding: '5rem 2rem',
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Left — Text content */}
            <div className="animate-fade-in-up">
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.2rem',
                fontWeight: 700,
                color: 'var(--verde-montana)',
                marginBottom: '0.5rem',
                lineHeight: 1.3
              }}>
                Un viaje sensorial por el Alto Bernesga
              </h2>
              <div className="section-divider" />
              <p style={{
                color: 'var(--gris-medio)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: '2rem'
              }}>
                Desde el emblemático Cocido Leonés hasta nuestras carnes de vaca vieja
                maduradas en el clima seco de la montaña. Cada plato cuenta una historia
                de pastores, valles y fuego.
              </p>

              {/* Checklist items from Stitch */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Cecina de León IGP "Gran Reserva"',
                  'Setas de temporada del bosque local',
                  'Cordero lechal asado al estilo tradicional'
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(45, 80, 22, 0.05)',
                    borderRadius: '10px',
                    borderLeft: '3px solid var(--verde-montana)'
                  }}>
                    <span style={{
                      color: 'var(--verde-montana)',
                      fontSize: '1.2rem',
                      fontWeight: 700
                    }}>✓</span>
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'var(--gris-pizarra)'
                    }}>{item}</span>
                  </div>
                ))}
              </div>

              <button
                className="btn-gold"
                onClick={() => handleNavClick('menu')}
                style={{ marginTop: '2rem', padding: '0.85rem 2rem' }}
              >
                Explorar la carta completa →
              </button>
            </div>

            {/* Right — Decorative visual card */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--verde-montana), var(--verde-claro))',
                borderRadius: '20px',
                padding: '3rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {/* Decorative circles */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'rgba(201, 150, 59, 0.15)',
                  pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🍂</div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    lineHeight: 1.3
                  }}>
                    Cocina Estacional
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    opacity: 0.9,
                    fontWeight: 300,
                    marginBottom: '1.5rem'
                  }}>
                    Nuestro menú se transforma con cada estación. En otoño, setas y caza.
                    En invierno, cocidos y guisos. En primavera, verduras del huerto.
                    En verano, parrilla al aire libre.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    fontSize: '2rem',
                    opacity: 0.7
                  }}>
                    <span>🌸</span>
                    <span>☀️</span>
                    <span>🍂</span>
                    <span>❄️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== STATS BAR (HOME) ===== */}
      {view === 'home' && (
        <section style={{
          background: 'linear-gradient(135deg, var(--verde-montana), #1D3A0E)',
          padding: '4rem 2rem',
          color: 'white'
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {[
              { number: '1.000m', label: 'Altitud sobre el nivel del mar' },
              { number: 'S. XII', label: 'Primera mención documentada' },
              { number: '🌍', label: 'Reserva de la Biosfera UNESCO' },
              { number: '❤️', label: 'Cocina con alma leonesa' }
            ].map((stat, i) => (
              <div key={i} className="animate-fade-in-up" style={{ opacity: 0, animationDelay: `${0.2 * i}s` }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--oro-otono)',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 300 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== FOOTER (HOME) ===== */}
      {view === 'home' && (
        <footer className="footer">
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                color: 'white',
                marginBottom: '1rem'
              }}>
                Cabornera<span style={{ color: 'var(--oro-otono)' }}>.</span>
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.7 }}>
                Calle Real, s/n<br />
                24610 La Pola de Gordón<br />
                León, España
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--oro-otono)', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                Horarios
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.7 }}>
                Martes a Domingo<br />
                Almuerzo: 13:00 – 16:00<br />
                Cena: 20:30 – 23:30<br />
                <span style={{ color: 'var(--oro-claro)' }}>Lunes cerrado</span>
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--oro-otono)', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                Contacto & Reservas
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.7 }}>
                Tel: +34 987 000 000<br />
                info@restaurantecabornera.es
              </p>
            </div>
          </div>
          <div style={{
            maxWidth: '1280px',
            margin: '2rem auto 0',
            padding: '1.5rem 2rem 0',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            textAlign: 'center',
            fontSize: '0.8rem',
            opacity: 0.5
          }}>
            © 2026 Restaurante Cabornera — En homenaje al pueblo de Cabornera, León
          </div>
        </footer>
      )}

      {/* ===== CONTENT VIEWS ===== */}
      {view !== 'home' && (
        <div style={{ paddingTop: '80px' }}>
          {view === 'menu' && <MenuManager />}
          {view === 'tables' && <TablesManager />}
          {view === 'reservations' && <ReservationsManager />}
        </div>
      )}
    </div>
  );
}

export default App;
