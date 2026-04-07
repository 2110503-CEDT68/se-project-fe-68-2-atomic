import getUserProfile from "@/libs/getUserProfile"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

export default async function ProfilePanel() {
    const session = await getServerSession(authOptions)
    if(!session || !session.user.token) redirect('/login')
    
    const profile = await getUserProfile(session!.user.token)

    return (
        <div className="bg-white w-fit min-w-[320px] sm:min-w-[500px] max-w-[95vw] p-6 sm:p-10 rounded-[2rem] shadow-2xl text-center mx-auto">
            <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-black">
                    Your Profile
                </h1>
                <table className="text-left w-full border-separate border-spacing-y-2">
                    <tbody>
                        <tr>
                            <td className="text-lg sm:text-2xl font-bold min-w-[80px] sm:min-w-[120px] pb-4 align-top">Name: </td>
                            <td className="text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-words">{profile.data.name}</td>
                        </tr>
                        <tr>
                            <td className="text-lg sm:text-2xl font-bold min-w-[80px] sm:min-w-[120px] pb-4 align-top">Phone: </td>
                            <td className="text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-words">{profile.data.telephone}</td>
                        </tr>
                        <tr>
                            <td className="text-lg sm:text-2xl font-bold min-w-[80px] sm:min-w-[120px] pb-4 align-top">Email: </td>
                            <td className="text-lg sm:text-2xl font-medium text-gray-800 pb-4 break-all">{profile.data.email}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="pt-4">
                    <Link href="/logout">
                        <button className="cursor-pointer bg-black text-white font-bold py-2 px-8 rounded-full hover:bg-gray-800 transition active:scale-95">
                            Log Out
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}