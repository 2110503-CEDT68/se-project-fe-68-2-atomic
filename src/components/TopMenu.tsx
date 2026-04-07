import Link from 'next/link';
import TopMenuItem from './TopmenuItems';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Image from 'next/image';

export default async function TopMenu() {
  const session = await getServerSession(authOptions)
  const sessionLink = session ? '/profile' : '/login'
  
  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-100/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Section: Logo & Mobile Toggle */}
        <div className="flex items-center gap-4 md:gap-10">
          <input type="checkbox" id="mobile-menu" className="peer hidden" />
          <label htmlFor="mobile-menu" className="md:hidden cursor-pointer text-gray-600 hover:text-black">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>

          <Link href="/">
            <Image className="w-8 h-8" src="/icon.png" alt="Logo" width={32} height={32} />
          </Link>

          {/* Menu Items */}
          <div className="hidden peer-checked:flex md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white shadow-md md:shadow-none p-4 md:p-0 border-b md:border-0 border-gray-100 gap-2 md:gap-6 z-40">
             <TopMenuItem title='Home' pageref='/'/>
             <TopMenuItem title='Dentists' pageref='/dentists'/>
             <TopMenuItem title='Booking' pageref='/booking'/>
          </div>
        </div>

        {/* Right Section: User / Login */}
        <div className="flex items-center h-full cursor-pointer group">
          <Link href={`${sessionLink}`} className="flex flex-row items-center">
            {
              session ? <div className='text-sm font-semibold text-gray-800 flex items-center justify-center mx-2 group-hover:underline'>{session.user.name}</div> 
              : <div className='text-sm font-semibold text-gray-800 mx-2 flex items-center justify-center group-hover:underline'>Log In</div>
            }
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white/50 overflow-hidden">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>

      </div>
    </nav>
  );
}