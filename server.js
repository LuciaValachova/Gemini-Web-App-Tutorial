import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import 'dotenv/config';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();
const uploadDir = 'uploads/';

// Poistka pre priečinok na súbory
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
    console.log("Priečinok 'uploads' bol vytvorený.");
}

const upload = multer({ dest: uploadDir });

// --- Middleware ---
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// --- Inicializácia ---
const API_KEY = process.env.GOOGLE_API_KEY;
// Zmenené na flash pre lepšiu stabilitu pri súboroch
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash"; 

console.log("Loaded API Key (first 5 chars):", API_KEY ? API_KEY.substring(0, 5) : "Key not found");
console.log("Target Model:", MODEL_NAME);

if (!API_KEY) {
    console.error("ERROR: GOOGLE_API_KEY is not set.");
    process.exit(1);
}

// Inicializácia s explicitným nastavením verzie API v1beta
const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

// DÔLEŽITÁ OPRAVA: Pridanie verzie v1beta priamo do inicializácie modelu
const model = genAI.getGenerativeModel(
    { model: MODEL_NAME },
    { apiVersion: 'v1beta' }
);

// --- API Endpoint ---
app.post('/api/chat', upload.single('file'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        console.log(`Received prompt: "${prompt}"`);
        if (file) console.log(`Received file: ${file.originalname} (${file.mimetype})`);

        if (!prompt) {
            return res.status(400).send({ error: 'Prompt is required' });
        }

        let promptParts = [];

        // Ak bol poslaný súbor, nahráme ho cez FileManager
        if (file) {
            console.log("Uploading file to Google AI...");
            const uploadResult = await fileManager.uploadFile(file.path, {
                mimeType: file.mimetype,
                displayName: file.originalname,
            });

            // Pridáme súbor do promptu
            promptParts.push({
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri,
                },
            });

            // Odstránime lokálny súbor po nahratí
            fs.unlinkSync(file.path);
        }

        // Pridáme textový prompt
        promptParts.push(prompt);

        console.log("Generating content with Gemini...");
        const result = await model.generateContent(promptParts);
        const response = await result.response;
        const text = response.text();

        console.log("Response from Gemini API successful.");
        res.send({ response: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error.message);
        
        // Vyčistenie súboru v prípade chyby
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).send({ 
            error: 'Failed to generate content', 
            details: error.message 
        });
    }
});

// Render často vyžaduje port z premennej prostredia
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
