'use client'
import { useRouter } from 'next/navigation';
import FeaturedAnnouncementCard from './FeaturedAnnouncementCard';
import AnnouncementCard from './AnnouncementCard';
import Link from 'next/link';

export default function HomeAnnouncementSection({ announcementData }: { announcementData: AnnouncementItem[] }) {
  const router = useRouter();

  const newest = announcementData.slice(0, 3);
  const [featured, ...rest] = newest;

  if (!featured) return null;

  return (
    <section className="pt-8 pb-16 px-8 bg-white mb-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold text-black mb-2">Clinic Announcement</h2>
        </div>

        {/* Both columns locked to exactly 2× card height */}
        <div className="flex flex-col md:flex-row gap-6 h-[456px]">

          {/* ── Featured card — fills full column height ── */}
          <div className="flex-[1.2] h-full">
            <FeaturedAnnouncementCard
              id={featured._id}
              logoSrc={featured.logoURL}
              title={featured.title}
              date={featured.createdAt}
            />
          </div>

          {/* ── Side cards — each exactly h-[220px], gap fills the 16px ── */}
          <div className="flex flex-col flex-1 gap-4">
            {rest.map((item) => (
              <AnnouncementCard
                key={item._id}
                id={item._id}
                logoSrc={item.logoURL}
                title={item.title}
                date={item.createdAt}
                className="!w-full !h-[220px] m-0"
              />
            ))}
          </div>

        </div>

        <div className="flex justify-center mt-8">
            <Link
                href="/announcement"
                className="group inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-600 text-sm font-medium px-8 py-3 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-all duration-200"
            >
                View all announcements
                <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>

      </div>
    </section>
  );
}