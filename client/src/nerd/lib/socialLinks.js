/**
 * BalochDev public social profiles — single source of truth for footer + blog.
 */

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMedium,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

/** @typedef {{ id: string, label: string, url: string, Icon: import('react').ComponentType<{ size?: number, 'aria-hidden'?: boolean }> }} SocialLink */

/** @type {SocialLink[]} */
export const BALOCHDEV_SOCIAL_LINKS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/balochdev/',
    Icon: FaLinkedinIn,
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    url: 'https://x.com/BalochDev404',
    Icon: FaXTwitter,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/balochdev_',
    Icon: FaInstagram,
  },
  {
    id: 'medium',
    label: 'Medium',
    url: 'https://medium.com/@balochdev',
    Icon: FaMedium,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/Balochdev/',
    Icon: FaFacebookF,
  },
];
