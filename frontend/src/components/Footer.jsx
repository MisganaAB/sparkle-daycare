import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export default function Footer({ settings }) {
  const name = settings?.daycare_name || 'Sparkle Daycare';
  const phone = settings?.phone || '';
  const email = settings?.email || '';
  const address = settings?.address || '';

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="text-white font-bold text-xl mb-3 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                <BrandLogo className="h-8 w-8" />
              </span>
              {name}
            </div>
            <p className="text-sm leading-relaxed">{settings?.description || 'A safe, loving place where children learn, play, and grow.'}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/about', 'About Us'], ['/programs', 'Programs'], ['/gallery', 'Gallery'], ['/facilities', 'Facilities'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-emerald-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              {phone && <li>📞 {phone}</li>}
              {email && <li>📧 {email}</li>}
              {address && <li>📍 {address}</li>}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
