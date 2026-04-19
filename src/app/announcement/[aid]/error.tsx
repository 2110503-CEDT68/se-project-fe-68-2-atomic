'use client'
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AnnouncementError() {
    const router = useRouter();
    setTimeout(() => {
        router.push('/announcement')
    }, 1000);
    return (
        <div className="font-bold text-3xl flex flex-col items-center justify-center h-screen gap-4">
            <CircularProgress size={60} thickness={4} />
            ERROR occured, Returning to Announcement List...
        </div>
    )
}