'use client'
import Link from 'next/link';
import FeaturedAnnouncementCard from './AnnouncementHomeCard';
import AnnouncementCard from './AnnouncementCard';

export default function HomeAnnouncementSection({ announcementData }: { announcementData: AnnouncementItem[] }) {
  const newest = announcementData.slice(0, 3);
  const [featured, ...rest] = newest;

  if (!featured) return (
    <section className="pt-8 pb-16 px-8 bg-white mb-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold text-black mb-2">Announcements</h2>
        </div>
        <div className="flex justify-center items-center py-16">
          <p className="text-gray-400 text-base">No new announcements at this time.</p>
        </div>
      </div>
    </section>
  );

  return (
    <section className="pt-8 pb-16 px-8 bg-white mb-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold text-black mb-2">Announcements</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-[456px]">

          {/* Featured card */}
          <Link
            href={`/announcement/${featured._id}`}
            className="flex-[1.2] h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <FeaturedAnnouncementCard
              id={featured._id}
              logoSrc={featured.logoURL}
              title={featured.title}
              date={featured.createdAt}
            />
          </Link>

          {/* Side cards */}
          <div className="flex flex-col flex-1 gap-4 h-full">
            {rest.length === 0 ? (
              <>
              <div className="h-[220px] rounded-xl bg-white shadow-sm flex items-center justify-center">
                <p className="text-gray-400 text-base">No announcements found.</p>
              </div>
              <div className="h-[220px] rounded-xl bg-white shadow-sm flex items-center justify-center">
                <p className="text-gray-400 text-base">No announcements found.</p>
              </div>
            </>
              
            ) : rest.length === 1 ? (
              <>
                <Link
                  href={`/announcement/${rest[0]._id}`}
                  className="h-[220px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <AnnouncementCard
                    id={rest[0]._id}
                    logoSrc={rest[0].logoURL}
                    title={rest[0].title}
                    date={rest[0].createdAt}
                    className="!w-full !h-full m-0 shadow-none hover:shadow-none"
                  />
                </Link>
                <div className="flex-1 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <p className="text-gray-400 text-base">No announcements found.</p>
                </div>
              </>
            ) : (
              rest.map((item) => (
                <Link
                  key={item._id}
                  href={`/announcement/${item._id}`}
                  className="h-[220px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <AnnouncementCard
                    id={item._id}
                    logoSrc={item.logoURL}
                    title={item.title}
                    date={item.createdAt}
                    className="!w-full !h-full m-0 shadow-none hover:shadow-none"
                  />
                </Link>
              ))
            )}
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