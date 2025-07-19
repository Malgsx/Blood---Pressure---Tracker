'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Heart, TrendingUp, Download, Calendar, Clock } from 'lucide-react'

interface BloodPressureReading {
  id: string
  systolic: number
  diastolic: number
  pulse: number
  date: string
  time: string
  notes?: string
  category: 'normal' | 'elevated' | 'stage1' | 'stage2' | 'crisis'
}

export default function BloodPressureTracker() {
  const [readings, setReadings] = useState<BloodPressureReading[]>([])
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [pulse, setPulse] = useState('')
  const [notes, setNotes] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toISOString().split('T')[0])
    setCurrentTime(now.toTimeString().split(' ')[0].slice(0, 5))
    
    // Load saved readings from localStorage
    const savedReadings = localStorage.getItem('bloodPressureReadings')
    if (savedReadings) {
      setReadings(JSON.parse(savedReadings))
    }
  }, [])

  useEffect(() => {
    // Save readings to localStorage whenever readings change
    localStorage.setItem('bloodPressureReadings', JSON.stringify(readings))
  }, [readings])

  const categorizeReading = (systolic: number, diastolic: number): BloodPressureReading['category'] => {
    if (systolic >= 180 || diastolic >= 120) return 'crisis'
    if (systolic >= 140 || diastolic >= 90) return 'stage2'
    if (systolic >= 130 || diastolic >= 80) return 'stage1'
    if (systolic >= 120 && diastolic < 80) return 'elevated'
    return 'normal'
  }

  const getCategoryColor = (category: BloodPressureReading['category']) => {
    switch (category) {
      case 'normal': return 'bg-green-100 text-green-800'
      case 'elevated': return 'bg-yellow-100 text-yellow-800'
      case 'stage1': return 'bg-orange-100 text-orange-800'
      case 'stage2': return 'bg-red-100 text-red-800'
      case 'crisis': return 'bg-red-600 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryLabel = (category: BloodPressureReading['category']) => {
    switch (category) {
      case 'normal': return 'Normal'
      case 'elevated': return 'Elevated'
      case 'stage1': return 'Stage 1 High'
      case 'stage2': return 'Stage 2 High'
      case 'crisis': return 'Crisis'
      default: return 'Unknown'
    }
  }

  const addReading = () => {
    if (!systolic || !diastolic || !pulse) return

    const sys = parseInt(systolic)
    const dia = parseInt(diastolic)
    const pul = parseInt(pulse)

    if (sys < 70 || sys > 250 || dia < 40 || dia > 150 || pul < 40 || pul > 200) {
      alert('Please enter valid blood pressure and pulse values')
      return
    }

    const newReading: BloodPressureReading = {
      id: Date.now().toString(),
      systolic: sys,
      diastolic: dia,
      pulse: pul,
      date: currentDate,
      time: currentTime,
      notes: notes.trim(),
      category: categorizeReading(sys, dia)
    }

    setReadings([newReading, ...readings])
    setSystolic('')
    setDiastolic('')
    setPulse('')
    setNotes('')
  }

  const deleteReading = (id: string) => {
    setReadings(readings.filter(reading => reading.id !== id))
  }

  const exportData = () => {
    const csvContent = [
      ['Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Category', 'Notes'],
      ...readings.map(reading => [
        reading.date,
        reading.time,
        reading.systolic.toString(),
        reading.diastolic.toString(),
        reading.pulse.toString(),
        getCategoryLabel(reading.category),
        reading.notes || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blood-pressure-readings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getAverages = () => {
    if (readings.length === 0) return null
    
    const recentReadings = readings.slice(0, 7) // Last 7 readings
    const avgSystolic = Math.round(recentReadings.reduce((sum, r) => sum + r.systolic, 0) / recentReadings.length)
    const avgDiastolic = Math.round(recentReadings.reduce((sum, r) => sum + r.diastolic, 0) / recentReadings.length)
    const avgPulse = Math.round(recentReadings.reduce((sum, r) => sum + r.pulse, 0) / recentReadings.length)
    
    return { avgSystolic, avgDiastolic, avgPulse }
  }

  const averages = getAverages()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Blood Pressure Tracker
          </CardTitle>
          <CardDescription>
            Track your blood pressure readings and monitor your cardiovascular health
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    min="70"
                    max="250"
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
                    min="40"
                    max="150"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="72"
                  min="40"
                  max="200"
                />
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
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? Any symptoms?"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <Button onClick={addReading} className="w-full">
            Add Reading
          </Button>
        </CardContent>
      </Card>

      {averages && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Averages (Last 7 readings)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{averages.avgSystolic}</div>
                <div className="text-sm text-gray-500">Systolic</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{averages.avgDiastolic}</div>
                <div className="text-sm text-gray-500">Diastolic</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{averages.avgPulse}</div>
                <div className="text-sm text-gray-500">Pulse</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Reading History ({readings.length} readings)</CardTitle>
            {readings.length > 0 && (
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {readings.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No readings recorded yet. Add your first reading above to get started!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {readings.map((reading) => (
                <div key={reading.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-lg font-semibold">
                          {reading.systolic}/{reading.diastolic} mmHg
                        </div>
                        <Badge className={getCategoryColor(reading.category)}>
                          {getCategoryLabel(reading.category)}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          Pulse: {reading.pulse} bpm
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
                      </div>
                      {reading.notes && (
                        <div className="text-sm text-gray-600 italic">
                          &quot;{reading.notes}&quot;
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => deleteReading(reading.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Normal</Badge>
              <span className="text-sm">Less than 120/80 mmHg</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">Elevated</Badge>
              <span className="text-sm">120-129 systolic and less than 80 diastolic</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">Stage 1 High</Badge>
              <span className="text-sm">130-139 systolic or 80-89 diastolic</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Stage 2 High</Badge>
              <span className="text-sm">140/90 mmHg or higher</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-600 text-white">Crisis</Badge>
              <span className="text-sm">180/120 mmHg or higher - Seek medical attention immediately</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}