import Banner from "@/components/Banner";
import DentistPanel from "@/components/DentistPanel";
import ReviewHomePanel from "@/components/ReviewHomePanel";
import Loading from "@/components/Loading";
import getDentists from "@/libs/getDentists";
import { Suspense } from "react";
import getAnnouncements from "@/libs/getAnnouncements";
import AnnouncementHomePanel from "@/components/AnnouncementHomePanel";
import getReviews from "@/libs/getReviews";



export default async function Home() {
  const dentists = await getDentists()
  const reviews = await getReviews({ page: 1, limit: 10 });

  let announcements: AnnouncementJson = await getAnnouncements(1);

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Banner />
        <AnnouncementHomePanel announcementData={announcements?.data || []} />
        <DentistPanel dentistJsonReady={dentists} />
        <ReviewHomePanel reviews={reviews}/>
      </Suspense>
    </main>
  );
}
