import Loading from "@/components/Loading";
import AnnouncementPanel from "@/components/AnnouncementPanel";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getAnnouncements from "@/libs/getAnnoucements";

// import getAnnouncements from "@/libs/getAnnouncements";

export default async function AnnouncementPage(){
  
  const session = await getServerSession(authOptions)
  const token = session?.user.token
  const isAdmin = session?.user.role === 'admin'

  const announcements = await getAnnouncements();

  return(
    <Suspense fallback={<Loading/>}>
      <div className="text-center p-5">
        <AnnouncementPanel announcementData={announcements} isAdmin={isAdmin} showSearch={true}/>
      </div>
    </Suspense>
  )
}