'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopMenuItem({title,pageref}:{title:string, pageref:string}){
	const pathname = usePathname();
	
	// Robust matching: Exact match or starts with pageref + '/' (to catch sub-paths)
	const lowerPath = pathname.toLowerCase();
	const lowerRef = pageref.toLowerCase();
	const isActive = pageref === '/' 
		? lowerPath === '/' 
		: lowerPath === lowerRef || lowerPath.startsWith(lowerRef + '/');

	return (
		<Link 
			href={pageref} 
			className={`${isActive ? 'text-black font-bold' : 'text-gray-600 font-medium'} hover:text-black hover:bg-gray-100 px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base whitespace-nowrap`} 
			prefetch={true}
		>
			{title}
		</Link>
	)
}