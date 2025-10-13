# Development Guide

## 🔧 Prerequisites

Before starting development, ensure you have:

- **Node.js** (version 16+) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yushchukvova-collab/money-menenger.git
   cd money-menenger
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🛠 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── contexts/           # React contexts (LanguageContext)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/      # Supabase client and types
├── lib/               # Utility functions
└── pages/             # Page components
```

## 🌐 Environment Setup

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-public-key"
VITE_SUPABASE_URL="your-supabase-url"
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 Code Quality

- **ESLint**: Automatically runs on build
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## 🚨 Troubleshooting

### Common Issues:

1. **Module not found errors:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port already in use:**
   The dev server will automatically try the next available port.

3. **Type errors:**
   Ensure all dependencies are installed and TypeScript is properly configured.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m "Add new feature"`
6. Push to branch: `git push origin feature/new-feature`
7. Create a Pull Request

## 📦 Dependencies

### Key Dependencies:
- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Supabase** - Backend services
- **React Hook Form** - Form management
- **Recharts** - Data visualization

### Development Dependencies:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **React Testing Library** - Component testing