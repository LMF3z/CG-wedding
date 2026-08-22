import { useState } from 'react';
import { Heart } from 'lucide-react';

type View = 'entry' | 'found' | 'already' | 'confirmed';

interface FoundGuest {
  name: string;
  passes: number;
}

function WaxSealIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      className='opacity-70'
    >
      <path d='M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18.5L6 21.5L7 14.5L2 9.5L9 8.5L12 2Z' />
    </svg>
  );
}

function OrnamentDivider() {
  return (
    <div className='flex items-center gap-3 text-gold'>
      <div className='flex-1 h-px bg-gold opacity-25' />
      <svg
        width='7'
        height='7'
        viewBox='0 0 10 10'
        fill='currentColor'
        style={{ opacity: 0.5 }}
      >
        <polygon points='5,0 10,5 5,10 0,5' />
      </svg>
      <div className='w-2 h-px bg-gold opacity-35' />
      <svg width='11' height='11' viewBox='0 0 10 10' fill='currentColor'>
        <polygon points='5,0 10,5 5,10 0,5' />
      </svg>
      <div className='w-2 h-px bg-gold opacity-35' />
      <svg
        width='7'
        height='7'
        viewBox='0 0 10 10'
        fill='currentColor'
        style={{ opacity: 0.5 }}
      >
        <polygon points='5,0 10,5 5,10 0,5' />
      </svg>
      <div className='flex-1 h-px bg-gold opacity-25' />
    </div>
  );
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
      {/* Wax Seal Button */}
      <button
        onClick={() => setOpen(true)}
        className='wax-seal mx-auto'
        type='button'
      >
        <div className='flex flex-col items-center gap-0.5'>
          <WaxSealIcon />
          <span className='font-display text-[8px] tracking-[0.15em] uppercase font-semibold leading-tight'>
            Confirmar
          </span>
        </div>
      </button>

      {open && (
        <div
          className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4'
          style={{ backgroundColor: 'rgba(62, 7, 20, 0.94)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className='relative w-full sm:max-w-md bg-cream border border-gold/20 sm:rounded-none rounded-t-2xl max-h-[92vh] overflow-y-auto'>
            {/* Decorative scalloped card */}
            <div className='border-scalloped m-3 p-6 sm:p-8 bg-paper-texture'>
              <button
                onClick={closeModal}
                className='absolute top-6 right-6 text-burgundy/30 hover:text-gold transition-colors duration-200 p-1 z-10'
                aria-label='Cerrar'
              >
                <svg
                  width='17'
                  height='17'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M18 6L6 18M6 6l12 12' />
                </svg>
              </button>

              <div className='text-center mb-8'>
                <OrnamentDivider />
                <h3 className='font-display text-xl tracking-[0.25em] text-burgundy uppercase mt-5'>
                  Confirmación
                </h3>
                <p className='font-body text-gold text-[9px] tracking-[0.55em] uppercase mt-3'>
                  de Asistencia
                </p>
              </div>

              {fatalError && (
                <p className='text-deep-red text-xs font-body text-center mb-5'>
                  Algo salio mal. Intenta de nuevo.
                </p>
              )}

              {view === 'entry' && (
                <form onSubmit={handleCheck} className='space-y-6'>
                  <div>
                    <label className='block text-burgundy/50 text-[9px] tracking-[0.45em] uppercase font-body mb-2.5'>
                      Nombre Completo
                    </label>
                    <input
                      type='text'
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Escribe tu nombre como aparece en la invitacion'
                      className='w-full bg-transparent border border-dashed border-gold/30 focus:border-gold py-2.5 px-3 text-burgundy text-sm outline-none transition-colors duration-300 font-body placeholder:text-burgundy/20'
                    />
                    {notFound && (
                      <p className='text-deep-red text-xs font-body mt-3'>
                        No encontramos tu nombre en la lista de invitados.
                        Verificalo e intenta de nuevo.
                      </p>
                    )}
                  </div>

                  <button
                    type='submit'
                    disabled={checking}
                    className='w-full py-4 bg-burgundy text-gold hover:bg-burgundy-light font-body text-[10px] tracking-[0.45em] uppercase transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed border border-dashed border-gold/30'
                  >
                    {checking ? 'Verificando...' : 'Continuar'}
                  </button>
                </form>
              )}

              {view === 'found' && guest && (
                <div className='text-center py-6'>
                  <p className='text-burgundy/50 text-[9px] tracking-[0.45em] uppercase font-body mb-4'>
                    Te encontramos!
                  </p>
                  <p className='font-display text-xl text-burgundy tracking-wide mb-6 uppercase'>
                    {guest.name}
                  </p>

                  <div className='border border-dashed border-gold/40 py-6 px-4 mb-8'>
                    <p className='font-body text-gold/70 text-[9px] tracking-[0.45em] uppercase mb-2'>
                      Pases disponibles
                    </p>
                    <p className='font-display text-4xl text-gold mb-1'>
                      {guest.passes}
                    </p>
                    <p className='text-burgundy/50 text-xs font-body'>
                      {passesLabel(guest.passes)}
                    </p>
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    className='wax-seal mx-auto mb-4'
                    type='button'
                  >
                    <div className='flex flex-col items-center gap-0.5'>
                      <WaxSealIcon />
                      <span className='font-display text-[8px] tracking-[0.15em] uppercase font-semibold leading-tight'>
                        {confirming ? 'Confirmando...' : 'Confirmar'}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setView('entry');
                      setName('');
                      setNotFound(false);
                      setGuest(null);
                    }}
                    className='text-burgundy/40 hover:text-gold text-[10px] tracking-[0.25em] uppercase font-body transition-colors duration-200 block mx-auto'
                  >
                    Usar otro nombre
                  </button>
                </div>
              )}

              {view === 'already' && (
                <div className='text-center py-8'>
                  <Heart
                    size={34}
                    className='text-gold mx-auto mb-5'
                    fill='currentColor'
                  />
                  <p className='font-display text-lg text-burgundy tracking-wide mb-3 uppercase'>
                    Ya confirmaste tu asistencia
                  </p>
                  <p className='text-burgundy/50 text-sm font-serif italic leading-relaxed'>
                    Nos vemos muy pronto.
                    <br />
                    Los esperamos con ansias.
                  </p>
                  <button onClick={closeModal} className='mt-9 btn-secondary'>
                    Cerrar
                  </button>
                </div>
              )}

              {view === 'confirmed' && guest && (
                <div className='text-center py-8'>
                  <Heart
                    size={34}
                    className='text-gold mx-auto mb-5'
                    fill='currentColor'
                  />
                  <p className='font-display text-xl text-burgundy tracking-wide mb-3 uppercase'>
                    Con mucho amor, gracias!
                  </p>
                  <p className='text-burgundy/50 text-sm font-serif italic leading-relaxed'>
                    Hemos recibido tu confirmacion.
                    <br />
                    {guest.passes} {passesLabel(guest.passes)} reservados para
                    <br />
                    <span className='text-gold font-medium not-italic'>
                      {guest.name}
                    </span>
                    .
                    <br />
                    {guest.passes > 1 ? 'Los' : 'Te'} esperamos con el corazon
                    abierto.
                  </p>
                  <button onClick={closeModal} className='mt-9 btn-secondary'>
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
