# FinanceTracker

A modern, open-source personal finance management app. Track expenses, set budgets, manage recurring payments, and visualize your spending habits.

**[Live Demo](https://finance-tracker-theta-rosy.vercel.app)**

![Landing Page](https://i.ibb.co/HDjSSCXD/Capture-d-e-cran-2025-12-30-a-01-55-39.png)

---

## Architecture

```mermaid
flowchart TB
    subgraph Client["Frontend (React 19 + TypeScript)"]
        direction TB
        
        subgraph Pages["Pages"]
            Landing["Landing"]
            Login["Login"]
            Register["Register"]
            Dashboard["Dashboard"]
            Profile["Profile"]
        end
        
        subgraph Components["Components"]
            AddTx["AddTransactionForm"]
            TxList["TransactionList"]
            TxModal["TransactionModal"]
            Filters["TransactionFilters"]
            Charts["FinancialCharts"]
            Budget["BudgetGoals"]
            Category["CategoryManager"]
            Recurring["RecurringManager"]
        end
        
        subgraph Contexts["Contexts"]
            AuthCtx["AuthContext"]
            CurrencyCtx["CurrencyContext"]
            ToastCtx["ToastContext"]
        end
        
        subgraph Hooks["Custom Hooks"]
            useTx["useTransactions"]
            useBudget["useBudgets"]
            useCat["useCategories"]
            useRec["useRecurring"]
        end
    end
    
    subgraph Firebase["Firebase Backend"]
        direction TB
        Auth["Firebase Auth"]
        Firestore["Cloud Firestore"]
        
        subgraph Collections["Collections"]
            Users["users/{userId}"]
            Transactions["transactions"]
            Budgets["budgets"]
            Categories["categories"]
            RecurringTx["recurring"]
        end
    end
    
    subgraph External["External Services"]
        Vercel["Vercel Hosting"]
        ChartJS["Chart.js"]
    end

    %% Connections
    Pages --> Components
    Components --> Hooks
    Hooks --> Contexts
    Contexts --> Auth
    Hooks --> Firestore
    
    Users --> Transactions
    Users --> Budgets
    Users --> Categories
    Users --> RecurringTx
    
    Charts --> ChartJS
    Client --> Vercel
    
    %% Styling
    classDef firebase fill:#FFCA28,stroke:#F57C00,color:#000
    classDef react fill:#61DAFB,stroke:#21232a,color:#000
    classDef external fill:#9C27B0,stroke:#6A1B9A,color:#fff
    
    class Auth,Firestore,Users,Transactions,Budgets,Categories,RecurringTx firebase
    class Landing,Login,Register,Dashboard,Profile,AddTx,TxList,TxModal,Filters,Charts,Budget,Category,Recurring,AuthCtx,CurrencyCtx,ToastCtx,useTx,useBudget,useCat,useRec react
    class Vercel,ChartJS external
```

### Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as React App
    participant H as Custom Hooks
    participant F as Firebase Auth
    participant DB as Firestore

    U->>R: Login/Register
    R->>F: Authenticate
    F-->>R: User Session
    R->>H: Initialize Hooks
    H->>DB: onSnapshot (Real-time)
    DB-->>H: Live Data Updates
    H-->>R: State Update
    R-->>U: Render UI

    U->>R: Add Transaction
    R->>H: useTransactions.add()
    H->>DB: Write Document
    DB-->>H: Confirmation
    H-->>R: Updated State
    R-->>U: UI Refresh
```

---

## Features

### Transaction Management
- Log income and expenses with custom categories
- Edit or delete transactions anytime
- Filter by month, year, or category
- Export transactions to CSV

![Dashboard](https://i.ibb.co/zdf1FCd/Capture-d-e-cran-2025-12-30-a-01-58-16.png)

### Budget Goals
- Set monthly spending limits per category
- Track savings goals with income categories
- Visual progress bars with color indicators
- Get alerts when approaching or exceeding limits

### Recurring Transactions
- Automate tracking of subscriptions and regular bills
- Support for daily, weekly, monthly, and yearly frequencies
- Automatic transaction creation when due

### Visual Analytics
- Interactive charts showing income vs expenses over time
- Expense breakdown by category with donut chart
- Top spending categories at a glance

![New Transaction](https://i.ibb.co/TBQLG6PN/Capture-d-e-cran-2025-12-30-a-01-58-58.png)

### Profile & Customization
- Multi-currency support (EUR, USD, GBP, MAD, CAD)
- Custom category management with icons
- Secure password change
- Reset to default categories option

![Profile Settings](https://i.ibb.co/jPcV8vkn/Capture-d-e-cran-2025-12-30-a-01-59-24.png)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Firebase** | Auth & Database |
| **Tailwind CSS** | Styling |
| **Chart.js** | Data Visualization |
| **Lucide React** | Icons |
| **Vercel** | Deployment |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/e-jaafar/finance_tracker.git
cd finance_tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Firebase config to .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React contexts (Auth, Currency, Toast)
├── hooks/            # Custom hooks (useTransactions, useBudgets, etc.)
├── pages/            # Page components (Dashboard, Profile, etc.)
├── services/         # Business logic services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

---

## Key Features Explained

### Offline Support
Firebase Firestore is configured with offline persistence, allowing the app to work even without an internet connection. Data syncs automatically when back online.

### Code Splitting
The app uses React.lazy for route-based code splitting, keeping the initial bundle size small and improving load times.

### Secure Authentication
- Firebase Authentication with email/password
- Protected routes for authenticated users
- Secure password change functionality

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

**Jaafar** - [GitHub](https://github.com/e-jaafar)

---

<p align="center">
  <sub>Built with React, Firebase & Tailwind CSS</sub>
</p>
