import { useState, useEffect, useRef } from 'react';
import { getSettings, adminUpdateSettings, adminUploadSettingsImage } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const FACILITY_CONFIG = [
  {
    id: 'playground',
    titleKey: 'playground_title',
    descKey: 'playground_description',
    imageKey: 'playground_image_url',
    defaultTitle: 'Playground',
    defaultDesc:
      'Our large, safe outdoor playground is equipped with age-appropriate climbing structures, swings, and open space for free play. Children develop motor skills, build confidence, and enjoy the fresh air.',
    icon: '🛝',
  },
  {
    id: 'learning_area',
    titleKey: 'learning_area_title',
    descKey: 'learning_area_description',
    imageKey: 'learning_area_image_url',
    defaultTitle: 'Learning Area',
    defaultDesc:
      'Our dedicated learning area is designed to stimulate curiosity. With books, puzzles, art supplies, and interactive materials, children explore concepts through hands-on discovery.',
    icon: '📚',
  },
  {
    id: 'classroom',
    titleKey: 'classroom_title',
    descKey: 'classroom_description',
    imageKey: 'classroom_image_url',
    defaultTitle: 'Classrooms',
    defaultDesc:
      'Bright, spacious classrooms with child-sized furniture create a welcoming space for structured activities, circle time, and creative projects.',
    icon: '🏫',
  },
  {
    id: 'outdoor',
    titleKey: 'outdoor_title',
    descKey: 'outdoor_description',
    imageKey: 'outdoor_image_url',
    defaultTitle: 'Outdoor Area',
    defaultDesc:
      'Beyond the playground, our outdoor area features a garden, shaded seating, and open fields — perfect for nature walks, outdoor learning, and group activities.',
    icon: '🌳',
  },
];

export default function FacilitiesAdmin() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const fileInputs = useRef({});

  useEffect(() => {
    getSettings()
      .then((data) => {
        setSettings(data || {});
        const initialForm = {};
        FACILITY_CONFIG.forEach((f) => {
          initialForm[f.titleKey] = data?.[f.titleKey] || f.defaultTitle;
          initialForm[f.descKey] = data?.[f.descKey] || f.defaultDesc;
        });
        setFormData(initialForm);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load facility settings.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveText = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminUpdateSettings(formData);
      setSettings(updated.data || updated);
      toast.success('Facility details updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save facility details.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = async (facility, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);
    fd.append('field', facility.imageKey);

    setUploadingField(facility.id);
    try {
      const res = await adminUploadSettingsImage(fd);
      setSettings((prev) => ({ ...prev, [facility.imageKey]: res.imageUrl }));
      toast.success(`${facility.defaultTitle} image updated!`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingField(null);
      if (fileInputs.current[facility.id]) {
        fileInputs.current[facility.id].value = '';
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facilities Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update photos, titles, and descriptions for the daycare environment sections.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveText}
          disabled={saving}
          className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {FACILITY_CONFIG.map((facility) => {
          const currentImg = settings?.[facility.imageKey];
          const isUploading = uploadingField === facility.id;

          return (
            <div
              key={facility.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{facility.icon}</span>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">{facility.defaultTitle}</h2>
                    <span className="text-xs text-gray-400">Environment Section</span>
                  </div>
                </div>

                {/* Photo container & upload */}
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-4 relative group">
                  {currentImg ? (
                    <img
                      src={currentImg}
                      alt={facility.defaultTitle}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                      <span className="text-4xl mb-2">{facility.icon}</span>
                      <p className="text-xs">No custom photo uploaded yet (using default styling).</p>
                    </div>
                  )}

                  {/* Upload overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputs.current[facility.id]?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 bg-white text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-100 shadow"
                    >
                      {isUploading ? 'Uploading…' : 'Change Photo'}
                    </button>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={(el) => (fileInputs.current[facility.id] = el)}
                  onChange={(e) => handleUploadImage(facility, e)}
                  className="hidden"
                />

                <div className="flex justify-between items-center mb-4">
                  <button
                    type="button"
                    onClick={() => fileInputs.current[facility.id]?.click()}
                    disabled={isUploading}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    {isUploading ? 'Uploading WebP…' : '📷 Upload New Photo'}
                  </button>
                  {currentImg && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      ✓ Active
                    </span>
                  )}
                </div>

                {/* Text fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={formData[facility.titleKey] || ''}
                      onChange={(e) => handleChange(facility.titleKey, e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData[facility.descKey] || ''}
                      onChange={(e) => handleChange(facility.descKey, e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
