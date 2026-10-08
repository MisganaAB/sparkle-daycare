import { useState, useEffect, useRef } from 'react';
import { getGallery, adminUploadImage, adminUpdateImage, adminDeleteImage } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['playground', 'learning_area', 'classroom', 'outdoor', 'activities', 'events', 'other'];

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    category: 'playground',
    title: '',
    description: '',
    is_featured: false,
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const cat = category === 'all' ? undefined : category;
      const res = await getGallery({ category: cat, page: 1, limit: 50 });
      setImages(res.data);
    } catch {
      toast.error('Failed to load images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [category]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) return toast.error('Please select an image.');

    const fd = new FormData();
    fd.append('image', file);
    fd.append('category', uploadForm.category);
    fd.append('title', uploadForm.title);
    fd.append('description', uploadForm.description);
    fd.append('is_featured', uploadForm.is_featured);

    setUploading(true);
    try {
      await adminUploadImage(fd);
      toast.success('Image uploaded!');
      setUploadForm({ category: 'playground', title: '', description: '', is_featured: false });
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    try {
      await adminDeleteImage(id);
      toast.success('Deleted.');
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const startEdit = (img) => {
    setEditingId(img.id);
    setEditForm({
      title: img.title || '',
      description: img.description || '',
      is_featured: img.is_featured,
      category: img.category,
    });
  };

  const saveEdit = async (id) => {
    try {
      const res = await adminUpdateImage(id, editForm);
      setImages((prev) => prev.map((i) => (i.id === id ? res.data : i)));
      setEditingId(null);
      toast.success('Saved.');
    } catch {
      toast.error('Save failed.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Gallery Management</h1>

      {/* Upload form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Upload New Photo</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Children playing outside"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={uploadForm.description}
              onChange={(e) => setUploadForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={uploadForm.is_featured}
              onChange={(e) => setUploadForm((p) => ({ ...p, is_featured: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Mark as featured
            </label>
          </div>

          {/* File picker */}
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Choose image file"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded-lg object-contain" />
            ) : (
              <div>
                <div className="text-4xl mb-2">📤</div>
                <p className="text-sm text-gray-500">
                  Click to choose an image (JPEG, PNG, WebP — max 10 MB)
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Uploading…' : 'Upload Photo'}
          </button>
        </form>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === c
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
            }`}
          >
            {c.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Images grid */}
      {loading ? (
        <LoadingSpinner />
      ) : images.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-square">
                <img
                  src={img.thumb_url || img.image_url}
                  alt={img.title || 'Photo'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                {editingId === img.id ? (
                  <div className="space-y-2">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full text-xs px-2 py-1.5 border rounded-lg"
                      placeholder="Title"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                      className="w-full text-xs px-2 py-1.5 border rounded-lg"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={editForm.is_featured}
                        onChange={(e) => setEditForm((p) => ({ ...p, is_featured: e.target.checked }))}
                      />
                      Featured
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => saveEdit(img.id)}
                        className="flex-1 text-xs py-1.5 bg-emerald-600 text-white rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 text-xs py-1.5 bg-gray-100 text-gray-700 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-gray-700 truncate">{img.title || '—'}</p>
                    <p className="text-xs text-gray-400 capitalize">{img.category.replace('_', ' ')}</p>
                    {img.is_featured && (
                      <span className="text-xs text-amber-600 font-medium">★ Featured</span>
                    )}
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => startEdit(img)}
                        className="flex-1 text-xs py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="flex-1 text-xs py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
