/**
 * Core team roster — photos from `client/src/assets/our team/`.
 * Source copy mirrors `rols.json`. Jalal stays last in the grid.
 */
import founderPortrait from '../../assets/our team/Founder.webp';
import imgAdeel from '../../assets/our team/Adeel baloch.webp';
import imgJaber from '../../assets/our team/Jaber.webp';
import imgFazeela from '../../assets/our team/Fazeela Manager.webp';
import imgMakhdoom from '../../assets/our team/Makhdoom.webp';
import imgSohail from '../../assets/our team/Sohail.webp';
import imgMeer from '../../assets/our team/Meer Dost Rahim.webp';
import imgNabeel from '../../assets/our team/Nabeel.webp';
import imgJawad from '../../assets/our team/Jawad.webp';
import imgTayaab from '../../assets/our team/Tayaab.webp';
import imgShams from '../../assets/our team/shams.webp';
import imgIqra from '../../assets/our team/Iqra.webp';
import imgMehlab from '../../assets/our team/Mehlab.webp';
import imgAbdulhaq from '../../assets/our team/Abdulhaq.webp';
import imgJalal from '../../assets/our team/Jalal.webp';

/** Large founder portrait used in the About story block (Adeel Baloch). */
export const FOUNDER_PORTRAIT = founderPortrait;

/**
 * @typedef {{ name: string, role: string, bio: string, image: string | null }} TeamMember
 */

/** @type {TeamMember[]} */
export const TEAM_MEMBERS = [
  {
    name: 'Adeel Baloch',
    role: 'Founder & Senior Software Engineer (8+ Years)',
    bio: 'A senior engineer with 8+ years of experience — coding the future of Balochistan while steering our product vision from the ground up.',
    image: imgAdeel,
  },
  {
    name: 'Jaber Baloch',
    role: 'Lead Developer / Engineering Lead',
    bio: 'The engineering powerhouse — leading our developers with deep full‑stack expertise and a relentless drive for quality.',
    image: imgJaber,
  },
  {
    name: 'Fazeela Baloch',
    role: 'Team Manager',
    bio: 'The organizational backbone — ensuring every team member has what they need to thrive and deliver their best work.',
    image: imgFazeela,
  },
  {
    name: 'Tayaab Baloch',
    role: 'Head of Social Media & Brand / Product Designer',
    bio: 'Leading our brand voice and product design — shaping every post, every pixel, and every community interaction with purpose.',
    image: imgTayaab,
  },
  {
    name: 'Mehlab Zaheer',
    role: 'Video Content Creator',
    bio: 'Transforming raw footage into cinematic stories — her editing magic turns every frame into something unforgettable.',
    image: imgMehlab,
  },
  {
    name: 'Iqra Baloch',
    role: 'Content Maker',
    bio: 'Crafting compelling, scroll‑stopping content that educates, engages, and amplifies our brand across every platform.',
    image: imgIqra,
  },
  {
    name: 'Shamuddin Baluch',
    role: 'YouTube Content Manager',
    bio: 'Owning our YouTube presence from strategy to storytelling — growing our audience with every authentic upload.',
    image: imgShams,
  },
  {
    name: 'Makhdoom Baloch',
    role: 'Lead Generator',
    bio: 'Unlocking new opportunities daily — his lead generation expertise keeps our pipeline healthy, growing, and conversion‑ready.',
    image: imgMakhdoom,
  },
  {
    name: 'Sohail Baloch',
    role: 'Lead Generator',
    bio: 'Driving business growth through strategic outreach — turning cold prospects into lasting, meaningful partnerships.',
    image: imgSohail,
  },
  {
    name: 'Meer Dost Rahim',
    role: 'Mobile App Developer',
    bio: 'Turning complex user needs into seamless, high‑performance mobile experiences that people genuinely love to use.',
    image: imgMeer,
  },
  {
    name: 'Nabeel Baloch',
    role: 'Frontend Developer',
    bio: 'Bringing designs to life with clean, responsive code that users actually enjoy interacting with every day.',
    image: imgNabeel,
  },
  {
    name: 'Jwad Baloch',
    role: 'Frontend Developer',
    bio: 'Crafting pixel‑perfect interfaces that balance beauty, speed, and accessibility for every screen and every user.',
    image: imgJawad,
  },
  {
    name: 'Abdulhaq Baloch',
    role: 'Video Editor',
    bio: 'Polishing every cut, color, and transition — turning hours of raw footage into seconds of pure impact.',
    image: imgAbdulhaq,
  },
  {
    name: 'Jalal Baloch',
    role: 'Video Editor',
    bio: 'Bringing visual stories to life with precision editing and a sharp eye for detail that makes every video shine.',
    image: imgJalal,
  },
];

export const TEAM_STATS = [
  {
    value: '20+',
    label: 'Specialists',
    sub: 'Senior engineers, designers & creators',
  },
  {
    value: '14+',
    label: 'Core team',
    sub: 'The people you meet on every project',
  },
  {
    value: '2024',
    label: 'Operating since',
    sub: 'Balochistan · remote-first worldwide',
  },
  {
    value: '100%',
    label: 'Client ownership',
    sub: 'Code in your repo from day one',
  },
];

export const FOUNDER = {
  name: 'Adeel Baloch',
  role: 'Founder & Senior Software Engineer',
  portrait: FOUNDER_PORTRAIT,
};
