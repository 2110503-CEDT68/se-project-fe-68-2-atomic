import ProfilePanel from "@/components/ProfilePanel";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function Profile() {
    return (
        <Suspense fallback={<Loading />}>
            <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#F05959] to-[#FFFFFF] flex justify-center items-center p-4">
                <ProfilePanel />
            </div>
        </Suspense>
    )
}