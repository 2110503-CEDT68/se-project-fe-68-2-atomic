import Loading from "@/components/Loading";
import AnnouncementPanel from "@/components/AnnouncementPanel";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getAnnouncements from "@/libs/getAnnoucements";

// import getAnnouncements from "@/libs/getAnnouncements";

export default async function AnnouncementPage({searchParams} : {searchParams: Promise<{ page?: string }>}){

  const { page } = await searchParams;

  let currentPage = await Number(page) || 1;
  currentPage = currentPage < 0 ? 1 : currentPage;
  
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'admin'

  // fetch รอบแรกได้ total กับข้อมูล ที่มี or ไม่มี
  let announcements: AnnouncementJson = await getAnnouncements(currentPage);

  const totalPage = Math.ceil(announcements.pagination.total / 10.0)

  // ถ้า out of range
  if (currentPage > totalPage) {
    currentPage = 1
    announcements = await getAnnouncements(currentPage);
  }

  const sortedAnnouncement = announcements.data.sort((a:any,b:any)=>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return(
    <Suspense fallback={<Loading/>}>
      <div className="text-center p-5">
        <AnnouncementPanel totalPage={totalPage} currentPage={currentPage} announcementData={announcements.data} isAdmin={isAdmin} showSearch={true}/>
      </div>
    </Suspense>
  )
}