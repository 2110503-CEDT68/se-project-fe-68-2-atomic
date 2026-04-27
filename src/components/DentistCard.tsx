import Image from "next/image";
import { Rating } from "@mui/material";

export default function DentistCard({ imgSrc, dentistName, dentistExpertise, dentistExperience, rating }: { imgSrc: string, dentistName: string, dentistExpertise: string, dentistExperience: number, rating: number }) {
    return (
        <div className="w-[300px] sm:w-[280px] md:w-[300px] h-[400px] rounded-2xl shadow-lg bg-white overflow-hidden m-4 transition-transform hover:scale-[1.02] flex-shrink-0">
            <div className="w-full h-[60%] relative">
                <Image src={imgSrc} alt={dentistName} fill={true} className="object-cover" />
            </div>
            <div className="p-4 h-[40%] flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{dentistName}</h3>
                <div className="flex flex-col justify-center text-left mt-2">
                    <p className="text-sm font-semibold text-gray-800">Expertise: <span className="font-normal">{dentistExpertise}</span></p>
                    <p className="text-sm font-semibold text-gray-800 mt-2">Years of Experience: <span className="font-normal">{dentistExperience} {dentistExperience === 1 ? 'year' : 'years'}</span></p>
                    <div className="flex flex-row my-2 items-center">
                        {/* <h1 className="mr-1 font-bold">{rating}</h1> */}
                        <Rating defaultValue={rating} precision={0.1} readOnly />
                    </div>
                </div>
            </div>
        </div>
    )
}