'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
import {
  CircularProgress,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import updateBooking from '@/libs/updateBooking';

export default function EditBooking({ bookingJsonReady, token }: { bookingJsonReady: BookingJsonSingle, token: string }) {
  const router = useRouter();

  // State — pre-filled with current booking data
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(dayjs(bookingJsonReady.data.date));

  // Loading & error states
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingDate && confirm("Are you sure you want to update this appointment?")) {
      setIsUpdating(true);
      setUpdateError(null);
      try {
        // Using Bangkok Time Zone GMT+7
        const isoDate = dayjs.tz(bookingDate.format('YYYY-MM-DD'), 'Asia/Bangkok').toISOString();
        await updateBooking(bookingJsonReady.data._id, isoDate, token);
        router.push('/booking');
      } catch (err: any) {
        setIsUpdating(false);
        const is500 = err?.message?.includes('500');
        setUpdateError(is500
          ? 'There was a problem, please try again.'
          : 'Unable to update the booking.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Main Card */}
      <main className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white w-full max-w-2xl p-12 rounded-[2rem] shadow-xl min-h-[400px] flex flex-col justify-center">

          {isUpdating ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <CircularProgress />
              <p className="text-2xl font-bold text-black">Updating Booking...</p>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold text-center mb-6 text-black">
                Edit Booking
              </h1>
              <p className="text-center text-gray-500 font-semibold mb-4">Booking ID: {bookingJsonReady.data._id}</p>

              {updateError && (
                <p className="text-center text-red-600 font-medium mb-4">{updateError}</p>
              )}

              <form onSubmit={handleUpdate} className="space-y-10">
                {/* Patient Name (Display Only) */}
                <table className="text-left w-full border-separate border-spacing-y-2 mt-16 max-w-md mx-auto">
                  <tbody>
                    <tr>
                      <td className="text-lg sm:text-2xl font-bold min-w-[80px] sm:min-w-[120px] pb-4 align-top">Patient: </td>
                      <td className="text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-words">{bookingJsonReady.data.user.name}</td>
                    </tr>
                    <tr>
                      <td className="text-lg sm:text-2xl font-bold min-w-[80px] sm:min-w-[120px] pb-4 align-top">Dentist: </td>
                      <td className="text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-words">{bookingJsonReady.data.dentist.name}</td>
                    </tr>
                    <tr>
                      <td className="text-lg sm:text-2xl font-bold min-w-[80px] sm:min-w-[120px] pb-4 align-top">Date: </td>
                      <td>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Select Date"
                            value={bookingDate}
                            format="YYYY/MM/DD"
                            onChange={(newValue) => {
                              if (newValue && newValue.isBefore(dayjs(), 'day')) {
                                setDateError('Date cannot be in the past');
                                setBookingDate(null);
                              } else {
                                setBookingDate(newValue);
                                setDateError(null);
                                setUpdateError(null);
                              }
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                required: true,
                                error: !!(updateError || dateError),
                                sx: {
                                  '& .MuiOutlinedInput-root': { borderRadius: '0.75rem' }
                                }
                              }
                            }}
                          />
                        </LocalizationProvider>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {dateError
                          ? <p className='text-lg font-medium text-red-600 px-1'>{dateError}</p>
                          : <p className='text-lg sm:text-2xl font-medium text-gray-700 px-1'>(In {bookingDate ? bookingDate.diff(dayjs(), 'day') : '?'} {bookingDate && bookingDate.diff(dayjs(), 'day') === 1 ? 'day' : 'days'})</p>
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Buttons */}
                <div className='flex flex-row justify-center gap-4'>
                  {/* Cancel Button */}
                  <div className="flex justify-center pt-10">
                    <button
                      type="button"
                      onClick={() => router.push('/booking')}
                      className="cursor-pointer bg-black text-white text-xl font-bold py-3 px-10 rounded-full hover:bg-gray-800 transition active:scale-95 shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                  {/* Done Button */}
                  <div className="flex justify-center pt-10">
                    <button
                      type="submit"
                      className="cursor-pointer bg-blue-600 text-white text-xl font-bold py-3 px-12 rounded-full hover:bg-blue-800 transition active:scale-95 shadow-lg"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

        </div>
      </main>
    </div>
  );
}