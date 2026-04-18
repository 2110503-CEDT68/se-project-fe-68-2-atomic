'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, TextField } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import addAnnouncement from '@/libs/addAnnouncement';

// 📌 ฟังก์ชันที่คุณสั่งล็อกไว้ (ใช้ 0{fileId} แบบเป๊ะๆ)
const transformDriveLink = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
      return `https://lh3.googleusercontent.com/d/${fileId}`; 
    }
    return url;
};

const monthMap: Record<string, string> = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = monthMap[String(dateObj.getMonth() + 1).padStart(2, '0')];
    const year = dateObj.getFullYear();
    let hour = dateObj.getHours();
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12; else if (hour > 12) hour -= 12;
    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hour}:${minute} ${period}`;
};

const formatText = (text: string) => {
    if (!text) return '';
    return text
        .replace(/\\n/g, '<br />')
        .replace(/\\t/g, '<span class="ml-8 inline-block"></span>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

export default function AddAnnouncementPanel({ token }: { token: any }) {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [logoURL, setLogoURL] = useState('');
    const [bannerURL, setBannerURL] = useState('');

    const [step, setStep] = useState(1); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step, success]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!token) {
            setError('You must be logged in to perform this action.');
            setStep(1);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await addAnnouncement(
                title,
                description,
                logoURL,
                bannerURL,
                token
            );
            
            setIsLoading(false);
            setSuccess(true);
            router.refresh(); 
        } catch (err: any) {
            setIsLoading(false);
            setError('Failed to add announcement. Please try again.');
            setStep(1); 
        }
    };

    const AuthorIcon = () => (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M850.662,877.56c-0.77,0.137-4.372,0.782-10.226,1.831c-230.868,41.379-273.337,48.484-278.103,49.037 c-11.37,1.319-19.864,0.651-25.976-2.042c-3.818-1.682-5.886-3.724-6.438-4.623c0.268-1.597,2.299-5.405,3.539-7.73 c1.207-2.263,2.574-4.826,3.772-7.558c7.945-18.13,2.386-36.521-14.51-47.999c-12.599-8.557-29.304-12.03-49.666-10.325 c-12.155,1.019-225.218,36.738-342.253,56.437l-57.445,45.175c133.968-22.612,389.193-65.433,402.622-66.735 c11.996-1.007,21.355,0.517,27.074,4.4c3.321,2.257,2.994,3.003,2.12,4.997c-0.656,1.497-1.599,3.264-2.596,5.135 c-3.835,7.189-9.087,17.034-7.348,29.229c1.907,13.374,11.753,24.901,27.014,31.626c8.58,3.78,18.427,5.654,29.846,5.654 c4.508,0,9.261-0.292,14.276-0.874c9.183-1.065,103.471-17.67,280.244-49.354c5.821-1.043,9.403-1.686,10.169-1.821 c9.516-1.688,15.861-10.772,14.172-20.289S860.183,875.87,850.662,877.56z" />
            <path d="M231.14,707.501L82.479,863.005c-16.373,17.127-27.906,38.294-33.419,61.338l211.087-166.001 c66.081,29.303,118.866,38.637,159.32,38.637c71.073,0,104.065-28.826,104.065-28.826c-66.164-34.43-75.592-98.686-75.592-98.686 c50.675,21.424,156.235,46.678,156.235,46.678c140.186-93.563,213.45-296.138,213.45-296.138 c-14.515,3.99-28.395,5.652-41.475,5.652c-65.795,0-111-42.13-111-42.13l183.144-39.885C909.186,218.71,915.01,0,915.01,0 L358.176,495.258C295.116,551.344,250.776,625.424,231.14,707.501z" />
        </svg>
    );

    // 📌 บังคับใช้ฟอนต์และปรับความหนาให้เหมือนหน้า Edit
    const inputStyle = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "1.25rem",
            backgroundColor: "#f8fafc",
            fontSize: "1rem", // ขนาดมาตรฐาน
            fontWeight: "500", // ความหนาปกติ ไม่อ้วน
            fontFamily: "var(--font-sukhumvit), sans-serif", 
            "& fieldset": { borderColor: "transparent" },
            "&:hover fieldset": { borderColor: "#e2e8f0" },
            "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
        }
    };

    if (success) {
        return (
            <div className="!w-full !min-h-screen flex flex-col pt-12 pb-20 px-4 sm:px-8 font-sukhumvit bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
                <main className="max-w-4xl mx-auto w-full bg-white p-12 sm:p-20 rounded-[3rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Created Successfully!</h1>
                    <p className="text-slate-500 text-lg mb-12 font-medium">Your new announcement has been published to the clinic board.</p>
                    <button 
                        onClick={() => router.push('/announcement/manage')}
                        className="bg-slate-900 text-white px-12 py-4 rounded-full font-black text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                    >
                        Go to Dashboard
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="!w-full !min-h-screen flex flex-col pt-12 pb-20 px-4 sm:px-8 font-sukhumvit bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
            
            <main className="max-w-6xl mx-auto w-full bg-white p-10 sm:p-16 rounded-[3rem] shadow-sm border border-slate-200">
                
                {/* Navigation */}
                <div className="mb-12">
                    <button 
                        onClick={() => step === 1 ? router.push('/announcement/manage') : setStep(1)} 
                        className="inline-flex items-center text-slate-400 hover:text-slate-900 font-bold text-lg transition-all group"
                    >
                        <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {step === 1 ? 'Cancel' : 'Back to Edit'}
                    </button>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center font-bold animate-in fade-in">
                        {error}
                    </div>
                )}

                {/* --- Step 1: Add Form --- */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-16 text-center">
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Add New Announcement</h1>
                        </div>
                        
                        <div className="flex flex-col gap-12">
                            {/* Title */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-400 ml-1 uppercase tracking-widest">Announcement Title</label>
                                {/* 📌 ปรับ sx ของ Title ให้ใช้ inputStyle ธรรมดา เหมือนกับในหน้า Edit */}
                                <TextField 
                                    multiline rows={2} fullWidth required
                                    value={title} onChange={(e) => setTitle(e.target.value)} 
                                    sx={inputStyle} 
                                />
                            </div>

                            {/* ID Previews */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-black text-slate-400 ml-1 uppercase tracking-widest">Logo ID</label>
                                    <TextField fullWidth required value={logoURL} onChange={(e) => setLogoURL(e.target.value)} sx={inputStyle} />
                                    <div className="w-full aspect-video flex items-center justify-center relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                                        {logoURL ? <Image src={transformDriveLink(logoURL)} alt="logo" fill className="object-contain p-4" unoptimized /> : <span className="text-slate-300 italic text-sm font-medium">Logo Preview</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-black text-slate-400 ml-1 uppercase tracking-widest">Banner ID</label>
                                    <TextField fullWidth required value={bannerURL} onChange={(e) => setBannerURL(e.target.value)} sx={inputStyle} />
                                    <div className="w-full aspect-video flex items-center justify-center relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                                        {bannerURL ? <Image src={transformDriveLink(bannerURL)} alt="banner" fill className="object-contain p-4" unoptimized /> : <span className="text-slate-300 italic text-sm font-medium">Banner Preview</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-400 ml-1 uppercase tracking-widest">Detailed Description</label>
                                <TextField multiline rows={10} fullWidth required value={description} onChange={(e) => setDescription(e.target.value)} sx={inputStyle} />
                            </div>
                        </div>

                        <div className="mt-16 flex justify-end">
                            <button 
                                onClick={() => {
                                    if (!title || !description || !logoURL || !bannerURL) {
                                        setError('Please fill in all required fields.');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        return;
                                    }
                                    setError(null);
                                    setStep(2);
                                }} 
                                className="bg-slate-900 text-white px-14 py-4 rounded-full font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg flex items-center gap-3 text-lg"
                            >
                                Next <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* --- Step 2: Preview --- */}
                {step === 2 && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <div className="mb-14 text-center">
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Review Announcement</h1>
                            <p className="text-slate-500 text-lg font-medium">Check how your announcement will look before publishing.</p>
                        </div>

                        <div className="flex flex-col gap-16 max-w-5xl mx-auto">
                            {/* Preview Card */}
                            <div className="relative p-8 border-2 border-blue-500 rounded-[2.5rem] bg-blue-50/10 shadow-2xl">
                                <span className="absolute -top-4 left-8 bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-200">Live Preview</span>
                                
                                <div className="text-3xl my-2 mt-4">
                                    <h1 className="inline font-bold" dangerouslySetInnerHTML={{ __html: formatText(title) }} />
                                </div>
                                <div className="font-semibold opacity-50 space-y-1">
                                    <div className="flex items-center text-slate-700">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        Date: {formatDate(new Date().toISOString())}
                                    </div>
                                    <div className="flex flex-row items-center mt-1 text-slate-700">
                                        <AuthorIcon />
                                        <h1 className="inline">Author: Admin</h1>
                                    </div>
                                </div>
                                
                                <div className="relative w-full aspect-video overflow-hidden my-8 rounded-2xl border border-gray-100 bg-white shadow-inner">
                                    <Image src={transformDriveLink(bannerURL)} alt="banner" fill className="object-contain p-4" unoptimized />
                                </div>
                                
                                <div className="text-gray-700 leading-relaxed">
                                    <p className="text-lg font-medium text-left" dangerouslySetInnerHTML={{ __html: formatText(description) }} />
                                </div>
                            </div>
                        </div>

                        {/* Final Actions */}
                        <div className="mt-20 flex flex-col items-center border-t border-slate-100 pt-12">
                            <button 
                                onClick={handleSubmit} 
                                disabled={isLoading} 
                                className="bg-blue-600 text-white px-20 py-5 rounded-full font-black text-xl hover:bg-blue-700 transition-all active:scale-95 shadow-2xl flex items-center justify-center min-w-[320px]"
                            >
                                {isLoading ? <CircularProgress size={28} color="inherit" /> : "Confirm & Create"}
                            </button>
                            <button onClick={() => setStep(1)} className="mt-6 text-slate-400 font-bold hover:text-slate-900 transition-colors py-2">Go back and edit</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}