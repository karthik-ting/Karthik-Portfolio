import { clsx, type ClassValue } from "clsx"

/** Join class names, skipping falsy values: cn("a", isOn && "b"). */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Prefix a /public asset path with the deploy base path (needed for GitHub Pages). */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`
}
