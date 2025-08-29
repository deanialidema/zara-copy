"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function SelectDateTime() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden relative">
        {/* Calendly Ribbon */}
        <div className="absolute top-4 right-0 bg-gray-800 text-white text-xs px-4 py-1 transform rotate-45 translate-x-1/4 -translate-y-1/4 origin-top-right shadow-md">
          Powered by Calendly
        </div>

        {/* Left Column - Meeting Details */}
        <div className="flex-1 p-8 bg-white border-r border-gray-200 flex flex-col justify-between">
          <div>
            <Image src="/zara.jpeg" alt="Zara logo" width={100} height={36} className="mb-6" />
            <h2 className="text-lg font-semibold text-gray-600">Zara</h2>
            <h1 className="text-3xl font-bold mb-6">Meeting</h1>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>30 min</span>
            </div>
          </div>
          <div className="flex justify-start text-sm text-blue-600 mt-8">
            <a href="#" className="hover:underline">
              Cookie settings
            </a>
          </div>
        </div>

        {/* Right Column - Calendly Widget */}
        <div className="flex-1 bg-gray-50 flex justify-center items-center w-full h-full">
          {/* Calendly inline widget begin */}
          <div
            className="calendly-inline-widget w-full h-full"
            data-url="https://calendly.com/momqillamerita3/30min"
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
          <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
          {/* Calendly inline widget end */}
        </div>
      </Card>
    </div>
  )
}
