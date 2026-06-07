# Nexus Platform - Advanced Collaboration Features

This repository contains the completed frontend internship tasks for the **DevelopersHub Corporation** internship program. The project enhances the existing Nexus Investor & Entrepreneur Collaboration Platform with advanced networking, scheduling, and document management features.

## 🚀 Features Implemented

### Week 1: Scheduling & Setup
- **Interactive Calendar (`/calendar`)**: Integrated `react-calendar` allowing users to add availability slots and manage incoming meeting requests.
- **Confirmed Meetings Widget**: Added to both the Entrepreneur and Investor dashboards to keep track of upcoming scheduled events.
- **UI Theming**: Ensured a consistent and modern aesthetic using Tailwind CSS.

### Week 2: Video Calling & Document Chamber
- **Video Calling Room (`/video-call`)**: Built a WebRTC mockup UI featuring camera/microphone toggles, screen sharing capabilities, and a call duration timer.
- **Document Chamber (`/documents`)**: Overhauled the document management system:
  - Drag-and-drop file uploading using `react-dropzone`.
  - Document status labels (Draft, In Review, Signed).
  - An interactive E-Signature modal using `react-signature-canvas` for legally binding agreements.

### Week 3: Payments, Security & Final Polish
- **Payments Dashboard (`/payments`)**: A comprehensive wallet interface for Deposit, Withdraw, and Transfer workflows, complete with transaction history and balance tracking.
- **Enhanced Security**:
  - Added a real-time password strength meter (`zxcvbn`) to the Registration page.
  - Implemented a Two-Factor Authentication (2FA) OTP step to the Login page.
- **Guided Walkthrough**: Integrated `react-joyride` to provide a guided tour of the new collaboration features upon the user's first login.

## 🛠️ Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & Lucide Icons
- **Routing**: React Router v6
- **Libraries**: `react-calendar`, `react-signature-canvas`, `react-dropzone`, `react-joyride`, `zxcvbn`, `react-hot-toast`

## ⚙️ Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/syedasukaina32/Nexus-Internship-Tasks.git
   ```
2. Navigate into the directory:
   ```bash
   cd Nexus-Internship-Tasks
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment
The application is automatically deployed to Vercel via GitHub integrations.

---
*Completed as part of the DevelopersHub Corporation Frontend Internship Program.*
