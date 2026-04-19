'use client'
import Link from 'next/link';
import FeaturedAnnouncementCard from './AnnouncementHomeCard';
import AnnouncementCard from './AnnouncementCard';


export default function HomeAnnouncementSection({ announcementData }: { announcementData: AnnouncementItem[] }) {
  const newest = announcementData.slice(0, 3);
  const [featured, ...rest] = newest;

  if (!featured) return null;

  return (
    <section className="pt-8 pb-16 px-8 bg-white mb-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold text-black mb-2">Announcements</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[456px]">

          {/* Featured card */}
          <div
            className="flex-[1.2] h-auto md:h-full min-h-[360px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
          >
            <FeaturedAnnouncementCard
              id={featured._id}
              logoSrc={featured.logoURL}
              title={featured.title}
              date={featured.createdAt}
            />
          </div>

          {/* Side cards */}
          <div className="flex flex-col flex-1 gap-4">
            {rest.map((item) => (
              <div
                key={item._id}
                className="h-auto md:h-[220px] min-h-[220px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
              >
                <AnnouncementCard
                  id={item._id}
                  logoSrc={item.logoURL}
                  title={item.title}
                  date={item.createdAt}
                  className="!w-full !h-full m-0 shadow-none hover:shadow-none"
                />
              </div>
            ))}
          </div>

        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/announcement"
            className="cursor-pointer bg-black text-white text-xl font-bold py-2 px-8 mt-5 rounded-full hover:bg-gray-800 transition flex items-center gap-2 active:scale-95"
          >
            View all announcements

          </Link>
        </div>

      </div>
    </section>
  );
}