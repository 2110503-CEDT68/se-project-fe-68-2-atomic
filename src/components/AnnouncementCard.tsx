import Image from "next/image";
import Link from "next/link";

export default function AnnouncementCard({id, logoSrc, title, date, isNew = false, className = ''}: 
  {id: string;logoSrc: string;title: string;date: string | Date;isNew?: boolean;className?: string;}) {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const formatText = (text: string) =>
    text
      .replace(/\\n/g, '<br />')
      .replace(/\\t/g, '<span class="ml-8 inline-block"></span>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  const formattedTitle = formatText(title);

  return (
    <div className={`relative flex flex-row w-[45%] h-[220px] bg-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow overflow-hidden m-5 font-sukhumvit ${className}`}>
      {isNew && (
        <span className="absolute top-3 left-3 z-10 bg-amber-400 text-amber-900 text-sm font-bold px-3 py-1 rounded">
          New
        </span>
      )}

      <div className="w-[40%] relative bg-white flex-shrink-0">
        <Image
          src={logoSrc}
          alt={title}
          fill={true}
          className="object-contain p-2"
        />
      </div>

      <div className="w-[60%] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-gray-500 font-bold mb-2 text-sm sm:text-base">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Date : {formattedDate}</span>
          </div>
          <h2
            className="text-[#4a4a4a] text-left text-lg sm:text-xl font-medium leading-snug line-clamp-3"
            dangerouslySetInnerHTML={{ __html: formattedTitle }}
          />
        </div>

        <Link
          href={`/announcement/${id}`}
          className="self-end bg-white text-gray-600 px-6 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors mt-2"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}