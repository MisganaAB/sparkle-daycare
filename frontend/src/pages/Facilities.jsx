import SectionHeader from '../components/SectionHeader';
import FacilityCard from '../components/FacilityCard';
import { useSettings } from '../hooks/useSettings';

const DEFAULT_FACILITIES = [
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
    id: 'learning-area',
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

export default function Facilities() {
  const { settings } = useSettings();

  return (
    <main className="pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Facilities"
            title="Our Environment"
            subtitle="We've created every space with children's safety, creativity, and development in mind."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {DEFAULT_FACILITIES.map((facility) => {
              const title = settings?.[facility.titleKey] || facility.defaultTitle;
              const description = settings?.[facility.descKey] || facility.defaultDesc;
              const image = settings?.[facility.imageKey];

              return (
                <FacilityCard
                  key={facility.id}
                  title={title}
                  description={description}
                  image={image}
                  icon={facility.icon}
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
