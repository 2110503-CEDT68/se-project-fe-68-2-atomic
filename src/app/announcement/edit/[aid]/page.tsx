import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { redirect } from "next/navigation";
import EditAnnouncementPanel from "@/components/EditAnnouncementPanel";
import getAnnouncement from "@/libs/getAnnouncement"; // Using your existing lib

// 📌 1. กำหนด params เป็น Promise
export default async function EditAnnouncementPage({ params }: { params: Promise<{ aid: string }> }) {
    // 📌 2. แกะ aid ออกมา
    const { aid } = await params;
    
    const session = await getServerSession(authOptions);
    const token = session?.user?.token; // ใส่ ? เผื่อเหนียว
    const isAdmin = session?.user?.role === 'admin'; // ใส่ ? เผื่อเหนียว

    if (!isAdmin) redirect('/announcement');

    // 📌 3. ใช้ตัวแปร aid แทน params.aid
    // Fetch the specific announcement data to pre-fill the form
    const announcementDetail = await getAnnouncement(aid);

    return (
        <Suspense fallback={<Loading />}>
            <main className="min-h-screen bg-[#838383] flex flex-col">
                <EditAnnouncementPanel 
                    token={token!} 
                    aid={aid} // 📌 4. ใช้ตัวแปร aid แทน params.aid
                    initialData={announcementDetail.data} 
                />
            </main>
        </Suspense>
    );
}