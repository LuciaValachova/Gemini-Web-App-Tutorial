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
}

const upload = multer({ dest: uploadDir });

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;

// Ak Render nepošle model, použijeme túto overenú verziu
const MODEL_NAME = "gemini-1.5-flash"; 

if (!API_KEY) {
    console.error("ERROR: GOOGLE_API_KEY is not set.");
    process.exit(1);
}

// --- OPRAVA: Inicializácia cez STABILNÚ verziu v1 ---
const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

// Tu používame model bez v1beta prefixu
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

app.post('/api/chat', upload.single('file'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        if (!prompt) {
            return res.status(400).send({ error: 'Prompt is required' });
        }

        let contents = [];

        if (file) {
            console.log("Processing file for Gemini v1 API...");
            // Pre verziu v1 je niekedy lepšie poslať súbor ako inlineData, 
            // ale skúsime najprv FileManager s touto úpravou:
            const uploadResult = await fileManager.uploadFile(file.path, {
                mimeType: file.mimetype,
                displayName: file.originalname,
            });

            contents.push({
                role: "user",
                parts: [
                    {
                        fileData: {
                            mimeType: uploadResult.file.mimeType,
                            fileUri: uploadResult.file.uri,
                        },
                    },
                    { text: prompt },
                ],
            });

            fs.unlinkSync(file.path);
        } else {
            contents.push({
                role: "user",
                parts: [{ text: prompt }],
            });
        }

        console.log("Calling Gemini API v1...");
        // Používame generovanie cez objekt contents, čo je najstabilnejšia cesta
        const result = await model.generateContent({ contents });
        const response = await result.response;
        const text = response.text();

        res.send({ response: text });

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
