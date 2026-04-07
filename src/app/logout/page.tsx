import LogoutPanel from "@/components/LogoutPanel";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function Logout(){
    return(
        <Suspense fallback={<Loading/>}>
            <div className="min-h-screen bg-gradient-to-b from-[#000000] to-[#929292] flex justify-center items-center p-4">
                <LogoutPanel/>
            </div>
        </Suspense>
    )
}