'use client';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
import { useRouter, useSearchParams } from 'next/navigation';
import addBooking from '@/libs/addBooking';
import deleteBooking from '@/libs/deleteBooking';
import {
  CircularProgress,
  TextField,
  MenuItem
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BookingCard from './BookingCard';

export default function BookingPanel({ dentistJsonReady, bookingJsonReady, token, isAdmin }: { dentistJsonReady: DentistJson, bookingJsonReady: BookingJson, token: string, isAdmin: boolean }) {

  // If user book from dentist Card
  const urlParams = useSearchParams()
  const did = urlParams.get('did')

  // สำหรับฟอร์มสร้างนัดหมาย
  const [selectedDentist, setSelectedDentist] = useState(did ? did : '');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Error state for booking form
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDentist && selectedDate) {
      setIsCreating(true);
      setBookingError(null);
      try {
        // Using Bangkok Time Zone GMT+7
        const isoDate = dayjs.tz(selectedDate.format('YYYY-MM-DD'), 'Asia/Bangkok').toISOString();
        await addBooking(selectedDentist, isoDate, token);
        window.location.reload();
      } catch (err: any) {
        setIsCreating(false);
        const is500 = err?.message?.includes('500');
        setBookingError(is500
          ? 'There was a problem, please try again.'
          : 'Unable to create the booking.');
      }
    }
  };

  const handleRemove = async (id: string) => {
    if (confirm("Are you sure you want to remove this appointment?")) {
      setIsDeleting(true);
      await deleteBooking(id, token);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <main className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white w-full max-w-2xl p-12 rounded-[2rem] shadow-xl min-h-[400px] flex flex-col justify-center">

          {isCreating ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
              <CircularProgress />
              <p className="text-2xl font-bold text-black">Creating Booking...</p>
            </div>
          ) : isDeleting ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
              <CircularProgress />
              <p className="text-2xl font-bold text-red-600">Deleting Booking...</p>
            </div>
          ) : isAdmin ? (
            <div className="animate-fade-in text-center">
              <h1 className="text-4xl font-extrabold mb-3 text-black">Manage Booking</h1>
              <p className='text-xl mb-4'>Total Booking: {bookingJsonReady.data.length}</p>
              <div className="space-y-4">
                {bookingJsonReady.data.map((booking: BookingItem) => (
                  <BookingCard key={booking._id} booking={booking} handleRemove={handleRemove} isAdmin={isAdmin} />
                ))}
              </div>
            </div>
          ) : (
            bookingJsonReady.count === 0 ?
              /* --- หน้าที่ 1: Make an Appointment (ยังไม่มี Session การจอง) --- */
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="animate-fade-in">
                  <h1 className="text-4xl font-extrabold text-center mb-16 text-black">
                    Make an Appointment
                  </h1>
                  {bookingError && (
                    <p className="text-center text-red-600 font-medium mb-4">{bookingError}</p>
                  )}
                  <form onSubmit={handleConfirm} className="space-y-10">
                    <TextField
                      select
                      fullWidth
                      label="Select a Dentist"
                      value={selectedDentist}
                      onChange={(e) => { setSelectedDentist(e.target.value); setBookingError(null); }}
                      required
                      variant="outlined"
                      error={!!bookingError}
                      slotProps={{
                        input: { className: "rounded-xl text-lg" }
                      }}
                    >
                      {
                        dentistJsonReady.data.map((dentist: DentistItem) => (
                          <MenuItem key={dentist.id} value={dentist.id}>{dentist.name}</MenuItem>
                        ))
                      }
                    </TextField>

                    <div className="flex flex-col flex-grow mt-6">
                      <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        format="YYYY/MM/DD"
                        onChange={(newValue) => {
                          if (newValue && newValue.isBefore(dayjs(), 'day')) {
                            setDateError('Date cannot be in the past');
                            setSelectedDate(null);
                          } else {
                            setSelectedDate(newValue);
                            setDateError(null);
                            setBookingError(null);
                          }
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!(bookingError || dateError),
                            sx: {
                              '& .MuiOutlinedInput-root': { borderRadius: '0.75rem' }
                            }
                          }
                        }}
                      />
                      {dateError && (
                        <p className="text-sm font-medium text-red-600 mt-1">{dateError}</p>
                      )}
                    </div>

                    <div className="flex justify-center pt-10">
                      <button type="submit" className=" cursor-pointer bg-black text-white text-xl font-bold py-2 px-8 rounded-full hover:bg-gray-800 transition active:scale-95">
                        Confirm
                      </button>
                    </div>
                  </form>
                </div>
              </LocalizationProvider>
              :
              /* --- หน้าที่ 2: Your Appointment (มี Session การจองแล้ว) --- */
              <div className="animate-fade-in text-center">
                <h1 className="text-4xl font-extrabold mb-16 text-black">Your Appointment</h1>
                <div className="space-y-4">
                  {bookingJsonReady.data.map((booking: BookingItem) => (
                    <BookingCard key={booking._id} booking={booking} handleRemove={handleRemove} isAdmin={isAdmin} />
                  ))}
                </div>
              </div>
          )}

        </div>
      </main>
    </div>
  );
}