import Banner from "@/components/Banner";
import DentistPanel from "@/components/DentistPanel";
import FeedbackPanel from "@/components/FeedbackPanel";
import Loading from "@/components/Loading";
import getDentists from "@/libs/getDentists";
import { Suspense } from "react";
import getAnnouncements from "@/libs/getAnnoucements";
import AnnouncementPanel from "@/components/AnnouncementPanel";
import AnnouncementMenuPanel from "@/components/AnnouncementMenuPanel";



export default async function Home() {
  const dentists = await getDentists()
  let announcements: AnnouncementJson = await getAnnouncements(1);
  return (
    <main>
      <Suspense fallback={<Loading/>}>
        <Banner/>
        <AnnouncementMenuPanel  announcementData={announcements.data}/>
        <DentistPanel dentistJsonReady={dentists}/>
        <FeedbackPanel/>
      </Suspense>
    </main>
  );
}
