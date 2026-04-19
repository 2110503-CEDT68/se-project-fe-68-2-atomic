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
      
      <div className="flex flex-col gap-6">
        
        {/* แถวที่ 1: ส่วน Header ด้านบน (System Record กับ ID) */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-100 text-cyan-700'}`}>
            {isAdmin ? 'MANAGE' : 'My Appointment'}
          </span>
          <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded break-all">
            ID: {booking._id}
          </span>
        </div>

        {/* แถวที่ 2: ส่วนรายละเอียด และปุ่มกด ให้อยู่ในระนาบเดียวกัน (เมื่ออยู่บนจอใหญ่) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-t border-gray-50 pt-2 lg:pt-0 lg:border-t-0">
          
          {/* ข้อมูล Grid (กินพื้นที่ที่เหลือ) */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {isAdmin && (
              <div className="flex flex-col border-l-4 border-indigo-500 pl-4">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Patient Name</span>
                <span className="text-xl font-extrabold text-gray-800 break-words">{booking.user.name}</span>
              </div>
            )}
            
            <div className="flex flex-col border-l-4 border-blue-500 pl-4">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Dentist</span>
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

          {/* ส่วนปุ่มกด */}
          <div className="flex flex-row gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => router.push(`/booking/edit?bid=${booking._id}`)}
              className="flex-1 lg:flex-none lg:w-32 py-2 px-8 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all active:scale-95 text-center shadow-md cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(booking._id)}
              className="flex-1 lg:flex-none lg:w-32 py-2 px-8 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-all active:scale-95 text-center shadow-md cursor-pointer"
            >
              Delete
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}