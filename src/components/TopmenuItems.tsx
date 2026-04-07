import Link from "next/link";

export default function TopMenuItem({title,pageref}:{title:string, pageref:string}){
	return (
		<Link href={pageref} className="text-gray-600 font-medium hover:text-black hover:bg-gray-100 px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base whitespace-nowrap" prefetch={true}>{title}</Link>
	)
}