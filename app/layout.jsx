import { Inter } from "next/font/google"
import "../src/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Monitor del Impacto Ambiental",
  description: "Monitoreamos el impacto que causan los cambio ambientales en los estudiantes de la UNEFA Zaraza.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
      <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

