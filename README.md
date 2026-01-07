# Building a Multimodal AI Chat App: Our Journey with Gemini 1.5 Pro 🚀

## 🌐 Live Demo
Experience the result of our project here: [Gemini AI Live](https://luciavalachova.github.io/Gemini-Web-App-Tutorial/)

---

## 📖 About This Project
This project is the result of a step-by-step collaborative development process. We started with a simple idea: to build a bridge between a custom web interface and Google's most powerful AI. 

Throughout our journey, we evolved from a basic text-only chat to a **full multimodal application** that can "see" images, "hear" audio, and "understand" video files using the latest **Gemini 1.5 Pro** engine.

## 🛠️ What We Built Together

### 1. The Brain (Backend - Node.js & Express)
We built a robust server that doesn't just pass text, but handles complex data:
* **Smart API Routing:** We created a secure bridge to Google AI Studio.
* **Multer Integration:** We added the ability to handle file uploads safely.
* **File Manager:** We implemented the `GoogleAIFileManager` to process multimedia so the AI can analyze it.
* **Security First:** We used `dotenv` to ensure API keys are never exposed.

### 2. The Face (Frontend - HTML5 & Tailwind CSS)
We designed a clean, magenta-themed interface that is both beautiful and functional:
* **Responsive Design:** Works perfectly on mobile and desktop.
* **Multimodal Input:** A custom file upload system for photos, videos, and documents.
* **Real-time Interaction:** Using the Fetch API and `FormData` to communicate with our server.

### 3. The Power (Gemini 1.5 Pro)
We chose the **Gemini 1.5 Pro** model because of its massive context window and its ability to process different types of information (text + files) simultaneously.

---

## 🚀 How to Set Up Our Project

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Step 1: Clone and Prepare
```bash
git clone [https://github.com/LuciaValachova/Gemini-Web-App-Tutorial.git](https://github.com/LuciaValachova/Gemini-Web-App-Tutorial.git)
cd Gemini-Web-App-Tutorial/gemini-webapp
npm install

### Step 2: Configure Your Secret Key
Create a .env file in the root folder and put there this :
GOOGLE_API_KEY=your_key_from_google_ai_studio
GEMINI_MODEL=gemini-1.5-pro-latest 

### Step 3: Run It Locally
```bash
node server.js
Open http://localhost:3000 and start chatting!

🌍 Deployment Strategy
We successfully deployed this app using two different platforms to keep it free and efficient:

Backend: Hosted on Render.com (Auto-deploys from GitHub).

Frontend: Hosted on GitHub Pages for lightning-fast static delivery.

Connection: We linked them together by pointing our frontend fetch calls to our live Render URL.

📝 Final Thoughts
This project shows how accessible AI development has become. By combining Node.js, modern CSS, and Google's Gemini API, we created a tool that was once only possible for large tech companies.