import RegisterPanel from "@/components/RegisterPanel"
import Loading from "@/components/Loading"
import { Suspense } from "react"

export default function RegisterPage() {
	return (
		<Suspense fallback={<Loading />}>
			<div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#000000] to-[#800000] flex justify-center items-center p-4">
				<RegisterPanel />
			</div>
		</Suspense>
	)
}