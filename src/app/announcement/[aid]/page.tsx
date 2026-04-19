import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Loading from "@/components/Loading";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import getAnnouncement from "@/libs/getAnnouncement";
import AnnouncementDetail from "@/components/AnnouncementDetail";
import { notFound } from 'next/navigation';

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ aid: string }> }) {
    const { aid } = await params;

    const announcement = await getAnnouncement(aid);
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === 'admin';

    if (!announcement) {
        notFound();
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className={`w-full min-h-screen ${isAdmin ? 'bg-[#838383]' : 'bg-white'} py-10`}>
                <AnnouncementDetail announcementJsonReady={announcement} isAdmin={isAdmin} token={session?.user.token}/>
            </div>
        </Suspense>
    );
}