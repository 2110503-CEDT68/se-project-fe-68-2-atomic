'use client'
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AnnouncementCard from './AnnouncementCard';
import { Pagination } from '@mui/material';
import Link from 'next/link';

export default function AnnouncementPanel({
  totalPage,
  currentPage,
  announcementData = [],
  isAdmin = false,
  showSearch = false,
  isDashboard = false
}: {
  totalPage: number,
  currentPage: number,
  announcementData: any[],
  isAdmin?: boolean,
  showSearch?: boolean,
  isDashboard?: boolean
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [filterTitle, setFilterTitle] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterState, setFilterState] = useState('Edited/NotEdited');

  // ฟังก์ชันช่วยแปลงลิงก์ Google Drive ให้เป็น Direct Link
  const transformDriveLink = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      // ดึง File ID ออกจาก URL
      const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
      return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
    }
    return url;
  };

  const filteredAnnouncement = useMemo(() => {
    return announcementData.filter((announcement: any) => {
      const titleMatch = announcement.title.toLowerCase().includes(filterTitle.toLowerCase());
      const authorObj = announcement.author;
      const authorName = typeof authorObj === 'object' ? (authorObj?.name || '') : (authorObj || 'admin');
      const authorMatch = authorName.toLowerCase().includes(filterAuthor.toLowerCase());
      const stateValue = announcement.state || 'Not edited';
      const stateMatch = filterState === 'Edited/NotEdited' || stateValue === filterState;
      return titleMatch && authorMatch && stateMatch;
    });
  }, [filterTitle, filterAuthor, filterState, announcementData]);

  const handleChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', value.toString());
    router.push(`${pathname}?${params}`);
  };

  return (
    <section className="pt-8 pb-16 px-8 bg-white mb-6 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* --- 1. Header Section --- */}
        <div className="w-full flex flex-col items-center mb-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Clinic Announcement</h2>
          <div className="flex justify-center w-full mb-8">
            {isDashboard ? (
              <button onClick={() => router.push('/announcement/add')} className="bg-black text-white py-2 px-10 rounded-full text-lg font-medium hover:bg-gray-800 transition shadow-md">
                Add Announcement
              </button>
            ) : isAdmin && (
              <button onClick={() => router.push(`/announcement/manage`)} className="bg-black text-white text-xl font-bold py-3 px-12 rounded-full hover:bg-gray-800 transition active:scale-95 shadow-md">
                Manage Announcement
              </button>
            )}
          </div>
        </div>

        {/* --- 2. Filter Bar --- */}
        {isDashboard && (
          <div className="w-full flex flex-wrap justify-center items-center gap-x-6 gap-y-4 mb-10 text-black">
            <div className="flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">Title/ID :</span>
              <input type="text" className="border border-black rounded-full px-4 py-1 w-64 outline-none" value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">Author :</span>
              <input type="text" className="border border-black rounded-full px-4 py-1 w-48 outline-none" value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">State :</span>
              <select className="border border-black rounded-full px-4 py-1 w-48 bg-white outline-none" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
                <option value="Edited/NotEdited">Edited/NotEdited</option>
                <option value="Edited">Edited</option>
                <option value="Not edited">Not edited</option>
              </select>
            </div>
            <button className="bg-[#4da1ff] text-white px-10 py-1 rounded-lg font-medium hover:bg-blue-500 transition">Search</button>
          </div>
        )}

        {!isDashboard && showSearch && (
          <div className="relative w-full max-w-[500px] mx-auto mb-10">
            <input type="text" placeholder="Search Announcement" className="w-full p-2 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:border-blue-500 text-gray-600" value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} />
            <span className="absolute left-4 top-2 text-gray-400">🔍</span>
          </div>
        )}

        {/* --- 3. Content Section --- */}
        {isDashboard ? (
          <div className="w-full border-t border-gray-400">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-gray-700 text-lg border-b border-gray-400">
                  <th className="py-4 font-normal text-center w-1/3">Title</th>
                  <th className="py-4 font-normal text-center">author</th>
                  <th className="py-4 font-normal text-center">State</th>
                  <th className="py-4 font-normal text-center">createdAt</th>
                  <th className="py-4 font-normal"></th>
                </tr>
              </thead>
              <tbody>
  {filteredAnnouncement.map((item: any) => (
    <tr 
      key={item._id} 
      // เพิ่ม onClick ที่บรรทัดนี้ เพื่อให้คลิกได้ทั้งแถว
      onClick={() => router.push(`/announcement/${item._id}`)}
      className="border-b border-gray-300 hover:bg-blue-50 transition cursor-pointer group"
    >
      <td className="py-6 px-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 flex-shrink-0 flex items-center justify-center border border-gray-300 overflow-hidden shadow-sm">
            {item.logoURL ? (
              <img 
                src={transformDriveLink(item.logoURL)} 
                alt="announcement" 
                className="w-full h-full object-cover group-hover:scale-105 transition"
                referrerPolicy="no-referrer"
              />
            ) : <span className="text-xs text-gray-400">No Image</span>}
          </div>
          <span className="text-[15px] font-medium leading-tight text-left group-hover:text-blue-600 transition">
            {item.title}
          </span>
        </div>
      </td>
      <td className="text-center text-sm text-gray-600">
        {typeof item.author === 'object' ? item.author.name : (item.author || 'admin')}
      </td>
      <td className="text-center text-sm text-gray-600">{item.state || 'Not edited'}</td>
      <td className="text-center text-sm text-gray-600">
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '-'}
      </td>
      <td className="py-6 px-4">
        <div className="flex gap-2 justify-end">
          {/* ใช้ e.stopPropagation() เพื่อไม่ให้คลิกปุ่มแล้วกลายเป็นการเปิดหน้า Link */}
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              router.push(`/announcement/edit/${item._id}`);
            }} 
            className="bg-[#f2e266] text-black px-6 py-1 rounded-md text-sm font-medium hover:bg-yellow-400 transition"
          >
            Edit
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="bg-[#f65a5a] text-white px-6 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {filteredAnnouncement.map((announcement: any) => (
              <Link key={announcement._id} href={`/announcement/${announcement._id}`} className="w-full md:w-[45%] h-auto rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 font-sukhumvit">
                <AnnouncementCard id={announcement._id} logoSrc={transformDriveLink(announcement.logoURL)} title={announcement.title} date={announcement.createdAt} />
              </Link>
            ))}
          </div>
        )}

        <div className='flex justify-center mt-20'>
          <Pagination count={totalPage} color="primary" page={currentPage} onChange={handleChangePage} size="large" />
        </div>
      </div>
    </section>
  );
}