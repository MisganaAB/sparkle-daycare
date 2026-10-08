import { useState } from 'react';
import { useAllPrograms } from '../../hooks/usePrograms';
import {
  adminCreateProgram,
  adminUpdateProgram,
  adminDeleteProgram,
  adminCreateActivity,
  adminDeleteActivity,
} from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatDate(d) {
  return d
    ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
}

export default function ProgramsAdmin() {
  const { programs, loading, reload } = useAllPrograms();
  const [newWeek, setNewWeek] = useState({
    title: '',
    week_start: '',
    week_end: '',
    description: '',
    is_published: false,
  });
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newActivity, setNewActivity] = useState({ day: 'Monday', title: '', description: '' });
  const [addingTo, setAddingTo] = useState(null);

  const createProgram = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminCreateProgram(newWeek);
      toast.success('Program created!');
      setNewWeek({ title: '', week_start: '', week_end: '', description: '', is_published: false });
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create.');
    } finally {
      setCreating(false);
    }
  };

  const togglePublish = async (program) => {
    try {
      await adminUpdateProgram(program.id, { is_published: !program.is_published });
      toast.success(`Program ${program.is_published ? 'unpublished' : 'published'}.`);
      reload();
    } catch {
      toast.error('Failed to update.');
    }
  };

  const deleteProgram = async (id) => {
    if (!window.confirm('Delete this program and all its activities?')) return;
    try {
      await adminDeleteProgram(id);
      toast.success('Deleted.');
      reload();
    } catch {
      toast.error('Failed.');
    }
  };

  const addActivity = async (programId) => {
    if (!newActivity.title.trim()) return toast.error('Activity title is required.');
    try {
      await adminCreateActivity({ ...newActivity, weekly_program_id: programId, sort_order: 0 });
      toast.success('Activity added!');
      setNewActivity({ day: 'Monday', title: '', description: '' });
      setAddingTo(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    }
  };

  const deleteActivity = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await adminDeleteActivity(id);
      toast.success('Activity deleted.');
      reload();
    } catch {
      toast.error('Failed.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Weekly Programs</h1>

      {/* Create program form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Create New Week</h2>
        <form onSubmit={createProgram} className="space-y-4">
          <input
            type="text"
            required
            placeholder="e.g. Weekly Learning & Play Program"
            value={newWeek.title}
            onChange={(e) => setNewWeek((p) => ({ ...p, title: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Week Start</label>
              <input
                type="date"
                required
                value={newWeek.week_start}
                onChange={(e) => setNewWeek((p) => ({ ...p, week_start: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Week End</label>
              <input
                type="date"
                required
                value={newWeek.week_end}
                onChange={(e) => setNewWeek((p) => ({ ...p, week_end: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <textarea
            placeholder="Optional description…"
            value={newWeek.description}
            onChange={(e) => setNewWeek((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={newWeek.is_published}
                onChange={(e) => setNewWeek((p) => ({ ...p, is_published: e.target.checked }))}
              />
              Publish immediately
            </label>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create Week'}
            </button>
          </div>
        </form>
      </div>

      {/* Programs list */}
      {loading ? (
        <LoadingSpinner />
      ) : programs.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No programs yet. Create your first week above.</p>
      ) : (
        <div className="space-y-4">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-2xl border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-bold text-gray-900">{program.title}</h3>
                  <p className="text-sm text-gray-400">
                    {formatDate(program.week_start)} – {formatDate(program.week_end)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      program.is_published
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {program.is_published ? '✓ Published' : 'Draft'}
                  </span>
                  <button
                    onClick={() => togglePublish(program)}
                    className="text-xs px-3 py-1 border rounded-full hover:bg-gray-50"
                  >
                    {program.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => deleteProgram(program.id)}
                    className="text-xs px-3 py-1 border border-red-200 rounded-full text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === program.id ? null : program.id)}
                    className="text-xs px-3 py-1 border rounded-full hover:bg-gray-50"
                  >
                    {expandedId === program.id ? 'Hide' : 'Activities'}
                  </button>
                </div>
              </div>

              {/* Activities */}
              {expandedId === program.id && (
                <div className="border-t border-gray-100 p-5">
                  <div className="space-y-2 mb-4">
                    {(program.activities || []).length === 0 && (
                      <p className="text-sm text-gray-400 italic">No activities yet.</p>
                    )}
                    {(program.activities || []).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                      >
                        <div>
                          <span className="text-xs font-semibold text-gray-400 mr-2">{act.day}</span>
                          <span className="text-sm font-medium text-gray-800">{act.title}</span>
                          {act.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{act.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteActivity(act.id)}
                          className="text-xs px-2 py-1 text-red-400 hover:bg-red-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add activity */}
                  {addingTo === program.id ? (
                    <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
                      <select
                        value={newActivity.day}
                        onChange={(e) => setNewActivity((p) => ({ ...p, day: e.target.value }))}
                        className="w-full text-sm px-3 py-2 rounded-lg border"
                      >
                        {DAYS.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Activity title *"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity((p) => ({ ...p, title: e.target.value }))}
                        className="w-full text-sm px-3 py-2 rounded-lg border"
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity((p) => ({ ...p, description: e.target.value }))}
                        className="w-full text-sm px-3 py-2 rounded-lg border"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => addActivity(program.id)}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setAddingTo(null)}
                          className="px-4 py-2 bg-white border text-sm rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTo(program.id)}
                      className="text-sm text-emerald-600 font-semibold hover:underline"
                    >
                      + Add Activity
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
