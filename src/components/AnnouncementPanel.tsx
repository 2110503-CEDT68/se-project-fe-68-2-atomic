'use client'
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AnnouncementCard from './AnnouncementCard';
import { Pagination } from '@mui/material';

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
    <section className={`!w-full !min-h-screen flex flex-col pt-12 pb-20 px-4 sm:px-8 font-sukhumvit ${
      isDashboard 
        ? '!bg-slate-50 !bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]' 
        : '!bg-white !bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]'
    }`}>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
        
        {/* --- Header Section --- */}
        <div className="w-full flex flex-col items-center mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
            {isDashboard ? 'Manage Announcements' : 'Clinic Announcements'}
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-2xl font-medium">
            {isDashboard 
              ? 'Organize and update the information shared with your patients.' 
              : 'Stay up to date with the latest news and information from our clinic.'}
          </p>
          
          <div className="flex justify-center w-full">
            {isDashboard ? (
              <button 
                onClick={() => router.push('/announcement/add')} 
                className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                Add Announcement
              </button>
            ) : isAdmin && (
              <button 
                onClick={() => router.push(`/announcement/manage`)} 
                className="bg-slate-900 text-white text-lg font-bold py-3 px-10 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Manage
              </button>
            )}
          </div>
        </div>

        {/* --- Filter Bar (Dashboard) --- */}
        {isDashboard && (
          <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4 mb-10">
            <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Search Title/ID</label>
                <input 
                  type="text" 
                  placeholder="Enter keywords..."
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-64 outline-none text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  value={filterTitle} 
                  onChange={(e) => handleFilterChange(setFilterTitle, e.target.value)} 
                />
              </div>
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Author</label>
                <input 
                  type="text" 
                  placeholder="Admin name..."
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-48 outline-none text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  value={filterAuthor} 
                  onChange={(e) => handleFilterChange(setFilterAuthor, e.target.value)} 
                />
              </div>
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Status</label>
                <select 
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-48 text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  value={filterState} 
                  onChange={(e) => handleFilterChange(setFilterState, e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Edited">Edited Only</option>
                  <option value="Not edited">Original Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* --- Search Bar (Guest) --- */}
        {!isDashboard && showSearch && (
          <div className="relative w-full max-w-xl mx-auto mb-12">
            <input 
              type="text" 
              placeholder="Search announcements by title..." 
              className="w-full bg-white p-4 pl-12 border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-lg transition-all" 
              value={filterTitle} 
              onChange={(e) => handleFilterChange(setFilterTitle, e.target.value)} 
            />
            <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        )}

        {/* --- Content Section --- */}
        {isDashboard ? (
          <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-2/5">Announcement</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Author</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Date Created</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((item: any) => (
                  <tr key={item._id} onClick={() => router.push(`/announcement/${item._id}`)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white flex-shrink-0 flex items-center justify-center border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          {item.logoURL ? <img src={transformDriveLink(item.logoURL)} alt="announcement" className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer" /> : <span className="text-[10px] text-slate-400 font-medium uppercase">No Img</span>}
                        </div>
                        <span 
                          className="text-base font-semibold leading-snug text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: formatText(item.title) }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-medium text-slate-600">
                      {typeof item.author === 'object' ? item.author.name : (item.author || 'admin')}
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      {item.isEdited ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          Edited
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          Original
                        </span>
                      )}
                    </td>
                    
                    <td className="py-4 px-6 text-center text-sm text-slate-600 font-medium">
                      {formatDateString(item.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={(e) => { e.stopPropagation(); router.push(`/announcement/edit/${item._id}`); }} 
                          className="bg-white border border-slate-300 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 shadow-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); }} 
                          className="bg-red-50 border border-red-100 text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium text-lg">No announcements found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {paginatedData.map((announcement: any) => (
              // 📌 เปลี่ยนจาก <Link> เป็น <div> ธรรมดา เพื่อปลดล็อกให้คลิกได้แค่ปุ่ม Read more
              <div 
                key={announcement._id} 
                className="w-full h-[180px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex border border-slate-200 group"
              >
                <AnnouncementCard 
                  id={announcement._id} 
                  logoSrc={transformDriveLink(announcement.logoURL)} 
                  title={announcement.title} 
                  date={announcement.createdAt} 
                  isEdited={announcement.isEdited} 
                  className="group-hover:bg-slate-50/50 transition-colors"
                />
              </div>
            ))}
            {paginatedData.length === 0 && (
              <div className="col-span-1 lg:col-span-2 py-12 text-center text-slate-500 font-medium text-lg">
                No announcements found.
              </div>
            )}
          </div>
        )}

        {/* --- Pagination --- */}
        {calculatedTotalPage > 1 && (
          <div className="flex justify-center mt-12 p-2 px-6 rounded-full bg-white border border-slate-200 shadow-sm">
            <Pagination 
              count={calculatedTotalPage} 
              color="primary" 
              page={currentPage} 
              onChange={handleChangePage} 
              size="large" 
              sx={{ '& .MuiPaginationItem-root': { fontWeight: 'bold' } }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * const transformDriveLink = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
      return `https://lh3.googleusercontent.com/d/${fileId}`; 
    }
    return url;
  };
 */