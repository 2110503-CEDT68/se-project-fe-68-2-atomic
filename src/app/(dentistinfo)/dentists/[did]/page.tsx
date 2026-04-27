import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Loading from "@/components/Loading";
import getBookings from "@/libs/getBookings";
import getDentist from "@/libs/getDentist";
import getReviews from "@/libs/getReviews";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import ReviewDentistPanel from "@/components/ReviewDentistPanel";
import DentistDetail from "@/components/DentistDetail";

export default async function DentistDetailPage({ params }: { params: Promise<{ did: string }> }) {
    const { did } = await params;
    
    const dentist = await getDentist(did);
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === 'admin';
    const currentUserId = session?.user.id
    const token = session?.user.token

    const reviews = await getReviews({ page: 1, limit: 1000, dentistId: did});

    let bookings = null;
    if (session) {
        bookings = await getBookings(session.user.token);
    }
    const hasBooking = bookings ? bookings.count >= 1 : false;

    return (
        <Suspense fallback={<Loading />}>
            <DentistDetail 
                dentistJsonReady={dentist} 
                did={did} 
                isAdmin={isAdmin} 
                hasBooking={hasBooking} 
                token={session?.user.token} 
            />
            <ReviewDentistPanel reviews={reviews} isAdmin={isAdmin} currentUserId={currentUserId} token={token} did={did}/>
        </Suspense>
    );
}