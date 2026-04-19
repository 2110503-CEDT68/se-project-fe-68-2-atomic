import Image from "next/image";
import Link from "next/link"; // 📌 นำเข้า Link สำหรับทำปุ่ม

const monthMap: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

export default function AnnouncementCard({
  id, logoSrc, title, date, className = ''
}: {
  id: string;
  logoSrc: string;
  title: string;
  date: string | Date;
  className?: string;
}) {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = monthMap[String(dateObj.getMonth() + 1).padStart(2, '0')];
  const year = dateObj.getFullYear();
  let hour = dateObj.getHours();
  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }

  const minute = String(dateObj.getMinutes()).padStart(2, '0');
  const formattedDate = `${day} ${month} ${year} ${hour}:${minute} ${period}`;

  const formatText = (text: string) =>
    text
      .replace(/\\n/g, '<br />')
      .replace(/\\t/g, '<span class="ml-8 inline-block"></span>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return (
    <div className={`relative flex flex-col md:flex-row w-full h-full font-sukhumvit ${className}`}>

      {/* 🖼️ Left / Top — Image */}
      <div className="w-full md:w-[40%] h-40 md:h-auto relative flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center p-4">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={title}
            fill={true}
            className="object-cover"
          />
        ) : (
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">No Image</span>
        )}
      </div>

      {/* 📝 Right / Bottom — Content Column */}
      <div className="w-full md:w-[60%] p-4 md:p-5 flex flex-col h-full">

        {/* ส่วนบน: วันที่ และป้ายสถานะ */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <div className="flex items-center text-slate-400 font-semibold text-xs">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>

        </div>

        {/* ตรงกลาง: หัวข้อประกาศ */}
        <h3
          className="text-lg font-bold text-slate-800 leading-snug line-clamp-3"
          dangerouslySetInnerHTML={{ __html: formatText(title) }}
        />

        {/* ✨ ส่วนล่าง: ปุ่ม Read more */}
        {/* 📌 เปลี่ยนจาก div เป็น Link และใช้ group/btn เพื่อผูก Hover Effect ไว้แค่ตรงนี้ */}
        <Link
          href={`/announcement/${id}`}
          className="mt-auto pt-4 flex items-center text-blue-600 font-bold text-sm w-fit group/btn hover:text-blue-800 transition-colors after:content-[''] after:absolute after:inset-0 after:z-10"
        >
          <span>Read more</span>
          <svg
            className="w-4 h-4 ml-1.5 transform group-hover/btn:translate-x-1.5 transition-transform duration-300"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

      </div>
    </div>
  );
}