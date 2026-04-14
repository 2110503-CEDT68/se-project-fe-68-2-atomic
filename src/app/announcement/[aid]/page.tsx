import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Loading from "@/components/Loading";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import getAnnouncement from "@/libs/getAnnouncement";
import AnnouncementDetail from "@/components/AnnouncementDetail";

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ aid: string }> }) {
    const { aid } = await params;

    const announcement = await getAnnouncement(aid);
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === 'admin';

    return (
        <Suspense fallback={<Loading />}>
            <AnnouncementDetail announcementJsonReady={announcement} isAdmin={isAdmin}/>
        </Suspense>
    );
}