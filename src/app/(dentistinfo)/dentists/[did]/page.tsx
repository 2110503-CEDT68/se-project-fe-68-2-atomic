import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Loading from "@/components/Loading";
import getBookings from "@/libs/getBookings";
import getDentist from "@/libs/getDentist";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import DentistDetail from "@/components/DentistDetail";

export default async function DentistDetailPage({ params }: { params: Promise<{ did: string }> }) {
    const { did } = await params;
    
    const dentists = await getDentist(did);
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === 'admin';

    let bookings = null;
    if (session) {
        bookings = await getBookings(session.user.token);
    }
    const hasBooking = bookings ? bookings.count >= 1 : false;

    return (
        <Suspense fallback={<Loading />}>
            <DentistDetail 
                dentistJsonReady={dentists} 
                did={did} 
                isAdmin={isAdmin} 
                hasBooking={hasBooking} 
                token={session?.user.token} 
            />
        </Suspense>
    );
}