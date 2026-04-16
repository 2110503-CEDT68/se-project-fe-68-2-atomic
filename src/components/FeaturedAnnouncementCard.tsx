import Image from "next/image";
import Link from "next/link";

export default function FeaturedAnnouncementCard({
  id, logoSrc, title, date
}: {
  id: string;
  logoSrc: string;
  title: string;
  date: string | Date;
}) {
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

  return (
<div className="flex flex-row w-full h-full bg-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow overflow-hidden font-sukhumvit">
      {/* Left — image fills edge to edge */}
      <div className="w-[55%] relative flex-shrink-0">
        <Image
          src={logoSrc}
          alt={title}
          fill={true}
          className="object-cover"
        />
      </div>

      {/* Right — content column */}
      <div className="w-[45%] p-5 flex flex-col justify-between bg-[#e5e5e5]">

        {/* Top section */}
        <div className="flex flex-col gap-3">
          {/* New badge */}
          <div className="self-start bg-amber-400 text-amber-900 text-sm font-bold px-4 py-1 rounded">
            New
          </div>

          {/* Date */}
          <div className="flex items-center text-gray-500 font-bold text-sm">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Date : {formattedDate}</span>
          </div>

          {/* Title */}
          <h2
            className="text-[#4a4a4a] text-left text-base font-medium leading-snug line-clamp-4"
            dangerouslySetInnerHTML={{ __html: formatText(title) }}
          />
        </div>

        {/* Read More button — bottom right */}
        <Link
          href={`/announcement/${id}`}
          className="self-end bg-white text-gray-600 px-6 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors mt-4"
        >
          Read More
        </Link>

      </div>
    </div>
  );
}