import type { Metadata } from "next"
import { CvViewer } from "@/components/cv/CvViewer"

export const metadata: Metadata = {
  title: "Resume | Karthik Manche",
  description: "Resume of Karthik Manche, software developer and data analyst based in Navi Mumbai.",
}

export default function CvPage() {
  return <CvViewer />
}
