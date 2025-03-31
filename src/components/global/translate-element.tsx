"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
]

export default function TranslateElement() {
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script")
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)

      // Define the callback function
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            includedLanguages: languages.map((lang) => lang.code).join(","),
          },
          "google_translate_element",
        )
      }
    }

    const translateDiv = document.createElement("div")
    translateDiv.id = "google_translate_element"
    translateDiv.style.display = ""
    document.body.appendChild(translateDiv)

    addGoogleTranslateScript()

    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]')
      if (script) script.remove()

      const translateDiv = document.getElementById("google_translate_element")
      if (translateDiv) translateDiv.remove()

      delete window.googleTranslateElementInit
    }
  }, [])

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode)

    const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement
    if (selectElement) {
      selectElement.value = langCode
      selectElement.dispatchEvent(new Event("change"))
    }
  }

  return (
    <>
<style jsx global>{`
  .goog-logo-link,
  .goog-te-gadget span,
  .goog-te-banner-frame,
  .goog-te-balloon-frame {
    display: none !important;
  }
  body {
    transition: all 0.3s ease-in-out;
  }
    iframe {
    display: none !important;
    }
    skiptranslate {
    display: none !important;
    }
`}</style>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Select language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className={currentLang === lang.code ? "bg-muted" : ""}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
    </>
  )
}