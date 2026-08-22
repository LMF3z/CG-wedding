import heroImage from '../assets/images/photo-1.jpeg';
import photo2 from '../assets/images/photo-2.jpeg';
import photo3 from '../assets/images/photo-3.jpeg';
import photo4 from '../assets/images/photo-4.jpeg';
import audioBackground from '../assets/audios/Imagine Dragons - Next To Me.mp3';

export const WEDDING_DATE = '24 · Septiembre · 2026';

export const WEDDING_DATE_ISO = '2026-09-24T20:00:00';

export const RSVP_DEADLINE = '24 de agosto de 2026';

export const COUPLE = { bride: 'Génesis', groom: 'César' };

export const HERO_IMAGE = heroImage;

export const PHOTOS = [
  { src: photo4, alt: 'Foto de la pareja' },
  { src: photo2, alt: 'Foto de la pareja' },
  { src: photo3, alt: 'Foto de la pareja' },
];

export const AUDIOS = [audioBackground];

export const CEREMONY = {
  time: '8:00 PM',
  timeLabel: 'Inicio de la ceremonia',
  venue: 'Iglesia San Pedro apóstol (Sector el progreso)',
  address: 'Sector el progreso Calle 113A Ciudad Maracaibo',
  mapsUrl:
    'https://www.google.com/maps/place/Iglesia+San+Pedro+Ap%C3%B3stol/@10.6199987,-71.6276394,17z/data=!4m14!1m7!3m6!1s0x8e8999cc3aa7700d:0x58674f467bac641b!2sIglesia+San+Pedro+Ap%C3%B3stol!8m2!3d10.6199934!4d-71.6250645!16s%2Fg%2F11fy4kyh4q!3m5!1s0x8e8999cc3aa7700d:0x58674f467bac641b!8m2!3d10.6199934!4d-71.6250645!16s%2Fg%2F11fy4kyh4q?entry=ttu&g_ep=EgoyMDI2MDgxNi4wIKXMDSoASAFQAw%3D%3D',
};

export const RECEPTION = {
  time: '9:00 PM',
  timeLabel: 'Inicio de la recepción',
  venue: 'Hato club San Francisco',
  address: 'Calle 17, San Francisco - Coromoto',
  mapsUrl:
    'https://www.google.com/maps/search/Hato%20Club%20San%20Francisco/@10.5633,-71.6204,17z?hl=es',
};
