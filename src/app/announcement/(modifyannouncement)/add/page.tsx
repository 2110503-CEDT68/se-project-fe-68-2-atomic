import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { redirect } from "next/navigation";
import AddAnnouncementPanel from "@/components/AddAnnouncementPanel";

export default async function AddDentist(){
    const session = await getServerSession(authOptions)
    const token = session?.user.token 
    const isAdmin = session?.user.role === 'admin'

    if(!isAdmin) redirect('/announcement')

    return(
        <Suspense fallback={<Loading/>}>
            <main className={`min-h-screen bg-[#838383] flex flex-col`}>
                <AddAnnouncementPanel token={token}/> 
            </main>
        </Suspense>
    )
}