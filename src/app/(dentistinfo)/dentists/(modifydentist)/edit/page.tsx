import EditDentistPanel from "@/components/EditDentist";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import getDentist from "@/libs/getDentist";
import Loading from "@/components/Loading";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function EditDentistPage({searchParams} : {searchParams: Promise<{did: string}>}){
    const { did } = await searchParams
    if(!did) redirect('/dentists')
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user.role === 'admin'
    const token = session?.user.token
    const dentistData = await getDentist(did)

    if(!isAdmin) redirect('/login')

    return(
        <Suspense fallback={<Loading/>}>
            <main className={`min-h-screen bg-[#838383] flex flex-col`}>
                <EditDentistPanel dentistJsonReady={dentistData} token={token || ""}/>
            </main>
        </Suspense>
    )
}