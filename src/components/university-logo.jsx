import { Cloud, Sun, Droplets, CloudRain } from "lucide-react"

export default function UniversityLogo({ className = "" }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center justify-center mb-2">
        <div className="relative">
          <div className="abosolute -bottom-1 -left-1  bg-primary rounded-full pb-2">
            <img src="/logo.png" alt=""  className="h-25 w-35"/>
            {/* <Cloud className="h-10 w-10 text-primary-foreground" /> */}
          </div>
          <div className="absolute -top-2 -left-2 bg-yellow-400 rounded-full p-1.5">
            <Sun className="h-5 w-5 text-yellow-900" />
          </div>
          <div className="absolute -top-2 -right-2 bg-blue-400 rounded-full p-1.5">
            <CloudRain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -left-1 bg-blue-400 rounded-full p-1">
            <Droplets className="h-4 w-4 text-blue-900" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
            <Cloud className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center">Vita-Unefa</h1>
    </div>
  )
}