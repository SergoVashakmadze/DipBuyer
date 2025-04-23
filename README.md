# DipBuyer

![DipBuyer Logo](/public/images/bull-logo.png)

## AI-Powered Undervalued Asset Buying Agent

DipBuyer is an advanced financial application that helps users identify and invest in potentially undervalued financial assets across stocks, ETFs, and cryptocurrencies. The platform leverages AI algorithms to analyze market data and present investment opportunities in a user-friendly interface.

## Features

- **Undervalued Asset Identification**: Simulated algorithm to identify potentially undervalued assets based on technical indicators, moving averages, and historical price patterns
- **Interactive Dashboard**: Real-time market data visualization with TradingView integration
- **Portfolio Management**: Track your investments, performance, and asset allocation
- **Wallet Integration**: Manage funds with a simulation wallet and Coinbase wallet integration
- **Asset Analysis**: Detailed charts and analysis tools for informed decision making
- **Learning Resources**: Educational content for financial literacy and investment knowledge

## Technologies Used

- **Frontend**: Next.js 13+ (App Router), React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts for portfolio visualization
- **Market Data**: TradingView widgets integration
- **Crypto Integration**: Coinbase Developer Platform (CDP) AgentKit
- **State Management**: React Context API
- **Styling**: Tailwind CSS with dark/light mode support
- **Animations**: Custom hover and parallax effects

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/SergoVashakmadze/dipbuyer.git
   cd dipbuyer
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

\`\`\`
dipbuyer/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Dashboard page
│   ├── portfolio/          # Portfolio page
│   ├── wallet/             # Wallet management page
│   ├── learn/              # Educational resources page
│   └── settings/           # User settings page
├── components/             # React components
│   ├── ui/                 # UI components (shadcn/ui)
│   ├── icons/              # Custom icons
│   ├── asset-opportunities.tsx  # Undervalued assets component
│   ├── market-overview.tsx      # TradingView chart integration
│   ├── portfolio-chart.tsx      # Portfolio performance chart
│   └── ...                 # Other components
├── context/                # React Context providers
│   ├── portfolio-context.tsx    # Portfolio state management
│   ├── settings-context.tsx     # User settings state
│   └── wallet-context.tsx       # Wallet state management
├── lib/                    # Utility functions
│   └── utils.ts            # Helper functions
├── public/                 # Static assets
│   ├── images/             # Images including logo
│   └── tradingview-fix.css # CSS fixes for TradingView widgets
└── ...                     # Configuration files
\`\`\`

## Key Components

### Asset Identification

The system uses a combination of technical indicators, moving averages, and historical price patterns to identify potentially undervalued assets. The undervaluation score is calculated based on:

- Current price relative to historical moving averages
- Standard deviation from mean prices
- Recent price movements and volatility

### TradingView Integration

The application integrates TradingView widgets for professional-grade market data visualization:

- Ticker tape for real-time market updates
- Advanced charting capabilities with technical indicators
- Symbol search and analysis tools

### Wallet System

DipBuyer offers two wallet options:

1. **Simulation Wallet**: A virtual wallet for practicing investment strategies without real money
2. **Coinbase Wallet Integration**: Connect your Coinbase wallet for real crypto transactions (simulated in the current version)

### Portfolio Management

Track your investments with detailed analytics:

- Total portfolio value and performance metrics
- Asset allocation visualization
- Profit/loss tracking
- Transaction history

## Deployment

The application can be deployed to Vercel or any other hosting platform that supports Next.js applications.

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure build settings if needed
4. Deploy

### Troubleshooting

If you encounter issues with TradingView widgets:

- Ensure the TradingView script is loading correctly
- Check browser console for errors
- The application includes CSS fixes in `public/tradingview-fix.css` to address common display issues
- For deployment issues, check build logs and consider temporarily removing complex components if builds are timing out

## License

[MIT License](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [TradingView](https://www.tradingview.com/)
- [Coinbase Developer Platform](https://www.coinbase.com/cloud)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

---

Created with ❤️ by Sergo Vashakmadze
