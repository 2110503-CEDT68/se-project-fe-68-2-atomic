'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircularProgress, Rating } from "@mui/material";
import deleteDentist from "@/libs/deleteDentist";

export default function DentistDetail({dentistJsonReady, did, isAdmin, hasBooking, token, isEditView = false}: {dentistJsonReady: DentistJsonSingle, did: string, isAdmin: boolean, hasBooking: boolean, token?: string, isEditView?: boolean;}) {
    const router = useRouter();
    
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRemove = async () => {
        if (!token) return;
        
        if (confirm("Are you sure you want to remove this dentist?")) {
            setIsDeleting(true);
            try {
                await deleteDentist(did, token);
                router.push('/dentists');
                router.refresh();
            } catch (error) {
                setIsDeleting(false);
                alert("Failed to remove dentist.");
                console.error(error);
            }
        }
    };

    return (
        <div className="bg-white flex flex-col justify-center py-10 m-10">
            <main className="max-w-6xl mx-auto px-8 w-full">
                
                {isDeleting ? (
                    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in py-32">
                        <CircularProgress/>
                        <p className="text-2xl font-bold text-black">Deleting Dentist...</p>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12 animate-fade-in">

                        {/* Image Section */}
                        <div className="w-full md:w-1/3 max-w-[300px] md:max-w-[400px] aspect-square relative bg-white border-2 border-black rounded-[2rem] overflow-hidden flex items-center justify-center p-8 shadow-inner">
                            <Image
                                src={dentistJsonReady.data.imageURL}
                                alt="Dentist Picture"
                                fill={true}
                                className="object-cover"
                            />
                        </div>

                        {/* Info Section */}
                        <div className="flex-grow pt-4 w-full md:w-auto">
                            <h1 className="text-3xl md:text-5xl font-bold text-black mb-6">
                                {dentistJsonReady.data.name}
                            </h1>

                            <p className="text-xl md:text-2xl font-bold text-black mb-4 flex flex-wrap gap-x-4">
                                Area of Expertise:
                                <span className="font-normal">{dentistJsonReady.data.areaOfExpertise}</span>
                            </p>

                            <p className="text-xl md:text-2xl font-bold text-black mb-4 flex flex-wrap gap-x-4">
                                Years of Experience:
                                <span className="font-normal">
                                    {dentistJsonReady.data.yearsOfExperience} {dentistJsonReady.data.yearsOfExperience === 1 ? "year" : "years"}
                                </span>
                            </p>

                            <div className="flex flex-row my-2 items-center mb-10">
                                <h1 className="text-xl font-bold mr-2">{dentistJsonReady.data.averageRating.toFixed(1)}</h1>
                                <Rating name="half-rating-read" defaultValue={dentistJsonReady.data.averageRating} precision={0.1} readOnly />
                            </div>

                            {/* Action Buttons */}
                            {
                                isAdmin ? (
                                    <div className="flex flex-wrap gap-4">
                                        <Link href={`/dentists/edit?did=${did}`} className="w-full sm:w-auto">
                                            <button className="w-full cursor-pointer bg-black text-white text-xl font-bold py-3 px-12 rounded-full border border-gray-200 shadow-md hover:bg-gray-800 transition active:scale-95">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={handleRemove}
                                            className="w-full sm:w-auto cursor-pointer bg-red-500 text-white text-xl font-bold py-3 px-8 rounded-full shadow-md hover:bg-red-700 transition active:scale-95">
                                            Remove
                                        </button>
                                    </div>
                                ) : hasBooking ? (
                                    <div>
                                        <p className='text-lg font-bold text-red-500 mb-2'>YOU ALREADY HAVE A BOOKING</p>
                                        <Link href='/booking'>
                                            <button className="cursor-pointer bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-800 transition shadow-lg active:scale-95">
                                                Check Your Booking
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Link href={`/booking?did=${did}`} className="w-full sm:w-auto">
                                        {!isEditView && (
                                            <button className="cursor-pointer bg-black text-white text-xl font-bold py-3 px-10 rounded-full border border-gray-200 shadow-md hover:bg-gray-800 transition active:scale-95">
                                                Book Now
                                            </button>
                                        )}
                                    </Link>
                                )
                            }
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}