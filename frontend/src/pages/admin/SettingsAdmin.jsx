import { useState, useEffect, useRef } from 'react';
import { getSettings, adminUpdateSettings, adminUploadSettingsImage } from '../../services/api';
import toast from 'react-hot-toast';

export default function SettingsAdmin() {
  const [form, setForm] = useState({
    daycare_name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [heroPreview, setHeroPreview] = useState(null);
  const heroRef = useRef();

  useEffect(() => {
    getSettings()
      .then((s) => {
        if (s) {
          setForm({
            daycare_name: s.daycare_name || '',
            phone: s.phone || '',
            email: s.email || '',
            address: s.address || '',
            description: s.description || '',
          });
          if (s.hero_image_url) setHeroPreview(s.hero_image_url);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateSettings(form);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    fd.append('field', 'hero_image_url');
    try {
      const res = await adminUploadSettingsImage(fd);
      setHeroPreview(res.imageUrl);
      toast.success('Hero image updated!');
    } catch {
      toast.error('Upload failed.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* Hero image */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Hero Image</h2>
        {heroPreview && (
          <img
            src={heroPreview}
            alt="Hero"
            className="w-full max-h-48 object-cover rounded-xl mb-4"
          />
        )}
        <input
          type="file"
          ref={heroRef}
          className="hidden"
          accept="image/*"
          onChange={handleHeroUpload}
        />
        <button
          onClick={() => heroRef.current?.click()}
          className="px-5 py-2.5 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50"
        >
          Change Hero Image
        </button>
      </div>

      {/* Daycare info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Daycare Information</h2>
        <form onSubmit={handleSave} className="space-y-4">
          {[
            { name: 'daycare_name', label: 'Daycare Name', placeholder: 'Sparkle Daycare' },
            { name: 'phone', label: 'Phone', placeholder: '0911...' },
            { name: 'email', label: 'Email', placeholder: 'info@sparkledaycare.com' },
            { name: 'address', label: 'Address', placeholder: 'Addis Ababa, Ethiopia' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={form[name]}
                onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={placeholder}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="A safe, loving place where children learn, play, and grow."
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
