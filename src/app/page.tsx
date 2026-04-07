import Banner from "@/components/Banner";
import DentistPanel from "@/components/DentistPanel";
import FeedbackPanel from "@/components/FeedbackPanel";
import Loading from "@/components/Loading";
import getDentists from "@/libs/getDentists";
import { Suspense } from "react";

export default async function Home() {
  const dentists = await getDentists()
  
  return (
    <main>
      <Suspense fallback={<Loading/>}>
        <Banner/>
        <DentistPanel dentistJsonReady={dentists}/>
        <FeedbackPanel/>
      </Suspense>
    </main>
  );
}
