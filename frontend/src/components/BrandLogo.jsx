import sparkleLogo from '../assets/sparkle-preview.webp';

export default function BrandLogo({ className = '' }) {
  return (
    <img
      src={sparkleLogo}
      alt="Sparkle Daycare"
      className={`object-contain ${className}`}
    />
  );
}
