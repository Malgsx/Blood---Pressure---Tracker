'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Mail } from 'lucide-react'

export default function SignIn() {
  const [providers, setProviders] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    getProviders().then(setProviders)
  }, [])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      signIn('email', { email, callbackUrl: '/onboarding' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-pink-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Pregnancy BP Tracker</CardTitle>
          <CardDescription>
            Monitor your blood pressure safely throughout your pregnancy journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Sign in with Email
            </Button>
          </form>

          {providers && Object.values(providers).map((provider: any) => {
            if (provider.name === 'Email') return null
            
            return (
              <Button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: '/onboarding' })}
                variant="outline"
                className="w-full"
              >
                Sign in with {provider.name}
              </Button>
            )
          })}

          <div className="text-xs text-gray-500 text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            Your health data is encrypted and secure.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}