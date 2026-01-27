# Road to V10 - Climbing Workout Planner

Road to V10 is a production-ready MVP designed for climbers to plan, log, and analyze their training sessions. It combines specialized climbing metrics with AI-powered coaching to help you break through plateaus and reach V10.

## Features

- **Session Logging**: Specialized inputs for Bouldering (Grades/Attempts), Hangboard (Weight/Edge Size/Hang Time), and Strength training.
- **Workout Templates**: Create reusable structures for your training blocks (Warm-up, Power, Capacity, etc.).
- **Interactive Calendar**: Plan future sessions and review your historical training volume.
- **AI Performance Coach**: Powered by Gemini 3, the coach analyzes your recent sessions to suggest focuses for upcoming workouts.
- **Progress Tracking**: Visualize your training volume and personal records over time.
- **Local-First**: All data is stored in your browser's local storage for speed and privacy.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS
- **Visualization**: Recharts
- **AI Integration**: @google/genai (Gemini 3 Flash)
- **State/Storage**: LocalStorage with a centralized StorageService
- **Icons**: Heroicons (SVG)

## Setup

To use the AI coaching features, you must configure a Gemini API key:
1. Go to **Settings**.
2. Click **Link API Key Manually**.
3. Choose a project with Gemini API access and billing enabled.

## Training Philosophy

The app is built around the "Block Periodization" concept, allowing climbers to segment their sessions into logical blocks of training, ensuring balanced development of strength, power, and technique.
