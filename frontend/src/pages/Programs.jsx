import { useAllPrograms } from '../hooks/usePrograms';
import SectionHeader from '../components/SectionHeader';
import ProgramCard from '../components/ProgramCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatDateRange(start, end) {
  const opts = { month: 'long', day: 'numeric', year: 'numeric' };
  const startStr = new Date(start + 'T00:00:00').toLocaleDateString('en-US', opts);
  const endStr = new Date(end + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `${startStr} – ${endStr}`;
}

export default function Programs() {
  const { programs, loading, error } = useAllPrograms();

  const published = programs.filter((p) => p.is_published);

  return (
    <main className="pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Programs"
            title="Weekly Activities"
            subtitle="Our weekly program is updated regularly to keep learning fresh and engaging."
          />

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message="Failed to load programs." />}

          {!loading && !error && published.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No programs published yet. Check back soon!
            </p>
          )}

          <div className="space-y-16 max-w-4xl mx-auto">
            {published.map((program) => {
              const sorted = [...(program.activities || [])].sort(
                (a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
              );
              return (
                <article key={program.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{program.title}</h2>
                    <span className="text-sm text-gray-500">
                      {formatDateRange(program.week_start, program.week_end)}
                    </span>
                  </div>
                  {program.description && (
                    <p className="text-gray-600 mb-6">{program.description}</p>
                  )}
                  {sorted.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sorted.map((activity) => (
                        <ProgramCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No activities added yet.</p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
