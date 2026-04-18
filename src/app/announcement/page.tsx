import Loading from "@/components/Loading";
import AnnouncementPanel from "@/components/AnnouncementPanel";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getAnnouncements from "@/libs/getAnnoucements";

export default async function AnnouncementPage({searchParams} : {searchParams: Promise<{ page?: string }>}){

  const { page } = await searchParams;

  let currentPage = Number(page) || 1;
  currentPage = currentPage < 0 ? 1 : currentPage;
  
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'admin'

  let announcements: AnnouncementJson = await getAnnouncements(1, 1000);

  return(
    <Suspense fallback={<Loading/>}>
      {/* 📌 แก้ตรงนี้: เปลี่ยนจาก className="text-center p-5" เป็น "w-full" เพื่อลบขอบขาว */}
      <div className="w-full">
        <AnnouncementPanel 
          totalPage={1}
          currentPage={currentPage} 
          announcementData={announcements.data} 
          isAdmin={isAdmin} 
          showSearch={true}
        />
      </div>
    </Suspense>
  )
}