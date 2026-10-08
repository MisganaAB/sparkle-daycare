import SectionHeader from '../components/SectionHeader';

export default function About() {
  return (
    <main className="pt-16">
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader label="About Us" title="About Sparkle Daycare" />

          <p className="text-gray-600 text-lg leading-relaxed mb-10 text-center">
            Sparkle Daycare was founded with a simple but powerful belief: every child deserves a
            safe, loving, and stimulating environment where they can flourish.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To nurture each child's unique potential through play-based learning, creativity,
                and compassionate care in a safe and inclusive environment.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600">
                To be a center of excellence in early childhood education, where every child begins
                their lifelong learning journey with joy and confidence.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-8 mb-12">
            <h3 className="font-bold text-xl text-gray-900 mb-4">🎓 Our Learning Philosophy</h3>
            <p className="text-gray-700 leading-relaxed">
              We follow a play-based learning approach that recognizes children as natural explorers
              and learners. Our curriculum integrates arts, movement, storytelling, and hands-on
              discovery to support the whole child — social, emotional, physical, and cognitive
              development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🏡', title: 'Safe Environment', desc: 'Secure, child-proofed spaces designed for safe exploration.' },
              { icon: '👩‍🏫', title: 'Qualified Staff', desc: 'Experienced educators passionate about early childhood.' },
              { icon: '🌈', title: 'Inclusive Care', desc: "We celebrate every child's individuality and unique strengths." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
