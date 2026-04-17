'use client';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

interface BookingItem {
  _id: string;
  date: string;
  user: {
    name: string;
  };
  dentist: {
    name: string;
  };
}

export default function BookingCard({ 
  booking, 
  handleDelete, 
  isAdmin 
}: { 
  booking: BookingItem; 
  handleDelete: (id: string) => void; 
  isAdmin?: boolean; 
}) {
  const router = useRouter();
  
  // คำนวณจำนวนวันที่เหลือ
  const daysDiff = dayjs(booking.date).diff(dayjs(), 'day');

  return (
    <div className="w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* ส่วนข้อมูลด้านซ้าย */}
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-5">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-100 text-cyan-700'}`}>
              {isAdmin ? 'System Record' : 'My Appointment'}
            </span>
            <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
              ID: {booking._id.slice(-8)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isAdmin && (
              <div className="flex flex-col border-l-4 border-indigo-500 pl-4">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Patient Name</span>
                {/* เอา truncate ออก เพื่อให้แสดงชื่อเต็ม */}
                <span className="text-xl font-extrabold text-gray-800 break-words">{booking.user.name}</span>
              </div>
            )}
            
            <div className="flex flex-col border-l-4 border-blue-500 pl-4">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Assigned Dentist</span>
              {/* เอา truncate ออก เพื่อให้แสดงชื่อเต็ม */}
              <span className="text-xl font-extrabold text-gray-800 break-words">{booking.dentist.name}</span>
            </div>

            <div className="flex flex-col border-l-4 border-emerald-500 pl-4">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Appointment Date</span>
              <div className="flex flex-row items-center gap-3 flex-wrap">
                <span className="text-xl font-extrabold text-gray-800 whitespace-nowrap">
                  {dayjs(booking.date).format('DD MMM YYYY')}
                </span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md w-fit whitespace-nowrap">
                  {daysDiff === 0 ? 'Today' : `in ${daysDiff} ${daysDiff === 1 ? 'day' : 'days'}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ส่วนปุ่มด้านขวา */}
        <div className="flex flex-row lg:flex-col xl:flex-row gap-3 min-w-[280px] mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <button
            onClick={() => router.push(`/booking/edit?bid=${booking._id}`)}
            className="flex-1 py-3.5 px-8 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-700 transition-all active:scale-95 text-center shadow-md hover:shadow-lg"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(booking._id)}
            className="flex-1 py-3.5 px-8 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-200 active:scale-95 text-center shadow-sm"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}