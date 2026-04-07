import EditBooking from "@/components/EditBooking"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { redirect } from "next/navigation"
import getBooking from "@/libs/getBooking"

export default async function EditBookingPage({ searchParams }: { searchParams: Promise<{ bid?: string }> }) {
	const { bid } = await searchParams;
	const session = await getServerSession(authOptions)
	if (!session || !session.user.token) redirect('/login')

	const bookingId = bid ?? ''
	const booking = await getBooking(bookingId, session.user.token)
	const isAdmin = session.user.role === 'admin'

	return (
		<main className={`min-h-screen ${isAdmin ? 'bg-[#838383]' : 'bg-gradient-to-b from-[#B7FFFB] to-[#FFFFFF]'} flex flex-col`}>
			<EditBooking bookingJsonReady={booking} token={session.user.token} />
		</main>
	)
}