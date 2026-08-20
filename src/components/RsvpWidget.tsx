import { useState } from 'react';
import { X, Heart } from 'lucide-react';

type View = 'entry' | 'found' | 'already' | 'confirmed';

interface FoundGuest {
  name: string;
  passes: number;
}

export default function RsvpWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('entry');
  const [name, setName] = useState('');
  const [guest, setGuest] = useState<FoundGuest | null>(null);
  const [checking, setChecking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [fatalError, setFatalError] = useState(false);

  const reset = () => {
    setView('entry');
    setName('');
    setGuest(null);
    setChecking(false);
    setConfirming(false);
    setNotFound(false);
    setFatalError(false);
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(reset, 300);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || checking) return;

    setChecking(true);
    setNotFound(false);
    setFatalError(false);

    try {
      const res = await fetch('/api/rsvp/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();

      if (res.ok && data.found) {
        setGuest({ name: data.name, passes: data.passes });
        setView(data.confirmed ? 'already' : 'found');
      } else if (res.status === 404) {
        setNotFound(true);
      } else {
        setFatalError(true);
      }
    } catch {
      setFatalError(true);
    } finally {
      setChecking(false);
    }
  };

  const handleConfirm = async () => {
    if (!guest || confirming) return;

    setConfirming(true);
    setFatalError(false);

    try {
      const res = await fetch('/api/rsvp/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guest.name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFatalError(true);
        return;
      }

      if (data.alreadyConfirmed) {
        setView('already');
      } else {
        setView('confirmed');
      }
    } catch {
      setFatalError(true);
    } finally {
      setConfirming(false);
    }
  };

  const passesLabel = (n: number) =>
    n === 1 ? 'pase de acceso' : 'pases de acceso';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='px-12 py-4 border border-accent/50 text-accent hover:bg-accent hover:text-background font-body text-[10px] tracking-[0.45em] uppercase transition-all duration-300'
      >
        Confirmar Asistencia
      </button>

      {open && (
        <div
          className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4'
          style={{ backgroundColor: 'rgba(12,2,5,0.94)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className='relative w-full sm:max-w-md bg-card border border-accent/25 p-8 sm:p-10 max-h-[92vh] overflow-y-auto sm:rounded-none rounded-t-2xl'>
            <button
              onClick={closeModal}
              className='absolute top-5 right-5 text-foreground/30 hover:text-accent transition-colors duration-200 p-1'
              aria-label='Cerrar'
            >
              <X size={17} />
            </button>

            <div className='text-center mb-8'>
              <div className='flex items-center gap-3 text-accent'>
                <div className='flex-1 h-px bg-accent opacity-25' />
                <svg
                  width={7}
                  height={7}
                  viewBox='0 0 10 10'
                  fill='currentColor'
                  className='shrink-0'
                  style={{ opacity: 0.5 }}
                >
                  <polygon points='5,0 10,5 5,10 0,5' />
                </svg>
                <div className='w-2 h-px bg-accent opacity-35' />
                <svg
                  width={11}
                  height={11}
                  viewBox='0 0 10 10'
                  fill='currentColor'
                  className='shrink-0'
                >
                  <polygon points='5,0 10,5 5,10 0,5' />
                </svg>
                <div className='w-2 h-px bg-accent opacity-35' />
                <svg
                  width={7}
                  height={7}
                  viewBox='0 0 10 10'
                  fill='currentColor'
                  className='shrink-0'
                  style={{ opacity: 0.5 }}
                >
                  <polygon points='5,0 10,5 5,10 0,5' />
                </svg>
                <div className='flex-1 h-px bg-accent opacity-25' />
              </div>
              <h3 className='font-display text-xl tracking-[0.25em] text-foreground uppercase mt-5'>
                Confirmación
              </h3>
              <p className='font-body text-accent/60 text-[9px] tracking-[0.55em] uppercase mt-5'>
                de Asistencia
              </p>
            </div>

            {fatalError && (
              <p className='text-destructive text-xs font-body text-center mb-5'>
                Algo salió mal. Intenta de nuevo.
              </p>
            )}

            {view === 'entry' && (
              <form onSubmit={handleCheck} className='space-y-6'>
                <div>
                  <label className='block text-foreground/45 text-[9px] tracking-[0.45em] uppercase font-body mb-2.5'>
                    Nombre Completo
                  </label>
                  <input
                    type='text'
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Escribe tu nombre como aparece en la invitación'
                    className='w-full bg-transparent border-b border-accent/30 focus:border-accent py-2.5 text-foreground text-sm outline-none transition-colors duration-300 font-body placeholder:text-foreground/15'
                  />
                  {notFound && (
                    <p className='text-destructive text-xs font-body mt-3'>
                      No encontramos tu nombre en la lista de invitados.
                      Verifícalo e intenta de nuevo.
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={checking}
                  className='w-full py-4 bg-accent text-background hover:bg-foreground font-body text-[10px] tracking-[0.45em] uppercase transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  {checking ? 'Verificando...' : 'Continuar'}
                </button>
              </form>
            )}

            {view === 'found' && guest && (
              <div className='text-center py-6'>
                <p className='text-foreground/45 text-[9px] tracking-[0.45em] uppercase font-body mb-4'>
                  ¡Te encontramos!
                </p>
                <p className='font-display text-xl text-foreground tracking-wide mb-6 uppercase'>
                  {guest.name}
                </p>

                <div className='border border-accent/30 py-6 px-4 mb-8'>
                  <p className='font-body text-accent/60 text-[9px] tracking-[0.45em] uppercase mb-2'>
                    Pases disponibles
                  </p>
                  <p className='font-display text-4xl text-accent mb-1'>
                    {guest.passes}
                  </p>
                  <p className='text-foreground/45 text-xs font-body'>
                    {passesLabel(guest.passes)}
                  </p>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className='w-full py-4 bg-accent text-background hover:bg-foreground font-body text-[10px] tracking-[0.45em] uppercase transition-all duration-300 mb-3 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  {confirming ? 'Confirmando...' : 'Confirmar Asistencia'}
                </button>

                <button
                  onClick={() => {
                    setView('entry');
                    setName('');
                    setNotFound(false);
                    setGuest(null);
                  }}
                  className='text-foreground/40 hover:text-accent text-[10px] tracking-[0.25em] uppercase font-body transition-colors duration-200'
                >
                  Usar otro nombre
                </button>
              </div>
            )}

            {view === 'already' && (
              <div className='text-center py-8'>
                <Heart
                  size={34}
                  className='text-accent mx-auto mb-5'
                  fill='currentColor'
                />
                <p className='font-display text-lg text-foreground tracking-wide mb-3 uppercase'>
                  Ya confirmaste tu asistencia
                </p>
                <p className='text-foreground/45 text-sm font-body leading-relaxed'>
                  Nos vemos muy pronto.
                  <br />
                  Los esperamos con ansias.
                </p>
                <button
                  onClick={closeModal}
                  className='mt-9 px-10 py-3 border border-accent/40 text-accent text-[10px] tracking-[0.35em] uppercase font-body hover:bg-accent hover:text-background transition-all duration-300'
                >
                  Cerrar
                </button>
              </div>
            )}

            {view === 'confirmed' && guest && (
              <div className='text-center py-8'>
                <Heart
                  size={34}
                  className='text-accent mx-auto mb-5'
                  fill='currentColor'
                />
                <p className='font-display text-xl text-foreground tracking-wide mb-3 uppercase'>
                  ¡Con mucho amor, gracias!
                </p>
                <p className='text-foreground/45 text-sm font-body leading-relaxed'>
                  Hemos recibido tu confirmación.
                  <br />
                  {guest.passes} {passesLabel(guest.passes)} reservados para
                  <br />
                  <span className='text-accent'>{guest.name}</span>.
                  <br />
                  {guest.passes > 1 ? 'Los' : 'Te'} esperamos con el corazón
                  abierto.
                </p>
                <button
                  onClick={closeModal}
                  className='mt-9 px-10 py-3 border border-accent/40 text-accent text-[10px] tracking-[0.35em] uppercase font-body hover:bg-accent hover:text-background transition-all duration-300'
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
