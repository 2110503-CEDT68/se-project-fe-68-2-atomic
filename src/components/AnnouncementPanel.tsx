'use client'
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnnouncementCard from './AnnouncementCard';

export default function AnnouncementPanel({announcementJson, isAdmin=false, showSearch=false}: {announcementJson: AnnouncementJson, isAdmin?: boolean, showSearch?: boolean}) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const filteredAnnouncement = announcementJson.data.filter((announcement: any)=>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

        <div className="flex flex-wrap justify-evenly gap-8 mt-8">
              {
                filteredAnnouncement.length === 0 ?
                <p>No announcement found</p> 
                :
                filteredAnnouncement.map((announcement: AnnouncementItem) => (
                  <AnnouncementCard key={announcement._id} id={announcement._id} logoSrc={announcement.logoURL} title={announcement.title} date={announcement.createdAt}/>
                ))
              }
        </div>

        {
          isAdmin && showSearch ?
          <div className="flex flex-row justify-center gap-4">
            <button
              onClick={() => router.push(`/dentists/add`)}
              className="cursor-pointer bg-black text-white text-xl font-bold py-2 px-8 mt-5 rounded-full hover:bg-gray-800 transition flex items-center gap-2 active:scale-95"
              >
                Add Announcement
            </button>
          </div>
          : null
        }
      </div>
    </section>
  );
}