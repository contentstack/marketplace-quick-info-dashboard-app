# Marketplace Quick Info Dashboard App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.45.0-green.svg)](https://playwright.dev/)

A modern, comprehensive dashboard widget for Contentstack marketplace apps that uses the Management SDK to retrieve real-time stack statistics and generates interactive dashboards displaying content types, entries, and assets counts with navigation capabilities.

## 📊 Features

- **Real-time Stack Statistics**: Displays live counts of content types, entries, and assets using Management SDK
- **Interactive Dashboard Widget**: Clean, professional interface using Contentstack's Venus components
- **Parallel Data Processing**: Efficient fetching with concurrent API calls for optimal performance
- **Error Handling & Retry**: Comprehensive error states with user-friendly retry functionality
- **Direct Navigation**: Quick access links to content types, entries, and assets in Contentstack
- **TypeScript**: Fully typed for better development experience and code reliability
- **Responsive Design**: Works seamlessly across different screen sizes and devices
- **Testing**: Vitest unit tests (`npm run test:coverage`, 90% threshold) and Playwright for E2E testing
- **Modern UI**: Accessible interface with loading states and smooth animations

## 📋 Prerequisites

- Node.js 22.12 or higher (`engines`)
- npm
- Contentstack account (for marketplace deployment)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/contentstack/marketplace-quick-info-dashboard-app.git
cd marketplace-quick-info-dashboard-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run unit tests
npm test

# Run E2E tests (needs .env.sample variables and a Contentstack account)
npm run test:chrome-headed
```

### Building for Production

```bash
# Build the application
npm run build

# The built files will be in the `dist` directory
```

## 🏗️ Project Structure

```
marketplace-quick-info-dashboard-app/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # UI components (StackIcons, etc.)
│   │   ├── types/          # Component-specific TypeScript interfaces
│   │   ├── StackMetrics.tsx  # Main widget component
│   │   ├── stat-card.tsx   # Individual statistic card component
│   │   ├── loading-skeleton.tsx    # Loading state components
│   │   ├── AppFailed.tsx   # Error fallback component
│   │   └── ErrorBoundary.tsx       # React error boundary
│   ├── containers/          # Main app containers
│   │   ├── App/            # Main app component
│   │   ├── DashboardWidget/ # Stack dashboard widget container
│   │   └── 404/           # 404 error page
│   ├── common/
│   │   ├── contexts/       # React contexts (MarketplaceAppContext)
│   │   ├── hooks/          # Custom React hooks (useAppSdk, useManagementClient)
│   │   ├── locales/        # Internationalization files
│   │   ├── providers/      # Context providers (MarketplaceAppProvider)
│   │   └── types/          # TypeScript type definitions
│   └── assets/             # Static assets
├── e2e/                    # End-to-end tests
│   ├── pages/              # Page object models
│   ├── tests/              # Test specifications
│   └── utils/              # Test utilities
├── public/                 # Public assets
└── config files...         # package.json, vite.config.ts, etc.
```

## 🧪 Testing

### Unit tests

```bash
npm test                   # Run unit tests (Vitest)
npm run test:coverage      # Run with the 90% coverage threshold
```

### E2E Tests

```bash
npm run test:chrome        # Run E2E tests in Chrome
npm run test:firefox       # Run E2E tests in Firefox
npm run test:chrome-headed # Run E2E tests in Chrome (headed mode)
npm run test:firefox-headed # Run E2E tests in Firefox (headed mode)
```

### Code Quality

```bash
npm run lint               # Run ESLint
npm run typecheck         # TypeScript type checking
npm run format            # Format code with Prettier
npm run build:check       # Type check and build verification
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_BASE_URL=https://app.contentstack.com
```

### App Configuration

The app configuration is defined in `manifest.json`. It is a placeholder (localhost URLs and a `your-cdn` icon), not the production manifest. A trimmed example:

```json
{
  "name": "Quick Info Widget",
  "target_type": "stack",
  "ui_location": {
    "locations": [
      {
        "type": "cs.cm.stack.dashboard",
        "meta": [
          {
            "path": "/stack-dashboard",
            "signed": false,
            "enabled": true,
            "default_width": "half"
          }
        ]
      }
    ]
  }
}
```

## 🛠️ Development

### Adding New Features

1. Create feature branch from `main`
2. Implement your changes in the `src` directory
3. Add tests for new functionality
4. Update documentation if necessary
5. Submit pull request

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Conventional Commits** for commit messages

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new statistics display feature
fix: resolve data fetching timeout issue
docs: update README with new configuration options
test: add unit tests for stat card component
```

## 📦 Deployment

### Contentstack Marketplace

Hosting for this app is not yet decided (tracked in MKT-19794); it does not resolve on a Marketplace domain today.

1. Build the application: `npm run build` (output in `dist/`)
2. Host the `dist` directory and set the real URLs in the manifest
3. Register the app in Developer Hub and install it in a stack

### Local Development

For local development with Contentstack:

1. Use Contentstack's local development tools
2. Configure your stack API key in the manifest
3. Run `npm run dev` for development server
4. Access the widget through your Contentstack dashboard

## 🤝 Contributing

We welcome contributions!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests to ensure everything works
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Contentstack](https://www.contentstack.com/) for the marketplace platform
- [Contentstack Management SDK](https://www.contentstack.com/docs/developers/management-api/) for data fetching capabilities
- [Venus Components](https://venus.contentstack.com/) for the UI components
- [Vite](https://vitejs.dev/) for the build tooling and development experience

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/contentstack/marketplace-quick-info-dashboard-app/issues)
- **Documentation**: [Contentstack Developer Hub](https://www.contentstack.com/docs/developers/developer-hub)
- **Community**: [Contentstack Community](https://community.contentstack.com/)

---

Made with ❤️ by the Contentstack team
