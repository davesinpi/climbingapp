# Road to V10 - The Ultimate Climbing Workout Companion

**Road to V10** is a specialized, production-ready web application designed for bouldering and sport climbing enthusiasts. It bridges the gap between raw data logging and intelligent training analysis, helping you systematically progress from your current level to double digits.

## 🧗 Core Training Modules

- **Project Tracker**: Log attempts, grades, and send rates for board climbing (Moon, Kilter, Tension) or gym sessions.
- **Finger Power**: Dedicated hangboard protocols with weight, edge size (mm), and hang-time tracking.
- **Physical Conditioning**: Strength and prehab logging to build the base needed for high-level climbing.
- **Custom Templates**: Build your own "Power Endurance" or "Max Strength" sessions once and reuse them forever.
- **AI Performance Coach**: Leverages Gemini 3 to analyze your volume and intensity, providing actionable tips to avoid injury and optimize gains.

## 🛠 Integration & Setup

To enable the **AI Performance Coach**, you must link your Gemini API credentials manually:

1. Navigate to the **Settings** tab.
2. Under the **Manual API Configuration** section, click **"Configure API Key"**.
3. Use the system dialog to select a Google Cloud project with billing enabled.

## 🛡 Privacy & Architecture

- **Local-First Data**: All your workout logs are stored exclusively in your browser's local storage. Your training data never leaves your device unless sent for AI analysis.
- **Gemini Intelligence**: Uses the latest Gemini 3 Flash model for low-latency, high-precision coaching feedback.
- **Responsive Design**: Designed to work perfectly on your phone at the gym or your tablet at home.

---
*Built for climbers who know that consistency is the only way to V10.*