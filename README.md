# Pregnancy Blood Pressure Tracker

A comprehensive web application designed specifically for pregnant individuals to monitor their blood pressure readings safely throughout their pregnancy journey.

## 🚀 Features Implemented (MVP Phase 1)

### ✅ Core Features
- **User Authentication**: Secure sign-in with NextAuth.js (email and Google OAuth)
- **Pregnancy-Specific Onboarding**: Collects essential pregnancy information during setup
- **Blood Pressure Tracking**: Enhanced form with pregnancy-specific validation ranges
- **Symptom Tracking**: Log pregnancy-related symptoms with each reading
- **Position Tracking**: Record body position during measurement for accuracy
- **Data Visualization**: Interactive charts showing trends over time using Recharts
- **Pregnancy Week Tracking**: Automatic calculation based on due date
- **Smart Alerts**: Pregnancy-specific BP categorization and warnings
- **Healthcare Export**: Professional CSV export for doctor visits
- **Responsive Design**: Optimized for mobile and desktop use

### 🏥 Pregnancy-Specific Features
- **Adjusted BP Guidelines**: Different thresholds for gestational hypertension
- **Pregnancy Week Integration**: Tracks current week and includes in readings
- **Symptom Library**: Pre-defined list of pregnancy-related symptoms
- **Risk Assessment**: Special alerts for preeclampsia warning signs
- **Healthcare-Ready Reports**: Formatted exports for medical professionals

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Authentication**: NextAuth.js with multiple providers
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for pregnancy week calculations
- **Storage**: LocalStorage (temporary, database integration pending)

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.local` and configure:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   # Add OAuth credentials if using providers
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Application**:
   Navigate to `http://localhost:3000`

## 📱 User Flow

1. **Landing Page**: Welcome screen with feature overview
2. **Authentication**: Sign in with email or OAuth providers
3. **Onboarding**: 3-step setup collecting pregnancy information
4. **Dashboard**: Main tracking interface with:
   - Quick stats overview
   - Reading entry form
   - Trend visualization
   - Reading history
   - Pregnancy guidelines

## 🏥 Healthcare Provider Features

- **Professional Exports**: CSV files with comprehensive reading data
- **Risk Indicators**: Clear categorization of concerning readings
- **Symptom Correlation**: Links symptoms with BP readings
- **Pregnancy Context**: Includes pregnancy week with each reading

## 🔐 Security & Privacy

- **Secure Authentication**: NextAuth.js with industry standards
- **Data Encryption**: Client-side storage with plans for encrypted database
- **HIPAA Considerations**: Designed with healthcare compliance in mind
- **Privacy First**: Minimal data collection, user-controlled exports

## 📊 BP Categories (Pregnancy-Specific)

- **Normal**: < 120/85 mmHg
- **Watch Zone**: 120-129 systolic or 85+ diastolic  
- **Gestational HTN Risk**: 130-139 systolic or 85-89 diastolic
- **Gestational HTN**: 140-159 systolic or 90-109 diastolic
- **Severe**: 160+ systolic or 110+ diastolic (immediate medical attention)

## 🎯 Next Steps (Phase 2)

- [ ] Database integration with Prisma + PostgreSQL
- [ ] User profile management
- [ ] Advanced analytics and insights
- [ ] Appointment scheduling integration
- [ ] Push notifications for reminders
- [ ] Healthcare provider portal
- [ ] Educational content integration

## 📋 Based on PRD Requirements

This implementation follows the comprehensive Product Requirements Document and includes all MVP Phase 1 features:

- ✅ User authentication and profile creation
- ✅ Blood pressure reading entry form
- ✅ Basic data visualization (line charts)
- ✅ Local data storage with cloud sync capability
- ✅ CSV export functionality
- ✅ Responsive web design
- ✅ Basic alerts for high readings

## 🤝 Contributing

This project implements the PRD specifications for a pregnancy-focused blood pressure tracking application. Future enhancements will add database persistence, advanced analytics, and healthcare provider integrations.

---

**Note**: This is a healthcare-focused application. Always consult with healthcare providers for medical decisions and ensure proper medical supervision during pregnancy.
