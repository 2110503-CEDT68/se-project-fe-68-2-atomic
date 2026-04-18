'use client'
import Link from 'next/link';
import FeaturedAnnouncementCard from './FeaturedAnnouncementCard';
import AnnouncementCard from './AnnouncementCard';

const transformDriveLink = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
    return `https://lh3.googleusercontent.com/d/${fileId}`; 
  }
  return url;
};

// 📌 กำหนด type ของ announcementData ให้ตรงกับของคุณ
export default function HomeAnnouncementSection({ announcementData }: { announcementData: any[] }) {
  const newest = announcementData.slice(0, 3);
  const [featured, ...rest] = newest;

  if (!featured) return null;

  return (
    <section className="pt-8 pb-16 px-8 bg-white mb-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold text-black mb-2">Clinic Announcement</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-[456px]">

          {/* Featured card */}
          <div className="flex-[1.2] h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <FeaturedAnnouncementCard
              id={featured._id}
              // ✨ ครอบแปลงลิงก์ตรงนี้
              logoSrc={transformDriveLink(featured.logoURL)}
              title={featured.title}
              date={featured.createdAt}
            />
          </div>

          {/* Side cards */}
          <div className="flex flex-col flex-1 gap-4">
            {rest.map((item) => (
              <div
                key={item._id}
                className="h-[220px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <AnnouncementCard
                  id={item._id}
                  // ✨ ครอบแปลงลิงก์ตรงนี้
                  logoSrc={transformDriveLink(item.logoURL)}
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