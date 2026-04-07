import DentistPanel from "@/components/DentistPanel";
import Loading from "@/components/Loading";
import getDentists from "@/libs/getDentists";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function Dentsits(){
    const dentists = await getDentists()

    const session = await getServerSession(authOptions)
    const isAdmin = session?.user.role === 'admin'

    return(
        <Suspense fallback={<Loading/>}>
            <div className="text-center p-5">
                <DentistPanel dentistJsonReady={dentists} isAdmin={isAdmin} showSearch={true}/>
            </div>
        </Suspense>
    )
}