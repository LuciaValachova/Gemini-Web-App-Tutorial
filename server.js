import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config'; // Use dotenv to manage environment variables
import cors from 'cors'; // Import the CORS middleware

const app = express();

// --- Middleware ---
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static('public')); // Serve static files from a 'public' folder
app.use(cors()); // Enable CORS for all origins (for development purposes)

// --- Initialize the Google Generative AI client ---
// Ensure you have a .env file with your GOOGLE_API_KEY
const API_KEY = process.env.GOOGLE_API_KEY;

// Log loaded API key (for debugging) and exit if not found
console.log("Loaded API Key (first 5 chars):", API_KEY ? API_KEY.substring(0, 5) : "Key not found");
if (!API_KEY) {
    console.error("ERROR: GOOGLE_API_KEY is not set in environment variables. Please check your .env file.");
    process.exit(1); // Exit the application if the key is missing
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Define API endpoint to handle chat requests ---
// This endpoint receives a prompt from the frontend, calls the Gemini API,
// and sends the AI's response back.
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body; // Get the prompt from the request body

        // Log the incoming request prompt
        console.log(`Received request with prompt: "${prompt}"`);

        if (!prompt) {
            console.warn("Warning: Received request with empty prompt.");
            return res.status(400).send({ error: 'Prompt is required' });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // --- Log the Gemini API response before sending to frontend ---
        console.log("Response from Gemini API:", text);

        res.send({ response: text });
    } catch (error) {
        // --- Enhanced error logging ---
        console.error("Error calling Gemini API or processing response:");
        console.error(error); // Log the full error object

        // Attempt to get more details from the API error response if available
        if (error.response) {
            console.error("API error status:", error.response.status);
            try {
                const errorData = await error.response.json();
                console.error("API error data (JSON):", errorData);
            } catch (jsonError) {
                console.error("Failed to parse API error response as JSON.");
                console.error("API error data (text):", await error.response.text());
            }
        }

        res.status(500).send({ error: 'Failed to generate content' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});