'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PregnancyBloodPressureTracker from '@/components/pregnancy-blood-pressure-tracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Loader, TrendingUp, FileText } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useEffect(() => {
    // Check if onboarding is complete
    try {
      const isComplete = localStorage.getItem('onboardingComplete')
      setOnboardingComplete(!!isComplete)
    } catch (error) {
      console.error('Failed to read onboarding status:', error)
      setOnboardingComplete(false)
    }
  }, [])
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-pink-500" />
            </div>
            <CardTitle className="text-3xl font-bold">Pregnancy Blood Pressure Tracker</CardTitle>
            <CardDescription className="text-lg">
              Monitor your blood pressure safely throughout your pregnancy journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold">Track Safely</h3>
                <p className="text-sm text-gray-600">Log readings with pregnancy-specific guidelines</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Monitor Trends</h3>
                <p className="text-sm text-gray-600">Visualize patterns and identify concerns early</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Share with Doctor</h3>
                <p className="text-sm text-gray-600">Export reports for healthcare provider visits</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/auth/signin')}
              size="lg"
              className="w-full max-w-md mx-auto"
            >
              Get Started
            </Button>
            <p className="text-xs text-gray-500">
              Secure, HIPAA-compliant health tracking designed for expecting mothers
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!onboardingComplete) {
    router.push('/onboarding')
    return null
  }

  return <PregnancyBloodPressureTracker />
}