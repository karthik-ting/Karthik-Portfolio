"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import "pdfjs-dist/web/pdf_viewer.css"
import { asset } from "@/lib/utils"
import { CV_FILENAME, CV_PATH, NAME } from "@/data/portfolio"


type Status = "loading" | "ready" | "error"

/**
 * Desktop browsers show the PDF in their own viewer. Touch browsers can't preview PDFs
 * inline (iOS shows page one, Android downloads), so there the CV is drawn page by page
 * with pdf.js, with a selectable text layer and clickable links so it still behaves like a PDF.
 */
export function CvViewer() {
  const router = useRouter()
  const pagesRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>("loading")
  // null until we know whether the browser can show PDFs natively (touch devices can't).
  const [native, setNative] = useState<boolean | null>(null)
  const pdfUrl = asset(CV_PATH)

  useEffect(() => {
    setNative(!window.matchMedia("(pointer: coarse)").matches)
  }, [])

  useEffect(() => {
    if (native !== false) return
    let cancelled = false
    let destroy: (() => void) | undefined

    async function render() {
      // Legacy build: still runs on older iOS Safari versions.
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString()

      const task = pdfjs.getDocument(pdfUrl)
      destroy = () => void task.destroy()
      const pdf = await task.promise
      const container = pagesRef.current
      if (cancelled || !container) return

      const width = container.clientWidth
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      container.replaceChildren()

      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n)
        if (cancelled) return
        const cssScale = width / page.getViewport({ scale: 1 }).width
        const cssViewport = page.getViewport({ scale: cssScale })
        const viewport = page.getViewport({ scale: cssScale * dpr })

        const wrap = document.createElement("div")
        wrap.className = "cv-page"
        wrap.style.width = `${cssViewport.width}px`
        wrap.style.height = `${cssViewport.height}px`

        const canvas = document.createElement("canvas")
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        canvas.className = "cv-page__canvas"
        canvas.setAttribute("aria-hidden", "true")
        wrap.appendChild(canvas)

        const textDiv = document.createElement("div")
        textDiv.className = "textLayer"
        textDiv.style.setProperty("--total-scale-factor", String(cssScale))
        textDiv.style.setProperty("--scale-factor", String(cssScale))
        wrap.appendChild(textDiv)
        container.appendChild(wrap)

        await page.render({ canvas, viewport }).promise
        const text = new pdfjs.TextLayer({
          textContentSource: page.streamTextContent(),
          container: textDiv,
          viewport: cssViewport,
        })
        await text.render()

        // Clickable links (mailto, GitHub, live sites) on top of the text.
        for (const a of await page.getAnnotations()) {
          if (a.subtype !== "Link" || !a.url) continue
          const [x1, y1, x2, y2] = cssViewport.convertToViewportRectangle(a.rect)
          const link = document.createElement("a")
          link.href = a.url
          link.target = "_blank"
          link.rel = "noopener noreferrer"
          link.setAttribute("aria-label", a.url)
          Object.assign(link.style, {
            position: "absolute",
            left: `${Math.min(x1, x2)}px`,
            top: `${Math.min(y1, y2)}px`,
            width: `${Math.abs(x2 - x1)}px`,
            height: `${Math.abs(y2 - y1)}px`,
            zIndex: "2",
          })
          wrap.appendChild(link)
        }
        if (n === 1) setStatus("ready")
      }
    }

    render().catch(() => !cancelled && setStatus("error"))
    return () => {
      cancelled = true
      destroy?.()
    }
  }, [pdfUrl, native])

  // iOS Safari and in-app browsers ignore <a download> on a plain link, so fetch the
  // file and hand it over as a blob: the share sheet where available, else a blob link.
  async function downloadCv(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    try {
      const res = await fetch(pdfUrl)
      if (!res.ok) throw new Error(String(res.status))
      const blob = new Blob([await res.blob()], { type: "application/pdf" })
      const file = new File([blob], CV_FILENAME, { type: "application/pdf" })
      const isTouch = window.matchMedia("(pointer: coarse)").matches
      if (isTouch && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: `${NAME} Resume` })
        } catch (err) {
          if ((err as Error).name !== "AbortError") throw err
        }
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = CV_FILENAME
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 30_000)
    } catch {
      window.location.assign(pdfUrl)
    }
  }

  // Return to the portfolio if we came from it; otherwise (direct link) go home.
  function goBack() {
    const fromSite = document.referrer && new URL(document.referrer).origin === window.location.origin
    if (fromSite && window.history.length > 1) router.back()
    else router.push("/")
  }

  return (
    <main className="cv">
      <header className="cv__header">
        <span aria-hidden="true" className="cv__hairline" />
        <div className="cv__bar">
          <button
            type="button"
            onClick={goBack}
            className="cv__back"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <p className="cv__title">{NAME} · Resume</p>
          <a
            href={pdfUrl}
            download={CV_FILENAME}
            onClick={downloadCv}
            aria-label="Download CV"
            className="cv__download"
          >
            <Download size={16} />
            <span className="cv__download-label">Download</span>
          </a>
        </div>
      </header>

      {native && (
        <iframe
          src={pdfUrl}
          title={`${NAME} Resume`}
          className="cv__frame"
        />
      )}

      <div className={native !== false ? "cv__pages-wrap is-hidden" : "cv__pages-wrap"}>
        {status === "loading" && (
          <p role="status" className="cv__status">
            <Loader2 className="spin" size={20} />
            Loading CV…
          </p>
        )}
        {status === "error" && (
          <div role="alert" className="cv__error">
            <p>Couldn&apos;t load the preview.</p>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              Open the PDF instead
            </a>
          </div>
        )}
        <div ref={pagesRef} className="cv__pages" />
      </div>
    </main>
  )
}
