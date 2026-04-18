'use client'
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AnnouncementCard from './AnnouncementCard';
import { Pagination } from '@mui/material';
import Link from 'next/link';

// Map เดือนสำหรับจัด Format วันที่
const monthMap: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

// 📌 ฟังก์ชันจัด Format ข้อความ
const formatText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\\n/g, '<br />')
    .replace(/\\t/g, '<span class="ml-8 inline-block"></span>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

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
  const [filterState, setFilterState] = useState('All');

  const ITEMS_PER_PAGE = 10; 

  const transformDriveLink = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
      return `https://lh3.googleusercontent.com/d/${fileId}`; 
    }
    return url;
  };

  const formatDateString = (date: string | Date) => {
    if (!date) return '-';
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = monthMap[String(dateObj.getMonth() + 1).padStart(2, '0')];
    const year = dateObj.getFullYear();
    let hour = dateObj.getHours();
    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hour}:${minute} ${period}`;
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  const filteredAnnouncement = useMemo(() => {
    return announcementData.filter((announcement: any) => {
      const titleMatch = announcement.title.toLowerCase().includes(filterTitle.toLowerCase());
      const authorObj = announcement.author;
      const authorName = typeof authorObj === 'object' ? (authorObj?.name || '') : (authorObj || 'admin');
      const authorMatch = authorName.toLowerCase().includes(filterAuthor.toLowerCase());
      
      // 📌 แก้ไข Logic การกรองให้เช็คจาก Field 'isEdited' ที่เป็น Boolean
      let stateMatch = true;
      if (filterState === 'Edited') {
        stateMatch = announcement.isEdited === true;
      } else if (filterState === 'Not edited') {
        stateMatch = announcement.isEdited === false || announcement.isEdited === undefined;
      }
      
      return titleMatch && authorMatch && stateMatch;
    });
  }, [filterTitle, filterAuthor, filterState, announcementData]);

  const calculatedTotalPage = Math.ceil(filteredAnnouncement.length / ITEMS_PER_PAGE) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAnnouncement.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAnnouncement, currentPage]);

  const handleChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', value.toString());
    router.push(`${pathname}?${params}`);
  };

  return (
    <section className={`min-h-screen ${isDashboard ? 'bg-[#838383]' : 'bg-white'} flex flex-col pt-8 pb-16 px-8`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
        
        {/* --- Header Section --- */}
        <div className="w-full flex flex-col items-center mb-8 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${isDashboard ? 'text-white' : 'text-black'}`}>Clinic Announcement</h2>
          <div className="flex justify-center w-full mb-8">
            {isDashboard ? (
              <button onClick={() => router.push('/announcement/add')} className="bg-black text-white py-2 px-10 rounded-full text-lg font-medium hover:bg-gray-800 transition shadow-md active:scale-95">
                Add Announcement
              </button>
            ) : isAdmin && (
              <button onClick={() => router.push(`/announcement/manage`)} className="bg-black text-white text-xl font-bold py-3 px-12 rounded-full hover:bg-gray-800 transition active:scale-95 shadow-md">
                Manage Announcement
              </button>
            )}
          </div>
        </div>

        {/* --- Filter Bar (Dashboard) --- */}
        {isDashboard && (
          <div className="w-full flex flex-wrap justify-center items-center gap-x-6 gap-y-4 mb-10 text-white">
            <div className="flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">Title/ID :</span>
              <input type="text" className="bg-white border border-gray-300 rounded-full px-4 py-1 w-64 outline-none text-black focus:ring-2 focus:ring-blue-400" value={filterTitle} onChange={(e) => handleFilterChange(setFilterTitle, e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">Author :</span>
              <input type="text" className="bg-white border border-gray-300 rounded-full px-4 py-1 w-48 outline-none text-black focus:ring-2 focus:ring-blue-400" value={filterAuthor} onChange={(e) => handleFilterChange(setFilterAuthor, e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">State :</span>
              <select className="bg-white border border-gray-300 rounded-full px-4 py-1 w-48 text-black outline-none cursor-pointer focus:ring-2 focus:ring-blue-400" value={filterState} onChange={(e) => handleFilterChange(setFilterState, e.target.value)}>
                {/* 📌 เปลี่ยนค่า Option ใน Dropdown */}
                <option value="All">All</option>
                <option value="Edited">Edited</option>
                <option value="Not edited">Not edited</option>
              </select>
            </div>
          </div>
        )}

        {/* --- Search Bar (Guest) --- */}
        {!isDashboard && showSearch && (
          <div className="relative w-full max-w-[500px] mx-auto mb-10">
            <input type="text" placeholder="Search Announcement" className="w-full bg-white p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:border-blue-500 text-gray-800" value={filterTitle} onChange={(e) => handleFilterChange(setFilterTitle, e.target.value)} />
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
          </div>
        )}

        {/* --- Content Section --- */}
        {isDashboard ? (
          <div className="w-full border-t border-gray-400 bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-gray-700 text-lg border-b border-gray-400 bg-gray-100 font-sukhumvit">
                  <th className="py-4 font-normal text-center w-1/3">Title</th>
                  <th className="py-4 font-normal text-center">author</th>
                  <th className="py-4 font-normal text-center">State</th>
                  <th className="py-4 font-normal text-center">createdAt</th>
                  <th className="py-4 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item: any) => (
                  <tr key={item._id} onClick={() => router.push(`/announcement/${item._id}`)} className="border-b border-gray-200 hover:bg-blue-50 transition cursor-pointer group font-sukhumvit">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 flex-shrink-0 flex items-center justify-center border border-gray-300 overflow-hidden shadow-sm">
                          {item.logoURL ? <img src={transformDriveLink(item.logoURL)} alt="announcement" className="w-full h-full object-cover group-hover:scale-105 transition" referrerPolicy="no-referrer" /> : <span className="text-xs text-gray-400">No Image</span>}
                        </div>
                        <span 
                          className="text-[15px] font-medium leading-tight text-left group-hover:text-blue-600 transition line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: formatText(item.title) }}
                        />
                      </div>
                    </td>
                    <td className="text-center text-sm text-gray-600">{typeof item.author === 'object' ? item.author.name : (item.author || 'admin')}</td>
                    
                    {/* 📌 แก้ไขส่วนการแสดงผล State ในตารางให้อ่านค่าจาก isEdited (Boolean) */}
                    <td className="text-center text-sm text-gray-600">
                      {item.isEdited ? (
                        <span className="text-amber-600 font-medium">Edited</span>
                      ) : (
                        <span className="text-gray-500">Not edited</span>
                      )}
                    </td>
                    
                    <td className="text-center text-sm text-gray-600 font-medium">
                      {formatDateString(item.createdAt)}
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/announcement/edit/${item._id}`); }} className="bg-[#f2e266] text-black px-6 py-1 rounded-md text-sm font-medium hover:bg-yellow-400 transition active:scale-95 shadow-sm">Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); }} className="bg-[#f65a5a] text-white px-6 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition active:scale-95 shadow-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {paginatedData.map((announcement: any) => (
              <Link key={announcement._id} href={`/announcement/${announcement._id}`} className="w-full md:w-[45%] h-[180px] bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 overflow-hidden flex border border-gray-100 font-sukhumvit">
                <AnnouncementCard id={announcement._id} logoSrc={transformDriveLink(announcement.logoURL)} title={announcement.title} date={announcement.createdAt} />
              </Link>
            ))}
          </div>
        )}

        <div className={`flex justify-center mt-20 p-2 px-4 rounded-full ${isDashboard ? 'bg-white/90 backdrop-blur-sm shadow-md' : ''}`}>
          <Pagination count={calculatedTotalPage} color="primary" page={currentPage} onChange={handleChangePage} size="large" />
        </div>
      </div>
    </section>
  );
}