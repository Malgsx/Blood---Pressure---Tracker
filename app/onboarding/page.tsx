'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, ArrowRight, Calendar } from 'lucide-react'

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    dueDate: '',
    currentWeek: '',
    firstPregnancy: '',
    preExistingConditions: '',
    currentMedications: '',
    doctorName: '',
    preferredReminders: 'daily'
  })

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save onboarding data and redirect to main app
      localStorage.setItem('userProfile', JSON.stringify(formData))
      localStorage.setItem('onboardingComplete', 'true')
      router.push('/')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.dueDate
      case 2:
        return formData.currentWeek && formData.firstPregnancy
      case 3:
        return true // Optional step
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-pink-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome! Let's Set Up Your Profile</CardTitle>
          <CardDescription>
            Help us personalize your pregnancy blood pressure monitoring experience
          </CardDescription>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-pink-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Expected Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pregnancy Details</h3>
              <div>
                <Label htmlFor="currentWeek">Current Week of Pregnancy</Label>
                <Select onValueChange={(value) => handleInputChange('currentWeek', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current week" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 42 }, (_, i) => i + 1).map(week => (
                      <SelectItem key={week} value={week.toString()}>
                        Week {week}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="firstPregnancy">Is this your first pregnancy?</Label>
                <Select onValueChange={(value) => handleInputChange('firstPregnancy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, this is my first</SelectItem>
                    <SelectItem value="no">No, I've been pregnant before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Information (Optional)</h3>
              <div>
                <Label htmlFor="preExistingConditions">Pre-existing conditions</Label>
                <Input
                  id="preExistingConditions"
                  value={formData.preExistingConditions}
                  onChange={(e) => handleInputChange('preExistingConditions', e.target.value)}
                  placeholder="e.g., hypertension, diabetes (optional)"
                />
              </div>
              <div>
                <Label htmlFor="currentMedications">Current medications</Label>
                <Input
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                  placeholder="List any medications you're taking (optional)"
                />
              </div>
              <div>
                <Label htmlFor="doctorName">Healthcare Provider</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  placeholder="Your OB/GYN or primary care doctor (optional)"
                />
              </div>
              <div>
                <Label htmlFor="preferredReminders">Reminder Frequency</Label>
                <Select 
                  value={formData.preferredReminders}
                  onValueChange={(value) => handleInputChange('preferredReminders', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily reminders</SelectItem>
                    <SelectItem value="twice-daily">Twice daily reminders</SelectItem>
                    <SelectItem value="weekly">Weekly reminders</SelectItem>
                    <SelectItem value="none">No reminders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="ml-auto"
            >
              {step === 3 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}