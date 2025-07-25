Project Documentation: Gemini API Web App Tutorial

This project presents a simple web application that demonstrates the interaction between a frontend and a backend using Node.js, where the backend communicates with the Google Gemini API for text generation and potentially multimodal input processing (e.g., text and images).

Project Overview

The goal of this project is to provide a basic structure for developing web applications that leverage the advanced capabilities of generative artificial intelligence through the Gemini API. The application consists of two main parts:
1. Frontend: The User Interface (UI) built with HTML, Tailwind CSS, and JavaScript, where the user enters their requests (text) and views responses from the Gemini API. It includes buttons for generating responses and clearing the input field.
2. Backend (Node.js): The server-side component that receives requests from the frontend, securely communicates with the Gemini API, and sends responses back to the frontend.

Technologies Used

• Node.js with Express.js: For creating a robust and scalable backend server.
• Google Gemini API: For accessing Gemini's generative AI models (specifically gemini-1.5-flash).
• HTML: For the structure of the web page.
• Tailwind CSS: For fast and responsive design and styling of frontend elements, including button colors (magenta for  Generate, red for Clear) and input field focus rings (lighter magenta).
• JavaScript: For interactive frontend logic (sending requests, processing responses, clearing fields).
dotenv: For securely loading environment variables (like the API key) from a .env file.
cors: Middleware for Node.js/Express.js to handle Cross-Origin Resource Sharing (CORS) issues, enabling communication between the frontend and backend when they run on different ports/domains.

Key Gemini API Functions

In this project, the generateContent function from the Gemini API is primarily used. This function allows for:
• Text Generation: From text input (e.g., questions, requests to write a story, translation).
• Multimodal Input: Although this project currently only uses text, the Gemini API also supports processing combined inputs, such as text and images.

Project Setup

To run and test this application, follow these steps:

1. Clone the Repository (if already on GitHub)
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_NAME>

2. Install Node.js
Ensure you have Node.js installed. If not, download it from the official Node.js website.

3. Install Dependencies
Navigate to the root directory of your project (where package.json, server.js, and script.js are located) and install the necessary dependencies:

npm install express dotenv cors @google/generative-ai
(Note: If you already have package.json with these dependencies, just run npm install.)

4. Obtain and Configure Your Google API Key
   1. Visit Google AI Studio.
   2. Sign in with your Google account.
   3. Create a new API key (or use an existing one).
   4. IMPORTANT: Never embed your API key directly in frontend code or commit it to a public GitHub repository!
   5. Create a file named .env in the root directory of your project and add your API key in the following  format:
     GOOGLE_API_KEY=YOUR_ACTUAL_API_KEY_FROM_GOOGLE_AI_STUDIO_HERE

    For example: GOOGLE_API_KEY=AIzaSyC_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
    Remember to add .env to your .gitignore file so that this sensitive file never gets uploaded to your Git repository!

5. Start the Backend Server
In your integrated terminal in VS Code (or another terminal), ensure you are in the project's root directory and start the server:

node server.js

The server should start listening on port 3000, and you should see a message in the terminal like Server running on http://localhost:3000.

6. Launch the Frontend
The frontend is a static web page. Open the public/index.html file (or index.html if it's not in a public folder) directly in your web browser.

How to Use the Application

Once the frontend and backend are successfully running:
1. Enter Text: Type your query or question into the text input field.
2. Click "Generate": The application will send your request to the backend. The "Generate" button is highlighted in magenta.
3. Backend Processes Request: The backend receives the request, calls the Gemini API with your input, and awaits a response.
4. Display Response: The response from the Gemini API is sent back to the frontend and displayed in the application.5. Clear Text: Click the "Clear" button to clear the text from the input field and optionally the AI response area.

Project Structure

/
├── server.js               # Backend server (Node.js with Express.js)
├── script.js               # Frontend JavaScript logic
├── public/                 # Folder for static files (if you are using one)
│   └── index.html          # Frontend HTML file
├── .env                    # Environment variables file (API key)
├── .gitignore              # Git ignore file for excluding files from version control
└── package.json            # Defines project dependencies and scripts

Deployment
To make your application accessible online, you will deploy the backend and frontend separately.

1. Deploying the Backend to Render.com
Render.com provides a free tier suitable for small Node.js projects.

Sign up/Log in to Render.com: Go to https://render.com/.

Create a New Web Service: From your Render dashboard, click "New" -> "Web Service".

Connect Your GitHub Repository: Authorize Render to access your GitHub account and select your LuciaValachova/Gemini-Web-App-Tutorial repository.

Configure Service Settings:

Name: Choose a unique name (e.g., gemini-backend-lucia). This will be part of your public URL.

Root Directory: Leave empty (as server.js is in the root).

Runtime: Should auto-detect Node.

Build Command: npm install

Start Command: npm start (as defined in package.json).

Branch: main

Instance Type: Free

Add Environment Variable:

Scroll down to "Environment Variables".

Add a new variable: Key: GOOGLE_API_KEY, Value: Your actual Gemini API key (the one from your local .env file).

Create Web Service: Click "Create Web Service".

Monitor Deployment: Render will build and deploy your service. Once live, copy the public URL provided (e.g., https://your-service-name.onrender.com).

2. Deploying the Frontend to GitHub Pages
GitHub Pages is ideal for hosting static web content like your HTML, CSS, and JavaScript.

Move Frontend Files to Root: Ensure index.html and script.js (and any CSS files) are directly in the root directory of your GitHub repository. (We already did this in a previous step.)

Configure GitHub Pages Settings:

Go to your GitHub repository: https://github.com/LuciaValachova/Gemini-Web-App-Tutorial

Click on the "Settings" tab.

In the left sidebar, click "Pages".

Under "Build and deployment" -> "Source":

Branch: Select main.

Folder: Select /root (or /). This tells GitHub Pages to serve content from the repository's root.

Click "Save".

Add .nojekyll File: To ensure GitHub Pages serves your raw HTML/JS without Jekyll processing, create an empty file named .nojekyll in the root of your repository. Commit and push this file to GitHub if you haven't already.

Monitor Deployment: GitHub Pages will start building your site. This may take a few minutes. Once deployed, the URL will be displayed on the "Pages" settings page (e.g., https://luciavalachova.github.io/Gemini-Web-App-Tutorial/).

3. Update Frontend API URL
After your backend is deployed on Render.com and you have its public URL, you must update your frontend's script.js to point to this new backend URL.

Open script.js in your local project.

Find the fetch call:

const res = await fetch('/api/chat', {

Change the URL to your Render.com backend's public URL:

const res = await fetch('https://YOUR-RENDER-BACKEND-URL.onrender.com/api/chat', {

Replace https://YOUR-RENDER-BACKEND-URL.onrender.com with the actual URL from Render.com!

Commit and Push this change to GitHub:

git add script.js
git commit -m "Update frontend API URL to deployed Render backend"
git push origin main

This will trigger a new GitHub Pages build, ensuring your frontend uses the correct backend URL.

Now, your application will be fully interactive and accessible via your GitHub Pages URL!