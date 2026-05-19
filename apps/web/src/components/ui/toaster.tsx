"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg rounded-xl",
          title: "text-gray-900 dark:text-white text-sm font-medium",
          description: "text-gray-500 dark:text-gray-400 text-xs",
          success: "border-emerald-200 dark:border-emerald-800",
          error: "border-red-200 dark:border-red-800",
        },
      }}
    />
  )
}
