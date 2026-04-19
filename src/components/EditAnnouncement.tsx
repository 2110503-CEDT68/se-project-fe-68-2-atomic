"use client"
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { revalidateAnnouncement } from "@/libs/revalidate";
import { TextField, CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import updateAnnouncement from "@/libs/updateAnnouncement";

// 📌 ฟังก์ชันดั้งเดิมของคุณ สำหรับแปลงลิงก์ Drive
const transformDriveLink = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
        const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
};

const formatText = (text: string) => {
    if (!text) return '';
    return text
        .replace(/\\n/g, '<br />')
        .replace(/\n/g, '<br />')
        .replace(/\\t|\t/g, '<span class="ml-8 inline-block"></span>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default function EditAnnouncementPanel({ token, aid, initialData }: { token: string, aid: string, initialData: any }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const [title, setTitle] = useState(initialData.title);
    const [description, setDescription] = useState(initialData.description);
    const [logoURL, setLogoURL] = useState(initialData.logoURL);
    const [bannerURL, setBannerURL] = useState(initialData.bannerURL);
    
    const [step, setStep] = useState(1); // 1 = Edit, 2 = Preview
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            await updateAnnouncement(aid, title, description, logoURL, bannerURL, token);
            await revalidateAnnouncement(aid);
            router.refresh();
            router.push(callbackUrl || "/announcement/manage");
        } catch (error) {
            console.error(error);
            setIsUpdating(false);
        }
    };

    return (
        <div className="!w-full !min-h-screen flex flex-col pt-12 pb-20 px-4 sm:px-8 font-sukhumvit bg-[#838383]">
            
            <main className="max-w-6xl mx-auto w-full bg-white p-10 sm:p-16 rounded-[3rem] shadow-sm border border-slate-200">
                {isUpdating ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-20">
                        <CircularProgress size={60} thickness={4} />
                        <p className="text-2xl font-bold text-slate-900">Updating Announcement...</p>
                    </div>
                ) : (
                    <>
                        {/* Navigation */}
                        <div className="mb-12">
                            <button 
                                onClick={() => step === 1 ? router.back() : setStep(1)} 
                                className="inline-flex items-center text-slate-400 hover:text-slate-900 font-bold text-lg transition-all group cursor-pointer"
                            >
                                <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                {step === 1 ? 'Cancel' : 'Back to Edit'}
                            </button>
                        </div>

                        {/* --- Step 1: Edit Form --- */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="mb-16 text-center">
                                    <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Edit Announcement</h1>
                                </div>
                                
                                <div className="flex flex-col gap-10">
                                    {/* Title Row */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-md font-bold text-slate-400 ml-1 uppercase tracking-wider">Announcement Title</label>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            sx={{ 
                                                "& .MuiOutlinedInput-root": { borderRadius: "1.25rem", backgroundColor: "#ffffff", fontSize: "1.25rem", fontWeight: "medium" }
                                            }}
                                        />
                                    </div>

                                    {/* IDs & Previews Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="flex flex-col gap-3">
                                            <TextField
                                                label="Logo ID (Drive)"
                                                variant="outlined"
                                                fullWidth
                                                value={logoURL}
                                                onChange={(e) => setLogoURL(e.target.value)}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1.25rem", backgroundColor: "#ffffff" } }}
                                            />
                                            <div className="w-full aspect-video flex items-center justify-center relative overflow-hidden rounded-2xl border border-slate-50">
                                                {logoURL ? <Image src={transformDriveLink(logoURL)} alt="logo preview" fill className="object-contain" unoptimized /> : <span className="text-slate-300 font-bold uppercase tracking-widest text-sm italic">Logo Preview</span>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <TextField
                                                label="Banner ID (Drive)"
                                                variant="outlined"
                                                fullWidth
                                                value={bannerURL}
                                                onChange={(e) => setBannerURL(e.target.value)}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1.25rem", backgroundColor: "#ffffff" } }}
                                            />
                                            <div className="w-full aspect-video flex items-center justify-center relative overflow-hidden rounded-2xl border border-slate-50">
                                                {bannerURL ? <Image src={transformDriveLink(bannerURL)} alt="banner preview" fill className="object-contain" unoptimized /> : <span className="text-slate-300 font-bold uppercase tracking-widest text-sm italic">Banner Preview</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Row */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-wider">Detailed Description</label>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={10}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1.5rem", backgroundColor: "#ffffff" } }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-16 flex justify-end">
                                    <button 
                                        onClick={() => setStep(2)}
                                        className="bg-slate-900 text-white px-12 py-2 rounded-full font-extrabold hover:bg-slate-800 transition-all active:scale-95 shadow-lg text-lg cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- Step 2: Before & After Preview (Stacked Style) --- */}
                        {step === 2 && (
                            <div className="animate-in fade-in zoom-in-95 duration-500">
                                <div className="mb-14 text-center">
                                    <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Review Changes</h1>
                                    <p className="text-slate-500">Compare current and updated versions before confirming.</p>
                                </div>

                                <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                                    
                                    {/* 📌 Before (Top) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded">Current Version</span>
                                            <div className="flex-1 h-px bg-slate-100"></div>
                                        </div>
                                        <div className="p-8 border border-slate-200 rounded-[2rem] opacity-60 bg-slate-50/50 grayscale-[30%]">
                                            <h3 className="text-2xl font-bold mb-6 text-slate-800" dangerouslySetInnerHTML={{ __html: formatText(initialData.title) }} />
                                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-white border border-slate-100">
                                                <Image src={transformDriveLink(initialData.bannerURL)} alt="before" fill className="object-contain p-2" unoptimized />
                                            </div>
                                            <p className="text-slate-600 leading-relaxed line-clamp-3 italic" dangerouslySetInnerHTML={{ __html: formatText(initialData.description) }} />
                                        </div>
                                    </div>

                                    {/* Divider Arrow */}
                                    <div className="flex justify-center -my-6 relative z-10">
                                        <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg shadow-blue-200">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* 📌 After (Bottom) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded">Updated Version</span>
                                            <div className="flex-1 h-px bg-blue-100"></div>
                                        </div>
                                        <div className="p-8 border-2 border-blue-500 rounded-[2rem] bg-blue-50/10 shadow-xl shadow-blue-100/50 relative">
                                            <div className="absolute top-6 right-8 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Draft Preview</div>
                                            <h3 className="text-2xl font-bold mb-6 text-slate-900" dangerouslySetInnerHTML={{ __html: formatText(title) }} />
                                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-white shadow-inner">
                                                <Image src={transformDriveLink(bannerURL)} alt="after" fill className="object-contain p-2" unoptimized />
                                            </div>
                                            <p className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(description) }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Final Action Area */}
                                <div className="mt-20 flex flex-col items-center border-t border-slate-100 pt-12">
                                    <button 
                                        onClick={handleUpdate}
                                        disabled={isUpdating}
                                        className="bg-blue-600 text-white px-12 py-3 rounded-full font-black text-xl hover:bg-blue-700 transition-all active:scale-95 shadow-2xl shadow-blue-200 flex items-center justify-center min-w-[320px] cursor-pointer"
                                    >
                                        {isUpdating ? <CircularProgress size={28} color="inherit" /> : "Confirm & Save Changes"}
                                    </button>
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="mt-6 text-slate-400 font-bold hover:text-slate-900 transition-colors py-2 cursor-pointer"
                                    >
                                        Go back
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}