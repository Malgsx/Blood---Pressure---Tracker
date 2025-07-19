'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertCircle, 
  Heart, 
  TrendingUp, 
  Download, 
  Calendar, 
  Clock, 
  User,
  LogOut,
  Baby,
  AlertTriangle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO, differenceInWeeks } from 'date-fns'

interface BloodPressureReading {
  id: string
  systolic: number
  diastolic: number
  pulse: number
  date: string
  time: string
  notes?: string
  symptoms: string[]
  position: 'sitting' | 'lying' | 'standing'
  category: 'normal' | 'elevated' | 'stage1' | 'stage2' | 'crisis'
  pregnancyWeek: number
}

interface UserProfile {
  name: string
  dueDate: string
  currentWeek: string
  firstPregnancy: string
  preExistingConditions: string
  currentMedications: string
  doctorName: string
  preferredReminders: string
}

export default function PregnancyBloodPressureTracker() {
  const { data: session } = useSession()
  const [readings, setReadings] = useState<BloodPressureReading[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [pulse, setPulse] = useState('')
  const [notes, setNotes] = useState('')
  const [position, setPosition] = useState<'sitting' | 'lying' | 'standing'>('sitting')
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')

  const availableSymptoms = [
    'Headache', 'Dizziness', 'Blurred vision', 'Nausea', 'Swelling in hands/feet', 
    'Chest pain', 'Shortness of breath', 'Upper abdominal pain', 'Sudden weight gain'
  ]

  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toISOString().split('T')[0])
    setCurrentTime(now.toTimeString().split(' ')[0].slice(0, 5))
    
    // Load saved data
    try {
      const savedReadings = localStorage.getItem('bloodPressureReadings')
      const savedProfile = localStorage.getItem('userProfile')
      
      if (savedReadings) {
        setReadings(JSON.parse(savedReadings))
      }
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
    } catch (error) {
      console.error('Failed to load saved data:', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bloodPressureReadings', JSON.stringify(readings))
  }, [readings])

  const getCurrentPregnancyWeek = (): number => {
    if (!userProfile?.dueDate) return 20 // Default to mid-pregnancy
    
    const dueDate = parseISO(userProfile.dueDate)
    const conceptionDate = new Date(dueDate.getTime() - (40 * 7 * 24 * 60 * 60 * 1000)) // 40 weeks before
    const weeksPregnant = differenceInWeeks(new Date(), conceptionDate)
    
    return Math.max(1, Math.min(42, weeksPregnant))
  }

  // Pregnancy-specific BP categorization
  const categorizePregnancyReading = (systolic: number, diastolic: number, week: number): BloodPressureReading['category'] => {
    // More strict guidelines for pregnancy
    if (systolic >= 160 || diastolic >= 110) return 'crisis'  // Severe preeclampsia range
    if (systolic >= 140 || diastolic >= 90) return 'stage2'   // Gestational hypertension
    if (systolic >= 130 || diastolic >= 85) return 'stage1'   // Elevated for pregnancy
    if (systolic >= 120 && diastolic < 85) return 'elevated'  // Watch zone
    return 'normal'
  }

  const getCategoryColor = (category: BloodPressureReading['category']) => {
    switch (category) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200'
      case 'elevated': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'stage1': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'stage2': return 'bg-red-100 text-red-800 border-red-200'
      case 'crisis': return 'bg-red-600 text-white border-red-600'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryLabel = (category: BloodPressureReading['category']) => {
    switch (category) {
      case 'normal': return 'Normal'
      case 'elevated': return 'Watch Zone'
      case 'stage1': return 'Gestational HTN Risk'
      case 'stage2': return 'Gestational HTN'
      case 'crisis': return 'Severe - Call Doctor'
      default: return 'Unknown'
    }
  }

  const addReading = () => {
    if (!systolic || !diastolic || !pulse) return

    const sys = parseInt(systolic)
    const dia = parseInt(diastolic)
    const pul = parseInt(pulse)

    // Pregnancy-specific validation ranges
    if (sys < 80 || sys > 220 || dia < 50 || dia > 140 || pul < 50 || pul > 150) {
      alert('Please enter valid values. During pregnancy, normal ranges are broader to account for physiological changes.')
      return
    }

    const pregnancyWeek = getCurrentPregnancyWeek()
    
    const newReading: BloodPressureReading = {
      id: Date.now().toString(),
      systolic: sys,
      diastolic: dia,
      pulse: pul,
      date: currentDate,
      time: currentTime,
      notes: notes.trim(),
      symptoms,
      position,
      category: categorizePregnancyReading(sys, dia, pregnancyWeek),
      pregnancyWeek
    }

    setReadings([newReading, ...readings])
    
    // Reset form
    setSystolic('')
    setDiastolic('')
    setPulse('')
    setNotes('')
    setSymptoms([])
    
    // Show alert for concerning readings
    if (newReading.category === 'crisis') {
      alert('⚠️ URGENT: Your blood pressure reading is very high. Contact your healthcare provider immediately or seek emergency care.')
    } else if (newReading.category === 'stage2') {
      alert('⚠️ Important: This reading indicates gestational hypertension. Please contact your healthcare provider soon.')
    }
  }

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const exportData = () => {
    const csvContent = [
      ['Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Category', 'Position', 'Pregnancy Week', 'Symptoms', 'Notes'],
      ...readings.map(reading => [
        reading.date,
        reading.time,
        reading.systolic.toString(),
        reading.diastolic.toString(),
        reading.pulse.toString(),
        getCategoryLabel(reading.category),
        reading.position,
        reading.pregnancyWeek.toString(),
        reading.symptoms.join('; '),
        reading.notes || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pregnancy-bp-readings-${userProfile?.name?.replace(/\s+/g, '-') || 'patient'}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getChartData = () => {
    return readings
      .slice(0, 30) // Last 30 readings
      .reverse()
      .map(reading => ({
        date: format(parseISO(`${reading.date}T${reading.time}`), 'MM/dd'),
        systolic: reading.systolic,
        diastolic: reading.diastolic,
        pulse: reading.pulse,
        week: reading.pregnancyWeek
      }))
  }

  const getAverages = () => {
    if (readings.length === 0) return null
    
    const recentReadings = readings.slice(0, 7)
    const avgSystolic = Math.round(recentReadings.reduce((sum, r) => sum + r.systolic, 0) / recentReadings.length)
    const avgDiastolic = Math.round(recentReadings.reduce((sum, r) => sum + r.diastolic, 0) / recentReadings.length)
    const avgPulse = Math.round(recentReadings.reduce((sum, r) => sum + r.pulse, 0) / recentReadings.length)
    
    return { avgSystolic, avgDiastolic, avgPulse }
  }

  const getHighRiskReadings = () => {
    return readings.filter(r => r.category === 'stage2' || r.category === 'crisis').length
  }

  const averages = getAverages()
  const chartData = getChartData()
  const highRiskCount = getHighRiskReadings()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with user info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Baby className="w-8 h-8 text-pink-500" />
              <div>
                <CardTitle className="text-2xl">Pregnancy Blood Pressure Tracker</CardTitle>
                <CardDescription>
                  Welcome back, {userProfile?.name || session?.user?.name || 'Mom-to-be'}! 
                  {userProfile?.dueDate && ` • Week ${getCurrentPregnancyWeek()} of pregnancy`}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-1" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{readings.length}</div>
            <div className="text-sm text-gray-500">Total Readings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {averages ? `${averages.avgSystolic}/${averages.avgDiastolic}` : '--'}
            </div>
            <div className="text-sm text-gray-500">7-Day Average</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">Week {getCurrentPregnancyWeek()}</div>
            <div className="text-sm text-gray-500">Pregnancy Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${highRiskCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {highRiskCount}
            </div>
            <div className="text-sm text-gray-500">High Risk Readings</div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for high risk */}
      {highRiskCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You have {highRiskCount} high-risk blood pressure reading{highRiskCount > 1 ? 's' : ''}. 
            Please discuss these with your healthcare provider at your next appointment.
          </AlertDescription>
        </Alert>
      )}

      {/* Blood pressure entry form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Record New Reading
          </CardTitle>
          <CardDescription>
            Take readings at the same time each day for best tracking. Sit quietly for 5 minutes before measuring.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolic">Systolic (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="120"
                    min="80"
                    max="220"
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    placeholder="80"
                    min="50"
                    max="140"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pulse">Heart Rate (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="75"
                  min="50"
                  max="150"
                />
              </div>
              <div>
                <Label htmlFor="position">Position during measurement</Label>
                <Select value={position} onValueChange={(value) => setPosition(value as 'sitting' | 'lying' | 'standing')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sitting">Sitting</SelectItem>
                    <SelectItem value="lying">Lying down</SelectItem>
                    <SelectItem value="standing">Standing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Symptoms (select any you're experiencing)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableSymptoms.map(symptom => (
                    <Button
                      key={symptom}
                      type="button"
                      variant={symptoms.includes(symptom) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSymptom(symptom)}
                      className="text-xs h-8"
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? Any concerns?"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <Button onClick={addReading} className="w-full" size="lg">
            Add Reading
          </Button>
        </CardContent>
      </Card>

      {/* Charts */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Blood Pressure Trends
            </CardTitle>
            <CardDescription>
              Track your readings over time to identify patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[60, 180]} />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value, name) => [value, name === 'systolic' ? 'Systolic' : name === 'diastolic' ? 'Diastolic' : 'Heart Rate']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="pulse" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent readings */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Readings ({readings.length} total)</CardTitle>
            {readings.length > 0 && (
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export for Doctor
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {readings.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No readings recorded yet. Add your first reading above to start tracking your pregnancy blood pressure!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {readings.slice(0, 10).map((reading) => (
                <div key={reading.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-lg font-semibold">
                          {reading.systolic}/{reading.diastolic} mmHg
                        </div>
                        <Badge className={`${getCategoryColor(reading.category)} text-xs`}>
                          {getCategoryLabel(reading.category)}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          ♥ {reading.pulse} bpm
                        </div>
                        <div className="text-sm text-purple-600">
                          Week {reading.pregnancyWeek}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {reading.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {reading.time}
                        </div>
                        <div>Position: {reading.position}</div>
                      </div>
                      {reading.symptoms.length > 0 && (
                        <div className="text-sm text-orange-600 mb-1">
                          Symptoms: {reading.symptoms.join(', ')}
                        </div>
                      )}
                      {reading.notes && (
                        <div className="text-sm text-gray-600 italic">
                          &quot;{reading.notes}&quot;
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {readings.length > 10 && (
                <div className="text-center text-gray-500 text-sm">
                  ... and {readings.length - 10} more readings
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pregnancy BP guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Pregnancy Blood Pressure Guidelines</CardTitle>
          <CardDescription>
            Blood pressure targets are different during pregnancy. These guidelines help identify potential concerns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">Normal</Badge>
              <span className="text-sm">Less than 120/85 mmHg</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Watch Zone</Badge>
              <span className="text-sm">120-129 systolic or 85+ diastolic</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">Gestational HTN Risk</Badge>
              <span className="text-sm">130-139 systolic or 85-89 diastolic</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">Gestational HTN</Badge>
              <span className="text-sm">140-159 systolic or 90-109 diastolic</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-600 text-white border-red-600">Severe - Call Doctor</Badge>
              <span className="text-sm">160+ systolic or 110+ diastolic</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Contact your healthcare provider immediately if you have severe symptoms like 
              severe headache, vision changes, upper abdominal pain, or sudden swelling.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}