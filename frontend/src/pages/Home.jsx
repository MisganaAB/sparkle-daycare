import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { useCurrentProgram } from "../hooks/usePrograms";
import { useGallery } from "../hooks/useGallery";
import SectionHeader from "../components/SectionHeader";
import ProgramCard from "../components/ProgramCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const { settings, loading: settingsLoading } = useSettings();
  const { program, loading: programLoading } = useCurrentProgram();
  const { images: featuredImages, loading: galleryLoading } = useGallery({
    limit: 6,
  });

  const heroImage = settings?.hero_image_url;

  return (
    <main>
      {/* Hero */}
      <section className="relative isolate flex min-h-screen min-h-[min(100dvh,52rem)] items-center overflow-hidden bg-emerald-50 md:min-h-[100dvh]">
        {heroImage && (
          <div className="pointer-events-none absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Happy children at Sparkle Daycare"
              className="h-full w-full object-cover object-center"
              fetchPriority="high"
              loading="eager"
            />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,#ecfdf5_0%,rgba(236,253,245,0.97)_12%,rgba(236,253,245,0.84)_28%,rgba(236,253,245,0.58)_42%,rgba(236,253,245,0.24)_54%,transparent_64%,transparent_100%)]" />
        <div className="container relative z-20 mx-auto px-4 pt-24 pb-8 sm:py-20 md:py-0">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full mb-6">
              Welcome to {settings?.daycare_name || "Sparkle Daycare"}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              A place where every child{" "}
              <span className="text-emerald-600">shines, learn, play</span> and
              grow.
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {settings?.description ||
                "We provide a safe, nurturing environment where every child is encouraged to explore, discover, and thrive."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/contact"
                className="flex min-h-14 flex-1 items-center justify-center rounded-full bg-emerald-600 px-4 py-3.5 text-center font-semibold text-white transition-colors hover:bg-emerald-700 sm:px-8"
              >
                Contact Us
              </Link>
              <Link
                to="/programs"
                className="flex min-h-14 flex-1 items-center justify-center rounded-full border-2 border-emerald-600 px-4 py-3.5 text-center font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 sm:px-8"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader label="About Us" title="More than a daycare" />
            <p className="text-gray-600 leading-relaxed text-lg">
              At Sparkle Daycare, we believe every child deserves a warm,
              stimulating environment. Our dedicated team creates enriching
              experiences that prepare children for lifelong learning and
              success.
            </p>
            <Link
              to="/about"
              className="inline-block mt-6 text-emerald-600 font-semibold hover:underline"
            >
              Learn more about us →
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader label="Why Us" title="What makes us special" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: "🌱",
                title: "Learn",
                desc: "Age-appropriate curriculum designed to spark curiosity and develop essential skills.",
              },
              {
                icon: "⚽",
                title: "Play",
                desc: "Safe outdoor spaces and guided activities to promote physical development and teamwork.",
              },
              {
                icon: "💛",
                title: "Grow",
                desc: "A nurturing community where children build confidence, creativity, and friendships.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100"
              >
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current week program */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="This Week"
            title={program ? program.title : "Weekly Program"}
            subtitle={program?.description}
          />
          {programLoading ? (
            <LoadingSpinner />
          ) : program?.activities?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[...program.activities]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((activity) => (
                  <ProgramCard key={activity.id} activity={activity} />
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No program published for this week yet. Check back soon!
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              to="/programs"
              className="text-emerald-600 font-semibold hover:underline"
            >
              View all programs →
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Facilities"
            title="Our environment"
            subtitle="Built for curious minds and active bodies."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: "🛝",
                label: "Playground",
                imageKey: "playground_image_url",
                to: "/facilities",
              },
              {
                icon: "📚",
                label: "Learning Area",
                imageKey: "learning_area_image_url",
                to: "/facilities",
              },
              {
                icon: "🏫",
                label: "Classrooms",
                imageKey: "classroom_image_url",
                to: "/facilities",
              },
              {
                icon: "🌳",
                label: "Outdoor Area",
                imageKey: "outdoor_image_url",
                to: "/facilities",
              },
            ].map(({ icon, label, imageKey, to }) => (
              <Link
                key={label}
                to={to}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white text-center shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-50">
                  {settingsLoading ? (
                    <div
                      className="flex h-full items-center justify-center text-4xl"
                      aria-hidden="true"
                    >
                      {icon}
                    </div>
                  ) : settings?.[imageKey] ? (
                    <img
                      src={settings[imageKey]}
                      alt={`${label} at Sparkle Daycare`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <p className="px-3 py-3 font-semibold text-sm text-gray-700">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      {!galleryLoading && featuredImages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <SectionHeader
              label="Gallery"
              title="Recent photos"
              subtitle="A glimpse into everyday life at Sparkle Daycare."
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featuredImages.map((img) => (
                <div
                  key={img.id}
                  className="aspect-square rounded-2xl overflow-hidden"
                >
                  <img
                    src={img.thumb_url || img.image_url}
                    alt={img.title || "Daycare photo"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/gallery"
                className="px-6 py-3 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 transition-colors"
              >
                View Full Gallery →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Come visit us today
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            We'd love to meet you and your little one. Schedule a visit or send
            us a message.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white text-emerald-700 font-bold rounded-full hover:bg-emerald-50 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              className="px-8 py-3.5 border-2 border-white text-white font-bold rounded-full hover:bg-emerald-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
