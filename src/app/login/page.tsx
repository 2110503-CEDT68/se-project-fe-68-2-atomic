import LoginPanel from "@/components/LoginPanel";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default function Login() {
    return (
        <Suspense fallback={<Loading />}>
            <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#000000] to-[#070989] flex justify-center items-center p-4">
                <LoginPanel />
            </div>
        </Suspense>
    )
}