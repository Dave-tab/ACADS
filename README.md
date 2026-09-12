# ACADS - Student Result Management System

> A comprehensive, modern institutional platform for securely managing student grades, calculating semester GPA and cumulative CGPA, tracking academic standing, and issuing official printable transcripts.

---

## 📖 Overview

**ACADS** is an enterprise-grade academic records and result management system built for educational institutions, faculty administrators, and students. It provides an intuitive interface for managing courses, recording marks, generating academic analytics, and delivering personalized AI-powered academic advisory insights.

---

## ✨ Key Features

### 👨‍💼 Administrator Portal
- **Dashboard & Analytics**: Real-time institutional metrics, grade distribution charts, and student performance summaries.
- **Student Record Management**: Add, update, and search student profiles across departments, semesters, and academic sessions.
- **Course Catalog**: Configure courses, credit units, prerequisites, and department allocations.
- **Result Processing**: Record continuous assessment (CA) and examination scores with automated letter grade and grade point calculation.
- **Batch Operations**: Quick filters by semester, department, and academic standing.

### 🎓 Student Portal
- **Academic Dashboard**: High-level overview of Cumulative GPA (CGPA), current semester GPA, completed credit units, and degree progress.
- **Dynamic Semester Results**: Filter and review examination breakdowns across enrolled terms and historical sessions.
- **Official Transcript Generation**: One-click printable, verified institutional transcript with grade point breakdowns and registrar sign-off blocks.
- **AI Academic Advisor**: Gemini-powered conversational assistant to evaluate academic trajectory, identify strengths, and provide personalized improvement strategies.

### 🎨 User Experience & Design
- **Dark / Light Mode**: Smooth theme toggling with persistent user preference.
- **Responsive Layout**: Designed for seamless usage across mobile, tablet, and desktop viewports.
- **Accessibility & Craft**: Clean typography, high-contrast indicators, and zero layout shifting.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend & API**: Node.js, Express (custom server bundled with esbuild)
- **AI Integration**: Google Gen AI SDK (`@google/genai`)
- **Visualizations**: Lucide React, Recharts / D3-ready components

---

## 🏗️ Project Structure

```text
├── index.html                   # Application HTML entry point & SEO metadata
├── metadata.json                # Project capabilities & permissions manifest
├── package.json                 # Project dependencies & build lifecycle scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build tool and plugin configuration
├── server.ts                    # Express backend server with Vite middleware integration
│
├── public/                      # Static assets & public resources
│
└── src/
    ├── main.tsx                 # React application root entry point
    ├── App.tsx                  # Core state controller & view router
    ├── index.css                # Global Tailwind CSS styles and theme utilities
    ├── types.ts                 # TypeScript domain interfaces, models & enums
    │
    ├── assets/
    │   └── images/              # Media and brand imagery assets
    │
    ├── data/
    │   └── mockData.ts          # Seed dataset (students, courses, academic results, grade scale)
    │
    └── components/              # Modular UI components
        ├── Navbar.tsx           # Global navigation header & dark mode switcher
        ├── Footer.tsx           # Global footer with institutional indicator & attribution
        ├── LandingPage.tsx      # Welcome hero, feature highlights & portal gateways
        ├── AdminDashboard.tsx   # Faculty administration, grade recording & course management
        ├── AdminLoginModal.tsx  # Secure administrator authentication dialog
        ├── StudentPortal.tsx    # Primary student dashboard container & state coordinator
        ├── StudentSidebar.tsx   # Student academic profile & dynamic semester navigation
        ├── StudentLoginModal.tsx # Student matriculation authentication dialog
        ├── PrintTranscriptModal.tsx # Official verified transcript generator & print layout
        ├── AiAdvisorModal.tsx   # Gemini-powered intelligent academic advisor dialog
        ├── GradingScaleModal.tsx # Institutional grading benchmarks and GPA point scale modal
        ├── UpdateProfilePhotoModal.tsx # Student profile picture upload modal
        │
        ├── portal/              # Sub-pages for Student Portal tabs
        │   ├── OverviewPage.tsx    # Academic summary, CGPA cards, and quick metrics
        │   ├── LedgerPage.tsx      # Semester examination score breakdown & grade ledger
        │   ├── AnalyticsPage.tsx   # Performance charts, trend graphs & unit distribution
        │   ├── DegreeAuditPage.tsx # Graduation requirements, core courses & degree progress
        │   └── AdvisoryPage.tsx    # Academic advisor insights & recommendation logs
        │
        └── skeletons/           # Shimmer loading skeleton UI components
            ├── SkeletonBase.tsx
            ├── AdminDashboardSkeleton.tsx
            └── StudentPortalSkeleton.tsx
## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or higher recommended)
- npm or yarn

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd acads
