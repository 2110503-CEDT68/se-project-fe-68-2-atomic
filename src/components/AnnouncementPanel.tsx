  'use client'
  import { useState } from 'react';
  import { useRouter, useSearchParams, usePathname } from 'next/navigation';
  import AnnouncementCard from './AnnouncementCard';
  import { Pagination, Stack } from '@mui/material';
  import Link from 'next/link';

  export default function AnnouncementPanel({totalPage, currentPage, announcementData, isAdmin=false, showSearch=false}: {totalPage: number, currentPage: number, announcementData: AnnouncementItem[], isAdmin?: boolean, showSearch?: boolean}) {
    const router = useRouter()
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [searchTerm, setSearchTerm] = useState('')
    const filteredAnnouncement = announcementData.filter((announcement: any)=>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', value.toString())

      router.push(`${pathname}?${params}`)
    }

    return (
      <section className="pt-8 pb-16 px-8 bg-white mb-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8 text-left">
            <h2 className="text-4xl font-bold text-black mb-2">Clinic Announcement</h2>
          </div>

          {
            showSearch && (
            <input 
              type="text" 
              placeholder="🔍 Search announcement by title..." 
              className="mt-4 w-full md:w-1/2 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            )

          }

          {
            isAdmin && showSearch ?
            <div className="flex flex-row justify-center gap-4 my-5">
              <button
                onClick={() => router.push(`/announcement/add`)}
                className="cursor-pointer bg-black text-white text-xl font-bold py-2 px-8 mt-5 rounded-full hover:bg-gray-800 transition flex items-center gap-2 active:scale-95"
                >
                  Add Announcement
              </button>
            </div>
            : null
          }

          <div className="flex flex-wrap justify-evenly gap-8 mt-8">
                {
                  filteredAnnouncement.length === 0 ?
                  <p>No announcement found</p> 
                  :
                  filteredAnnouncement.map((announcement: AnnouncementItem) => (
                    <Link key={announcement._id} href={`/announcement/${announcement._id}`} className="w-[45%] h-[220px] rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden m-5 font-sukhumvit">
                      <AnnouncementCard key={announcement._id} id={announcement._id} logoSrc={announcement.logoURL} title={announcement.title} date={announcement.createdAt}/>
                    </Link>
                  ))
                }
          </div>

          <div className='flex justify-center mt-20'>
            <Pagination count={totalPage} color="primary" page={currentPage} onChange={handleChangePage}/>
          </div>
        </div>
      </section>
    );
  }