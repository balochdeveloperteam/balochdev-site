import { Link } from 'react-router-dom';

/** Small CTA below blog post content — always visible, links to /advertise. */
export default function BlogAdvertiseCta() {
  return (
    <p className="ndx-blog-advertise-cta">
      Want to advertise here?{' '}
      <Link to="/advertise">See our ad placements</Link>
      {' · '}
      <a href="mailto:team@balochdev.com">team@balochdev.com</a>
    </p>
  );
}
