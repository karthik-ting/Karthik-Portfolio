import type { ReactNode } from "react"
import { asset } from "@/lib/utils"

/** Opens the in-site /cv viewer (Back and Download buttons on top) in a new tab. */
export function CvLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a href={asset("/cv/")} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
