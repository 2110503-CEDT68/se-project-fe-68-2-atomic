import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Loading from "@/components/Loading";
import getDentist from "@/libs/getDentist";
import getReview from "@/libs/getReview"; 
import { getServerSession } from "next-auth";
import { Suspense } from "react";
// import DentistDetail from "@/components/DentistDetail"; // ถ้าไม่ได้ใช้ในหน้านี้ ลบออกได้ครับ
import EditReviewForm from "@/components/EditReviewForm";
import { redirect } from "next/navigation";

export default async function EditReviewPage({ params }: { params: Promise<{ did: string, rid: string }> }) {
    const { did, rid } = await params;
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');
    const review = await getReview(rid); 

    const reviewUserId = typeof review.data.user === 'object' 
        ? review.data.user._id 
        : review.data.user;

    if (session.user.role !== 'admin' && session.user.id !== reviewUserId) {
        redirect(`/dentists/${did}`);
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex items-center justify-center min-h-[80vh] p-4">
                <div className="w-full max-w-4xl">
                    <EditReviewForm 
                        initialData={review.data} 
                        token={session.user.token} 
                        did={did} 
                        rid={rid} 
                    />
                </div>
            </div>
        </Suspense>
    );
}