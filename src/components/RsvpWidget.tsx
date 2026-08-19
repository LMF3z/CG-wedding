import { useState } from 'react';
import { X, Heart } from 'lucide-react';

type Status = 'idle' | 'sending' | 'submitted' | 'error';

export default function RsvpWidget() {
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const closeModal = () => {
    setOpen(false);
    if (status === 'submitted') {
      setTimeout(() => {
        setStatus('idle');
        setName('');
        setGuests(1);
        setMessage('');
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, guests, message }),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setStatus('submitted');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-12 py-4 border border-accent/50 text-accent hover:bg-accent hover:text-background font-body text-[10px] tracking-[0.45em] uppercase transition-all duration-300"
      >
        Confirmar Asistencia
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(12,2,5,0.94)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full sm:max-w-md bg-card border border-accent/25 p-8 sm:p-10 max-h-[92vh] overflow-y-auto sm:rounded-none rounded-t-2xl">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-foreground/30 hover:text-accent transition-colors duration-200 p-1"
              aria-label="Cerrar"
            >
              <X size={17} />
            </button>

            <div className="text-center mb-8">
              <div className="flex items-center gap-3 text-accent">
                <div className="flex-1 h-px bg-accent opacity-25" />
                <svg width={7} height={7} viewBox="0 0 10 10" fill="currentColor" className="flex-shrink-0" style={{ opacity: 0.5 }}>
                  <polygon points="5,0 10,5 5,10 0,5" />
                </svg>
                <div className="w-2 h-px bg-accent opacity-35" />
                <svg width={11} height={11} viewBox="0 0 10 10" fill="currentColor" className="flex-shrink-0">
                  <polygon points="5,0 10,5 5,10 0,5" />
                </svg>
                <div className="w-2 h-px bg-accent opacity-35" />
                <svg width={7} height={7} viewBox="0 0 10 10" fill="currentColor" className="flex-shrink-0" style={{ opacity: 0.5 }}>
                  <polygon points="5,0 10,5 5,10 0,5" />
                </svg>
                <div className="flex-1 h-px bg-accent opacity-25" />
              </div>
              <h3 className="font-display text-xl tracking-[0.25em] text-foreground uppercase mt-5">
                Confirmación
              </h3>
              <p className="font-body text-accent/60 text-[9px] tracking-[0.55em] uppercase mt-5">
                de Asistencia
              </p>
            </div>

            {status === 'submitted' ? (
              <div className="text-center py-8">
                <Heart
                  size={34}
                  className="text-accent mx-auto mb-5"
                  fill="currentColor"
                />
                <p className="font-display text-xl text-foreground tracking-wide mb-3 uppercase">
                  ¡Con mucho amor, gracias!
                </p>
                <p className="text-foreground/45 text-sm font-body leading-relaxed">
                  Hemos recibido tu confirmación.
                  <br />
                  Los esperamos con el corazón abierto.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-9 px-10 py-3 border border-accent/40 text-accent text-[10px] tracking-[0.35em] uppercase font-body hover:bg-accent hover:text-background transition-all duration-300"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-foreground/45 text-[9px] tracking-[0.45em] uppercase font-body mb-2.5">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full bg-transparent border-b border-accent/30 focus:border-accent py-2.5 text-foreground text-sm outline-none transition-colors duration-300 font-body placeholder:text-foreground/15"
                  />
                </div>

                <div>
                  <label className="block text-foreground/45 text-[9px] tracking-[0.45em] uppercase font-body mb-3">
                    Número de asistentes
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([1, 2] as const).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setGuests(n)}
                        className={`py-3 text-[10px] tracking-[0.2em] uppercase font-body border transition-all duration-200 ${
                          guests === n
                            ? 'border-accent bg-accent text-background'
                            : 'border-accent/25 text-foreground/45 hover:border-accent/55 hover:text-foreground/70'
                        }`}
                      >
                        {n} {n === 1 ? 'Persona' : 'Personas'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-foreground/45 text-[9px] tracking-[0.45em] uppercase font-body mb-2.5">
                    Mensaje para los novios
                    <span className="text-foreground/25 ml-1">(opcional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Comparte un deseo o mensaje especial..."
                    className="w-full bg-transparent border border-accent/20 focus:border-accent/50 p-3 text-foreground text-sm outline-none resize-none transition-colors duration-300 font-body placeholder:text-foreground/15"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-destructive text-xs font-body text-center">
                    No pudimos guardar tu confirmación. Intenta de nuevo.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 bg-accent text-background hover:bg-foreground font-body text-[10px] tracking-[0.45em] uppercase transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Enviando...' : 'Confirmar Asistencia'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}