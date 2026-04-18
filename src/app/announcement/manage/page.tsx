import AnnouncementPanel from "@/components/AnnouncementPanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getAnnouncements from "@/libs/getAnnoucements";
import { redirect } from "next/navigation";

export default async function ManageAnnouncementPage({searchParams}: {searchParams: Promise<{page?: string}>}) {
    const session = await getServerSession(authOptions);
    
    // Safety Check: ถ้าไม่ใช่ Admin ห้ามเข้าหน้านี้เด็ดขาด
    if (!session || session.user.role !== 'admin') {
        redirect('/announcement'); // แก้จาก /announcements เป็น /announcement
    }

    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    // 📌 สำคัญที่สุด: สั่งดึงหน้า 1 และขอ Limit 1000 เพื่อเอาข้อมูลทั้งหมดมาให้หน้าเว็บจัดการต่อ
    const announcements = await getAnnouncements(1, 1000);

    return (
        <div className="w-full">
            <AnnouncementPanel 
                announcementData={announcements.data} 
                totalPage={1} // ปล่อยเป็น 1 ไปเลย เพราะ AnnouncementPanel จะคำนวณจำนวนหน้าจริงๆ ให้เอง
                currentPage={currentPage} 
                isAdmin={true} 
                isDashboard={true} 
                token={session.user.token}
            />
        </div>
    );
}