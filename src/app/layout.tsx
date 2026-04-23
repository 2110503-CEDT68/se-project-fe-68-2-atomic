import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sukhumvit = localFont({
  src: "../../public/fonts/SukhumvitSet-Medium.ttf",
  variable: "--font-sukhumvit",
});

export const metadata: Metadata = {
  title: "Dentist Booking App",
  description: "Developed by Gucode Group",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sukhumvit.variable} antialiased`}>
        <NextAuthProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <TopMenu />
            {children}
          </AppRouterCacheProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
