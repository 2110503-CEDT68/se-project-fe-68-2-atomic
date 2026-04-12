import Loading from "@/components/Loading";
import AnnouncementPanel from "@/components/AnnouncementPanel";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// import getAnnouncements from "@/libs/getAnnouncements";

export default async function AnnouncementPage(){

  // Mock Data
  const announcements = {
    "success": true,
    "count": 1,
    "pagination": {},
    "data": [
      {
        "_id": "69db259bcfd15c6b53633153",
        "author": {
          "_id": "69d73d3f64c22d6975bb0e40",
          "name": "admin",
          "email": "admin@example.com"
        },
        "title": "ปิดบริการช่วงเทศกาลสงกรานต์",
        "description": "แจ้งปิดบริการช่วงเทศกาลสงกรานต์ระหว่างวันที่ 13-15 เมษายน 2569 คลินิกจะเปิดให้บริการตามปกติในวันที่ 16 เมษายน 2569 ขออภัยในความไม่สะดวกครับ",
        "logoURL": "1aaebwrIOO9EoD_NEpu4XV2F_WImqZPnd",
        "bannerURL": "1aaebwrIOO9EoD_NEpu4XV2F_WImqZPnd",
        "isEdited": false,
        "createdAt": "2026-04-10T09:00:00.000Z",
        "__v": 0
      },
      {
        "_id": "69db259bcfd15c6b53633154",
        "author": {
            "_id": "69d73d3f64c22d6975bb0e40",
            "name": "admin",
            "email": "admin@example.com"
        },
        "title": "โปรโมชั่นฉีดวัคซีนไข้หวัดใหญ่ 4 สายพันธุ์",
        "description": "ปกป้องคุณและคนที่คุณรักด้วยวัคซีนไข้หวัดใหญ่ราคาพิเศษเพียง 590 บาท ตั้งแต่วันนี้ถึงสิ้นเดือนพฤษภาคม 2569 เท่านั้น สำรองคิวล่วงหน้าได้ที่เบอร์โทรศัพท์ของคลินิก",
        "logoURL": "2bbecwrJOO9EoD_NEpu4XV2F_WImqZPae",
        "bannerURL": "2bbecwrJOO9EoD_NEpu4XV2F_WImqZPae",
        "isEdited": false,
        "createdAt": "2026-04-11T08:30:00.000Z",
        "__v": 0
      },
      {
        "_id": "69db259bcfd15c6b53633155",
        "author": {
            "_id": "69d73d3f64c22d6975bb0e40",
            "name": "admin",
            "email": "admin@example.com"
        },
        "title": "ยินดีต้อนรับ คุณหมอสมชาย เข้าสู่ทีมกุมารแพทย์",
        "description": "คลินิกมีความยินดีที่จะแนะนำ นพ.สมชาย ใจดี ผู้เชี่ยวชาญด้านกุมารเวชศาสตร์ที่จะมาเริ่มปฏิบัติหน้าที่ตั้งแต่วันที่ 1 พฤษภาคม 2569 เป็นต้นไป โดยจะลงตรวจทุกวันเสาร์และอาทิตย์",
        "logoURL": "3ccecwrKOO9EoD_NEpu4XV2F_WImqZPbv",
        "bannerURL": "3ccecwrKOO9EoD_NEpu4XV2F_WImqZPbv",
        "isEdited": true,
        "createdAt": "2026-04-12T10:15:00.000Z",
        "__v": 1
      },
      {
        "_id": "69db259bcfd15c6b53633156",
        "author": {
            "_id": "69d73d3f64c22d6975bb0e40",
            "name": "admin",
            "email": "admin@example.com"
        },
        "title": "ย้ายจุดรับยาและชำระเงินชั่วคราว",
        "description": "เนื่องด้วยมีการปรับปรุงพื้นที่เคาน์เตอร์ส่วนหน้า ทางคลินิกขอแจ้งย้ายจุดรับยาและชำระเงินไปที่โถงทางเดินขวา (หน้าห้องตรวจ 5) ตั้งแต่วันที่ 20-25 เมษายน 2569",
        "logoURL": "4ddecwrLOO9EoD_NEpu4XV2F_WImqZPcx",
        "bannerURL": "4ddecwrLOO9EoD_NEpu4XV2F_WImqZPcx",
        "isEdited": false,
        "createdAt": "2026-04-12T13:00:00.000Z",
        "__v": 0
      },
      {
        "_id": "69db259bcfd15c6b53633157",
        "author": {
            "_id": "69d73d3f64c22d6975bb0e40",
            "name": "admin",
            "email": "admin@example.com"
        },
        "title": "ความรู้เรื่องการดูแลตนเองจากฝุ่น PM 2.5",
        "description": "ในช่วงที่ค่าฝุ่นสูงเกินมาตรฐาน แนะนำให้สวมหน้ากาก N95 เมื่อออกที่โล่งแจ้ง และล้างจมูกด้วยน้ำเกลือเพื่อลดการสะสมของฝุ่น หากมีอาการไอเรื้อรังหรือหายใจติดขัดควรรีบพบแพทย์",
        "logoURL": "5eeecwrMOO9EoD_NEpu4XV2F_WImqZPdy",
        "bannerURL": "5eeecwrMOO9EoD_NEpu4XV2F_WImqZPdy",
        "isEdited": false,
        "createdAt": "2026-04-12T15:45:00.000Z",
        "__v": 0
      }
    ]
  }

  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'admin'

  return(
    <Suspense fallback={<Loading/>}>
      <div className="text-center p-5">
        <AnnouncementPanel announcementJson={announcements} isAdmin={isAdmin} showSearch={true}/>
      </div>
    </Suspense>
  )
}