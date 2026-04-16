import AnnouncementPanel from "@/components/AnnouncementPanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getAnnouncements from "@/libs/getAnnoucements";
import { redirect } from "next/navigation";

export default async function ManageAnnouncementPage({searchParams}: {searchParams: Promise<{page?: string}>}) {
    const session = await getServerSession(authOptions);
    
    // Safety Check: ถ้าไม่ใช่ Admin ห้ามเข้าหน้านี้เด็ดขาด
    if (!session || session.user.role !== 'admin') {
        redirect('/announcements');
    }

    const { page } = await searchParams;
    const announcements = await getAnnouncements(Number(page) || 1);

    return (
        <div className="p-10">
            {/* ส่ง prop พิเศษไปเพื่อบอกให้แสดงผลแบบ Table Dashboard */}
            <AnnouncementPanel 
                announcementData={announcements.data} 
                totalPage={Math.ceil(announcements.pagination.total / 10)} 
                currentPage={Number(page) || 1} 
                isAdmin={true} 
                isDashboard={true} // เพิ่ม prop นี้
            />
        </div>
    );
}