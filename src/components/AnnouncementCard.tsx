import Image from "next/image";
import Link from "next/link"; // 📌 นำเข้า Link สำหรับทำปุ่ม

const monthMap: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

export default function AnnouncementCard({
  id, 
  logoSrc, 
  title, 
  date, 
  isEdited = false,
  className = ''
}: {
  id: string;
  logoSrc: string;
  title: string;
  date: string | Date;
  isEdited?: boolean;
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
    <div className={`relative flex flex-row w-full h-full ${className}`}>

      {/* 🖼️ Left — Image */}
      <div className="w-[40%] relative flex-shrink-0 bg-white border-r border-slate-100 flex items-center justify-center p-4">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt="announcement logo"
            fill={true}
            className="object-contain p-4"
            unoptimized={true}
          />
        ) : (
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">No Image</span>
        )}
      </div>

      {/* 📝 Right — Content Column */}
      <div className="w-[60%] p-5 flex flex-col h-full">
        
        {/* ส่วนบน: วันที่ และป้ายสถานะ */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <div className="flex items-center text-slate-400 font-semibold text-xs">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          
          {isEdited && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Edited
            </span>
          )}
        </div>

        {/* ตรงกลาง: หัวข้อประกาศ */}
        <h3 
          className="text-lg font-bold text-slate-800 leading-snug line-clamp-3"
          dangerouslySetInnerHTML={{ __html: formatText(title) }}
        />

        {/* ✨ ส่วนล่าง: ปุ่ม Read more (เปลี่ยนเป็น Link เพื่อให้คลิกไปต่อได้) */}
        <Link 
          href={`/announcement/${id}`}
          className="mt-auto pt-4 flex items-center text-blue-600 font-bold text-sm w-fit hover:text-blue-800 transition-colors"
        >
          Read more
          {/* 📌 ลบ class ที่เกี่ยวกับการขยับออกหมดแล้ว ลูกศรจะอยู่นิ่งๆ */}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>

      </div>
    </div>
  );
}