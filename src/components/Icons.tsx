import { ChevronDown, Clock, Heart, MapPin } from 'lucide-react';

export function ClockIcon() {
  return <Clock size={14} className="text-gold" />;
}

export function MapPinIcon() {
  return <MapPin size={14} className="text-gold" />;
}

export function HeartIcon({ size = 19 }: { size?: number }) {
  return <Heart size={size} className="text-gold" fill="currentColor" />;
}

export function ChevronDownIcon() {
  return <ChevronDown size={13} />;
}

export function CloseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
