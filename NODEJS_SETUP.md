# Node.js Installation Guide

## 🚀 Installing Node.js on Windows

To fix the React dependency errors, you need to install Node.js and npm:

### Method 1: Official Installer (Recommended)

1. **Download Node.js:**
   - Go to [nodejs.org](https://nodejs.org/)
   - Download the **LTS version** (recommended for most users)
   - Choose the Windows Installer (.msi)

2. **Run the installer:**
   - Double-click the downloaded file
   - Follow the installation wizard
   - Make sure to check "Add to PATH" option

3. **Verify installation:**
   Open PowerShell and run:
   ```powershell
   node --version
   npm --version
   ```

### Method 2: Using Chocolatey

If you have Chocolatey installed:
```powershell
choco install nodejs
```

### Method 3: Using Winget

If you have Windows Package Manager:
```powershell
winget install OpenJS.NodeJS
```

## 📦 After Installation

Once Node.js is installed, you can:

1. **Install project dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Verify everything works:**
   The app should open at `http://localhost:5173`

## 🔧 Alternative Package Managers

### Yarn (Optional)
```bash
npm install -g yarn
yarn install
yarn dev
```

### Bun (Fast alternative)
```bash
# Install Bun first: https://bun.sh/
bun install
bun run dev
```

## ✅ What This Fixes

Installing Node.js will resolve these errors:
- ❌ "Cannot find module 'react'"
- ❌ "JSX requires react/jsx-runtime"
- ❌ All TypeScript compilation errors
- ❌ Build and development server issues

## 🆘 Need Help?

If you encounter issues:
1. Restart your terminal/PowerShell after installation
2. Check if Node.js was added to PATH
3. Try running `refreshenv` in PowerShell
4. Restart VS Code

## 📞 Support Links

- [Node.js Official Docs](https://nodejs.org/en/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Troubleshooting Guide](https://docs.npmjs.com/troubleshooting)