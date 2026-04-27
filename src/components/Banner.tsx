import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import getBookings from '@/libs/getBookings';

export default async function Banner() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'admin'

  let bookings = null
  if(session) bookings = await getBookings(session!.user.token)

  return (
    <div className="relative w-full h-[500px] flex flex-col justify-center items-center text-white text-center p-8 bg-gradient-to-b from-[#000000] to-[#070989]">
      <div className="z-10">
        <h1 className="text-5xl font-bold mb-4">
          Dentist Booking System
        </h1>
        <p className="text-2xl font-semibold mb-8">
          Atomic Group
        </p>

        {
          isAdmin ?
          <p className='text-xl text-semibold mb-2'>You're using Moderator Account <span className='font-bold'>{session?.user.name} ({session?.user.email})</span></p>
          :
          bookings && bookings.count >= 1 ?
          <p className='text-xl text-semibold mb-2'>It's look like you have already booked an appointment</p>
          : null
        }

        <Link href='/booking'>
          <button className="cursor-pointer bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300 shadow-lg active:scale-95">
            {isAdmin ? 'Manage Bookings' : (bookings && bookings.count >= 1 ? 'Check Your Booking' : 'BOOK NOW')}
          </button>
        </Link>
      </div>


      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        {/* <Image src="/path-to-your-bg.jpg" fill alt="background" className="object-cover" /> */}
      </div>
    </div>
  );
}