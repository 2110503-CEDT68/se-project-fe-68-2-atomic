'use client'
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AnnouncementNotFound() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/announcement');
        }, 2000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="font-bold text-3xl flex flex-col items-center justify-center h-screen gap-4">
            <CircularProgress size={60} thickness={4} />
            <p>ERROR 404 | Not Found</p>
            <p className="font-medium text-xl">Returning to Announcement page...</p>
        </div>
    );
}
