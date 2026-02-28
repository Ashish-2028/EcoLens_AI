# EcoLens AI 🍃

**An AMD Slingshot Hackathon Project**

EcoLens AI is a high-performance sustainability scanner that uses the Gemini 1.5 Flash API to evaluate the environmental impact of everyday products. By instantly analyzing user-uploaded images, EcoLens identifies potential chemical hazards and intelligently suggests greener alternatives, helping consumers make conscious purchasing decisions.

## Features

- **📸 Smart Product Scanner**: Upload or snap a photo of a product to instantly scan it.
- **⚡ AI-Powered Analysis**: Leverages Google Gemini Flash models for lightning-fast computer vision and JSON data extraction.
- **📊 Sustainability Scoring**: Calculates a customized Eco-Score (0-100) based on ingredients, packaging, and brand sustainability.
- **⚠️ Chemical Red Flags**: Highlights harmful ingredients like Phthalates or SLS present in the product.
- **🌱 Green Swaps**: Recommends eco-friendly, highly-rated alternative products with estimated price comparisons.
- **💾 Local Data Persistence**: Saves user scan history and calculates long-term environmental impact directly in the browser (no database overhead).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Lucide React
- **AI Integration**: `@google/generative-ai`
- **UI Architecture**: Shadcn UI / Vercel v0

## Getting Started

1. Set up your environment variables:
   Create a `.env.local` file in the root directory and add your Google Gemini API key:

```bash
GEMINI_API_KEY=your_api_key_here
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
