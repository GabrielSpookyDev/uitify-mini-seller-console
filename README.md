# Mini Seller Console

A lightweight React application for managing leads and opportunities in a sales pipeline. Built with modern web technologies for optimal performance and user experience.

## Features

### 📋 Lead Management
- **Lead List**: View and manage 100+ leads with pagination
- **Search & Filter**: Find leads by name/company and filter by status
- **Sorting**: Sort leads by score (ascending/descending)
- **Lead Details**: Edit lead information with real-time validation
- **Status Tracking**: Update lead status through the sales pipeline

### 💼 Opportunity Management
- **Lead Conversion**: Convert qualified leads into opportunities
- **Opportunity Pipeline**: Track opportunities through sales stages
- **Financial Tracking**: Manage deal amounts and revenue forecasting
- **Search & Filter**: Find opportunities by name/account and filter by stage
- **Sorting**: Sort opportunities by deal amount

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Motion-powered transitions and interactions
- **Loading States**: Skeleton screens during data loading
- **Error Handling**: Graceful error states with recovery options
- **Persistent Settings**: Filters, sorting, and pagination persist across sessions

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **State Management**: React Context + useReducer
- **Data Persistence**: localStorage
- **Development**: ESLint + TypeScript strict mode

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── leads/          # Lead-specific components
│   ├── opps/           # Opportunity-specific components
│   └── ui/             # Generic UI components
├── data/               # Static JSON data
├── lib/                # Utility functions
├── state/              # State management
└── types/              # TypeScript type definitions
```

## Key Features

- **100 Sample Leads**: Pre-loaded with realistic sales data
- **Simulated Network Latency**: Realistic loading and error states
- **Optimistic Updates**: Immediate UI feedback with rollback on failure
- **Mobile-First Design**: Responsive layouts for all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation support
