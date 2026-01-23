# AI Media Generator

A beautiful, responsive Next.js application that generates images and videos from text prompts using AI.

## Features

- 🎨 **Text-to-Image Generation** - Generate stunning images from text descriptions
- 🎬 **Text-to-Video Generation** - Create videos from prompts (when available)
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- 🎯 **No Scrolling** - Fixed viewport design with perfect spacing
- 💎 **Modern UI** - Professional gradient design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select whether you want to generate a **Photo** or **Video**
2. Enter your text prompt describing what you want to generate
3. Click "Generate" or press Ctrl/Cmd + Enter
4. Wait for the AI to generate your media
5. View the result on screen

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Hugging Face API** - Free AI image/video generation

## Notes

- Image generation uses Hugging Face's Stable Diffusion models (free tier)
- Video generation may have limited availability on free tiers
- First generation may take longer as models load
- No API keys required for basic usage

## Build for Production

```bash
npm run build
npm start
```
