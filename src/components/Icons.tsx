import { ChevronDown, Clock, Heart, MapPin, X } from 'lucide-react';

export function ClockIcon() {
  return <Clock size={14} className="text-accent" />;
}

export function MapPinIcon() {
  return <MapPin size={14} className="text-accent" />;
}

export function HeartIcon({ size = 19 }: { size?: number }) {
  return <Heart size={size} className="text-accent" fill="currentColor" />;
}

export function ChevronDownIcon() {
  return <ChevronDown size={13} />;
}

export function CloseIcon() {
  return <X size={17} />;
}