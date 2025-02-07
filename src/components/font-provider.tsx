import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import Cookies from 'js-cookie'

type Font = "system" | "instrument"

type FontProviderProps = {
  children: React.ReactNode
  defaultFont?: Font
}

type FontProviderState = {
  font: Font
  setFont: (font: Font) => void
}

const initialState: FontProviderState = {
  font: "system",
  setFont: () => null,
}

const FONT_COOKIE_KEY = 'font'

const FontProviderContext = createContext<FontProviderState>(initialState)

export function FontProvider({
  children,
  defaultFont = "system",
  ...props
}: FontProviderProps) {
  // Initialize font from cookie or default
  const [font, setFont] = useState<Font>(() => {
    if (typeof window === 'undefined') return defaultFont
    return (Cookies.get(FONT_COOKIE_KEY) as Font) || defaultFont
  })

  useEffect(() => {
    const root = window.document.documentElement
    // Remove all font classes
    root.classList.remove("font-system", "font-instrument")
    // Add the current font class
    root.classList.add(`font-${font}`)
    // Also update the html element directly for better font loading
    if (font === "instrument") {
      root.style.fontFamily = "'Instrument Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    } else {
      root.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    }
  }, [font])

  const value = {
    font,
    setFont: (font: Font) => {
      setFont(font)
      // Set cookie with a 1 year expiry
      Cookies.set(FONT_COOKIE_KEY, font, { expires: 365 })
    },
  }

  return (
    <FontProviderContext.Provider {...props} value={value}>
      {children}
    </FontProviderContext.Provider>
  )
}

export const useFont = () => {
  const context = useContext(FontProviderContext)

  if (context === undefined)
    throw new Error("useFont must be used within a FontProvider")

  return context
} 