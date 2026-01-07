import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import 'dotenv/config';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
    console.log("Priečinok 'uploads' bol vytvorený.");
}
const upload = multer({ dest: 'uploads/' }); // Dočasný priečinok pre nahrávanie

// --- Middleware ---
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// --- Inicializácia ---
const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash"; // Ak v .env chýba, použije flash

console.log("Loaded API Key (first 5 chars):", API_KEY ? API_KEY.substring(0, 5) : "Key not found");
console.log("Target Model:", MODEL_NAME);

if (!API_KEY) {
    console.error("ERROR: GOOGLE_API_KEY is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// --- API Endpoint ---
// Používame upload.single('file') aby sme prijali súbor s kľúčom 'file'
app.post('/api/chat', upload.single('file'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        console.log(`Received prompt: "${prompt}"`);
        if (file) console.log(`Received file: ${file.originalname} (${file.mimetype})`);

        if (!prompt) {
            return res.status(400).send({ error: 'Prompt is required' });
        }

        // Pripravíme časti správy pre Gemini
        let promptParts = [prompt];

        // Ak bol poslaný súbor, nahráme ho do Google File API
        if (file) {
            console.log("Uploading file to Google AI...");
            const uploadResult = await fileManager.uploadFile(file.path, {
                mimeType: file.mimetype,
                displayName: file.originalname,
            });

            // Pridáme odkaz na súbor do požiadavky
            promptParts.push({
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri,
                },
            });

            // Po nahraní do Google môžeme lokálny súbor zmazať
            fs.unlinkSync(file.path);
        }

        // Generovanie obsahu
        const result = await model.generateContent(promptParts);
        const response = await result.response;
        const text = response.text();

        console.log("Response from Gemini API:", text);
        res.send({ response: text });

    } catch (error) {
        console.error("Error calling Gemini API:");
        console.error(error);

        // Ak sa niečo pokazilo pri nahrávaní, skúsime vymazať dočasný súbor, ak existuje
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).send({ error: 'Failed to generate content', details: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});