import BookingPanel from '@/components/BookingPanel';
import getDentists from '@/libs/getDentists';
import getBookings from '@/libs/getBookings';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';

export default async function BookingPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user.token) redirect('/login')

  const bookings = await getBookings(session!.user.token)
  const dentists = await getDentists()
  const isAdmin = session.user.role === 'admin'

  return (
    <div className={`min-h-[calc(100vh-64px)] ${isAdmin ? 'bg-[#838383]' : 'bg-gradient-to-b from-[#B7FFFB] to-[#FFFFFF]'} flex flex-col`}>
      <BookingPanel dentistJsonReady={dentists} bookingJsonReady={bookings} token={session!.user.token} isAdmin={isAdmin} />
    </div>
  )
}