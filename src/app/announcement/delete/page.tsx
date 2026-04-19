import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { redirect } from "next/navigation";
import EditAnnouncementPanel from "@/components/EditAnnouncementPanel";
import getAnnouncement from "@/libs/getAnnouncement";