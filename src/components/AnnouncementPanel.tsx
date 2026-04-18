'use client'
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AnnouncementCard from './AnnouncementCard';
import { Pagination, CircularProgress } from '@mui/material';
import Link from 'next/link';

const transformDriveLink = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
    return `https://lh3.googleusercontent.com/d/${fileId}`; 
  }
  return url;
};

const monthMap: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

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
  isDashboard = false,
  token
}: {
  totalPage: number,
  currentPage: number,
  announcementData: any[],
  isAdmin?: boolean,
  showSearch?: boolean,
  isDashboard?: boolean,
  token?: string
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [filterTitle, setFilterTitle] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterState, setFilterState] = useState('All');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10; 

  const formatDateString = (date: string | Date) => {
    if (!date) return '-';
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = monthMap[String(dateObj.getMonth() + 1).padStart(2, '0')];
    const year = dateObj.getFullYear();
    let hour = dateObj.getHours();
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12; else if (hour > 12) hour -= 12;
    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hour}:${minute} ${period}`;
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  const handleDelete = async (id: string, title: string) => {
    const cleanTitle = title.replace(/\\n/g, ' ');
    if (!window.confirm(`Are you sure you want to delete "${cleanTitle}"?`)) return;
    
    setIsDeleting(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting");
    } finally {
      setIsDeleting(null);
    }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className={`!w-full !min-h-screen flex flex-col pt-12 pb-20 px-4 sm:px-8 font-sukhumvit ${
      isDashboard 
        ? '!bg-slate-50 !bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]' 
        : '!bg-white !bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]'
    }`}>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
        
        {/* --- Header Section --- */}
        <div className="w-full flex flex-col items-center mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
            {isDashboard ? 'Manage Announcements' : 'Clinic Announcements'}
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-2xl font-medium">
            {isDashboard 
              ? `Current total: ${filteredAnnouncement.length} announcements` 
              : 'Stay up to date with the latest news from our clinic.'}
          </p>
          
          {/* ✅ ปรับใหม่: เช็คเงื่อนไขก่อนแสดงผล ถ้าไม่มีสิทธิ์ปุ่มก้อนนี้จะไม่กินที่เลย */}
          {(isDashboard || (isAdmin && !isDashboard)) && (
            <div className="flex justify-center w-full">
              {isDashboard ? (
                <button 
                  onClick={() => router.push('/announcement/add')} 
                  className="bg-blue-600 text-white py-4 px-10 rounded-full text-lg font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  Create New Announcement
                </button>
              ) : (
                <button 
                  onClick={() => router.push(`/announcement/manage`)} 
                  className="bg-slate-900 text-white text-lg font-bold py-3 px-10 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg flex items-center gap-2"
                >
                  Manage Dashboard
                </button>
              )}
            </div>
          )}
        </div>

        {/* --- Filter Bar (Dashboard) --- */}
        {isDashboard && (
          <div className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-wrap items-end gap-6 mb-12">
              <div className="flex flex-col flex-1 min-w-[200px]">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Search Title / ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter keywords..."
                    className="bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold w-full" 
                    value={filterTitle} 
                    onChange={(e) => handleFilterChange(setFilterTitle, e.target.value)} 
                  />
                </div>
              </div>
              <div className="flex flex-col w-full sm:w-56">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Author</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Admin name..."
                    className="bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold w-full" 
                    value={filterAuthor} 
                    onChange={(e) => handleFilterChange(setFilterAuthor, e.target.value)} 
                  />
                </div>
              </div>
              <div className="flex flex-col w-full sm:w-48">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                <div className="relative">
                  <select 
                    className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all font-bold w-full appearance-none" 
                    value={filterState} 
                    onChange={(e) => handleFilterChange(setFilterState, e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Edited">Edited Only</option>
                    <option value="Not edited">Original Only</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
          </div>
        )}

        {/* --- Search Bar (Guest) --- */}
        {!isDashboard && showSearch && (
          <div className="relative w-full max-w-xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
               <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search announcements by title..." 
              className="w-full bg-white py-4 pl-16 pr-6 border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-lg transition-all font-bold placeholder:font-medium placeholder:text-slate-400" 
              value={filterTitle} 
              onChange={(e) => handleFilterChange(setFilterTitle, e.target.value)} 
            />
          </div>
        )}

        {/* --- Content Section --- */}
        {isDashboard ? (
          <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-left">
                    <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest w-2/5">Announcement</th>
                    <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Author</th>
                    <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Date Created</th>
                    <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((item: any) => (
                    <tr key={item._id} onClick={() => router.push(`/announcement/${item._id}`)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white flex-shrink-0 flex items-center justify-center border border-slate-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                            {item.logoURL ? (
                              <img src={transformDriveLink(item.logoURL)} alt="announcement" className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium uppercase">No Img</span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-lg font-bold leading-snug text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1" dangerouslySetInnerHTML={{ __html: item.title.replace(/\\n/g, ' ') }} />
                            <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">ID: {item._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center text-sm font-bold text-slate-600">
                        {typeof item.author === 'object' ? item.author.name : (item.author || 'admin')}
                      </td>
                      <td className="py-5 px-6 text-center">
                        {item.isEdited ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wider">
                            Edited
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-slate-50 text-slate-400 border border-slate-200 uppercase tracking-wider">
                            Original
                          </span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-center text-sm text-slate-500 font-medium">
                        {formatDateString(item.createdAt)}
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex gap-2 justify-center">
                          <button 
                            title="Edit Announcement"
                            onClick={(e) => { e.stopPropagation(); router.push(`/announcement/edit/${item._id}`); }} 
                            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button 
                            title="Delete Announcement"
                            onClick={(e) => { e.stopPropagation(); handleDelete(item._id, item.title); }} 
                            disabled={isDeleting === item._id}
                            className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                          >
                            {isDeleting === item._id ? <CircularProgress size={20} color="inherit" /> : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Empty State */}
              {paginatedData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-50/50">
                  <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-xl font-bold text-slate-500">No announcements found</p>
                  <p className="text-sm mt-2 font-medium">Try adjusting your search keywords or filters.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {paginatedData.map((announcement: any) => (
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
                />
              </div>
            ))}
            {paginatedData.length === 0 && (
              <div className="col-span-1 lg:col-span-2 py-24 flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  <p className="text-xl font-bold text-slate-500">No announcements yet</p>
                  <p className="text-sm mt-2 font-medium">Check back later for updates from our clinic.</p>
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