import Image from "next/image";
import Link from "next/link";

export default function AnnouncementCard({ id, logoSrc, title, date }: { id: string, logoSrc: string, title: string, date: string | Date }) {

  const monthMap: Record<string, string> = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  };

  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = monthMap[String(dateObj.getMonth() + 1).padStart(2, '0')];
  const year = dateObj.getFullYear();
  let hour = dateObj.getHours();
  const period = hour >= 12 ? 'PM' : 'AM';
  
  if (hour == 0) {
    hour = 12
  } else if (hour > 12) {
    hour -= 12;
  }

  const minute = String(dateObj.getMinutes()).padStart(2, '0');
  const formattedDate = `${day} ${month} ${year} ${hour}.${minute} ${period}`;

  const formatText = (text: string) => {
    return text
      .replace(/\\n/g, '<br />')
      .replace(/\\t/g, '<span class="ml-8 inline-block"></span>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  const formattedTitle = formatText(title);

  return (
    <div className="flex flex-row w-[45%] h-[220px] bg-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow overflow-hidden m-5 font-sukhumvit">

      {/* Logo */}
      <div className="w-[40%] relative bg-white flex-shrink-0">
        <Image
          src={logoSrc}
          alt={title}
          fill={true}
          className="object-contain p-2"
        />
      </div>

      {/* Description */}
      <div className="w-[60%] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-gray-500 font-bold mb-2 text-sm sm:text-base">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Date : {formattedDate}</span>
          </div>

          <h2 className="text-[#4a4a4a] text-left text-lg sm:text-xl font-medium leading-snug line-clamp-3" dangerouslySetInnerHTML={{ __html: formattedTitle }}></h2>
        </div>

        <Link key={id} href={`/announcement/${id}`} className="self-end bg-white text-gray-600 px-6 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors mt-2">
          Read More
        </Link>

      </div>
    </div>
  )
}