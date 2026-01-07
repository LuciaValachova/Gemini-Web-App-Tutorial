# 🚀 Building a Multimodal AI Chat App
### Our Collaborative Journey with Gemini 1.5 Pro

---

## 🌐 Live Project
Experience the live application here:  
👉 **[Gemini AI Live Demo](https://luciavalachova.github.io/Gemini-Web-App-Tutorial/)**

---

## 📖 About This Project
This application is the result of a step-by-step collaborative development process. We started with a simple text-based chat and evolved it into a **full multimodal AI assistant**. Using Google's most advanced engine, this app can now "see" images, "hear" audio, and "understand" video files.

### 🌟 Key Features
* **Multimodal Intelligence:** Upload photos, videos, or PDFs and ask questions about them.
* **High Performance:** Powered by the `gemini-1.5-pro` model.
* **Modern UI:** A clean, responsive fuchsia-themed interface built with Tailwind CSS.
* **Secure Backend:** A Node.js server that handles file uploads safely using Multer.

---

## 🛠️ Technology Stack
| Component | Technology Used |
| :--- | :--- |
| **Frontend** | HTML5, Tailwind CSS, JavaScript (Fetch & FormData) |
| **Backend** | Node.js, Express.js |
| **AI Integration** | Google Generative AI SDK (`@google/generative-ai`) |
| **File Handling** | Multer & Google AI FileManager |
| **Deployment** | Render.com (Backend) & GitHub Pages (Frontend) |

---

## 🚀 How to Set Up Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
```bash
# Clone the repository
git clone [https://github.com/LuciaValachova/Gemini-Web-App-Tutorial.git](https://github.com/LuciaValachova/Gemini-Web-App-Tutorial.git)

# Enter the project folder
cd Gemini-Web-App-Tutorial/gemini-webapp

# Install dependencies
npm install

### 3. Environment Configuration
Create a .env file in the root directory and add your credentials:
GOOGLE_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-pro

### 4. Running the App
node server.js

The app will be available at http://localhost:3000.

## 🌍 Deployment Details
We used a hybrid deployment strategy to ensure high availability:

Backend: Hosted on Render.com with automatic CI/CD from the GitHub repository.

Frontend: Hosted on GitHub Pages for fast, secure static content delivery.

Integration: The frontend communicates with the live Render API URL using secure asynchronous requests.

## 📝 Final Thoughts
This project demonstrates how accessible modern AI development has become. By combining Node.js with Google's Gemini API, we've built a powerful tool that processes complex multimedia data in seconds. It has been an incredible journey of learning and building!

Happy Coding! 💻✨