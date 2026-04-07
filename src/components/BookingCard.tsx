'use client';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

export default function BookingCard({ booking, handleRemove, isAdmin }: { booking: BookingItem; handleRemove: (id: string) => void; isAdmin?: boolean; }) {
  const router = useRouter();

  return (
    <div className={`mb-10 ${isAdmin ? 'bg-white w-full max-w-2xl p-12 rounded-[2rem] shadow-xl flex flex-col justify-center mx-auto' : ''}`}>
      
      <div className={`space-y-6 ${isAdmin ? 'mb-4' : 'mb-16'} text-left w-fit mx-auto`}>
        
        <table className="text-left border-separate border-spacing-y-2">
          <tbody>
            {
              isAdmin ?
                <tr>
                  <td className='w-[100px] sm:w-[120px] text-lg sm:text-2xl font-bold pb-4 align-top'>ID: </td>
                  <td className='text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-all'>{booking._id}</td>
                </tr>
                : null
            }
            {
              isAdmin ?
                <tr>
                  <td className='w-[100px] sm:w-[120px] text-lg sm:text-2xl font-bold pb-4 align-top'>Patient: </td>
                  <td className='text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-words'>{booking.user.name}</td>
                </tr>
                : null
            }
            <tr>
              <td className='w-[100px] sm:w-[120px] text-lg sm:text-2xl font-bold pb-4 align-top'>Dentist: </td>
              <td className='text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-words'>{booking.dentist.name}</td>
            </tr>
            <tr>
              <td className='w-[100px] sm:w-[120px] text-lg sm:text-2xl font-bold pb-4 align-top'>Date: </td>
              <td className='text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-words'>{dayjs(booking.date).format('YYYY/MM/DD')}</td>
            </tr>
            <tr>
              <td></td>
              <td className='text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-words'>
                (In {dayjs(booking.date).diff(dayjs(), 'day')} {dayjs(booking.date).diff(dayjs(), 'day') === 1 ? 'day' : 'days'})
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-row justify-center gap-4 mt-2">
        <button
          onClick={() => router.push(`/booking/edit?bid=${booking._id}`)}
          className="cursor-pointer bg-black text-white text-xl font-bold py-2 px-12 rounded-full hover:bg-gray-800 transition flex items-center gap-2 active:scale-95"
        >
          Edit
        </button>
        <button
          onClick={() => handleRemove(booking._id)}
          className="cursor-pointer bg-red-600 text-white text-xl font-bold py-2 px-8 rounded-full hover:bg-red-800 transition active:scale-95"
        >
          Remove
        </button>
      </div>
    </div>
  );
}