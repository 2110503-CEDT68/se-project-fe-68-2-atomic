'use client';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
import { useSearchParams } from 'next/navigation';
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

export default function BookingPanel({ 
  dentistJsonReady, 
  bookingJsonReady, 
  token, 
  isAdmin 
}: { 
  dentistJsonReady: any; 
  bookingJsonReady: any; 
  token: string; 
  isAdmin: boolean; 
}) {

  const urlParams = useSearchParams();
  const did = urlParams.get('did');

  const [selectedDentist, setSelectedDentist] = useState(did ? did : '');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [bookingError, setBookingError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDentist && selectedDate) {
      setIsCreating(true);
      setBookingError(null);
      try {
        const isoDate = dayjs.tz(selectedDate.format('YYYY-MM-DD'), 'Asia/Bangkok').toISOString();
        await addBooking(selectedDentist, isoDate, token);
        window.location.reload();
      } catch (err: any) {
        setIsCreating(false);
        const is500 = err?.message?.includes('500');
        setBookingError(is500
          ? 'There was a problem with the server, please try again.'
          : 'Unable to create the booking.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setIsDeleting(true);
      try {
        await deleteBooking(id, token);
        window.location.reload();
      } catch (error) {
        setIsDeleting(false);
        alert("Failed to delete booking.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col w-full">
      <main className="flex-grow flex justify-center items-center p-4 sm:p-8">
        
        {/* ปรับเป็น max-w-7xl เพื่อให้กล่องกว้างขึ้นมากๆ */}
        <div className="bg-white/90 backdrop-blur-md w-full max-w-7xl p-8 sm:p-14 rounded-[2.5rem] shadow-2xl min-h-[500px] flex flex-col justify-center border border-white/50">

          {isCreating ? (
            <div className="flex flex-col items-center justify-center gap-6 animate-fade-in py-20">
              <CircularProgress size={64} thickness={4} />
              <p className="text-3xl font-black text-gray-800">Creating Booking...</p>
            </div>
          ) : isDeleting ? (
            <div className="flex flex-col items-center justify-center gap-6 animate-fade-in py-20">
              <CircularProgress color="error" size={64} thickness={4} />
              <p className="text-3xl font-black text-red-600">Deleting Booking...</p>
            </div>
          ) : isAdmin || bookingJsonReady.count > 0 ? (
            <div className="animate-fade-in w-full">
              <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                  {isAdmin ? 'Manage Bookings' : 'Your Appointments'}
                </h1>
                <p className='text-lg text-gray-500 font-medium'>
                  {isAdmin ? `Total Bookings: ${bookingJsonReady.data.length}` : 'Manage your upcoming dental visits'}
                </p>
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {bookingJsonReady.data.map((booking: any) => (
                  <BookingCard 
                    key={booking._id} 
                    booking={booking} 
                    handleDelete={handleDelete} 
                    isAdmin={isAdmin} 
                  />
                ))}
              </div>
            </div>
          ) : (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="animate-fade-in max-w-2xl mx-auto w-full">
                <div className="text-center mb-12">
                  <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                    Make an Appointment
                  </h1>
                  <p className="text-gray-500 text-lg">Select a dentist and your preferred date</p>
                </div>
                
                {bookingError && (
                  <div className="bg-red-50 text-red-600 font-bold p-4 rounded-2xl text-center mb-8 border border-red-100">
                    {bookingError}
                  </div>
                )}
                
                <form onSubmit={handleConfirm} className="space-y-8">
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
                      input: { className: "rounded-2xl text-lg bg-gray-50" }
                    }}
                  >
                    {dentistJsonReady.data.map((dentist: any) => (
                      <MenuItem key={dentist.id} value={dentist.id}>{dentist.name}</MenuItem>
                    ))}
                  </TextField>

                  <div className="flex flex-col">
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
                            '& .MuiOutlinedInput-root': { borderRadius: '1rem', backgroundColor: '#f9fafb' }
                          }
                        }
                      }}
                    />
                    {dateError && (
                      <p className="text-sm font-bold text-red-500 mt-2 ml-2">{dateError}</p>
                    )}
                  </div>

                  <div className="flex justify-center pt-8">
                    <button 
                      type="submit" 
                      className="w-full sm:w-auto bg-black text-white text-xl font-bold py-4 px-16 rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl hover:shadow-2xl"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </LocalizationProvider>
          )}

        </div>
      </main>
    </div>
  );
}