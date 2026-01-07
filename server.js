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

// NASTAVUJEME NAJNOVŠÍ A NAJVÝKONNEJŠÍ MODEL Z TVOJHO ZOZNAMU
const MODEL_NAME = "gemini-3-pro-preview"; 

const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

// Inicializácia modelu s podporou pre najnovšie funkcie
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

app.post('/api/chat', upload.single('file'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        if (!prompt) {
            return res.status(400).send({ error: 'Prompt is required' });
        }

        let promptParts = [];

        if (file) {
            console.log(`🚀 Nahrávam multimédiá pre ${MODEL_NAME}...`);
            const uploadResult = await fileManager.uploadFile(file.path, {
                mimeType: file.mimetype,
                displayName: file.originalname,
            });

            promptParts.push({
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri,
                },
            });

            // Vyčistíme lokálne úložisko
            fs.unlinkSync(file.path);
        }

        promptParts.push(prompt);

        console.log(`🧠 Premýšľam pomocou ${MODEL_NAME}...`);
        const result = await model.generateContent(promptParts);
        const response = await result.response;
        
        res.send({ response: response.text() });

    } catch (error) {
        console.error("❌ API Error:", error.message);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🔥 Super-AI Server beží na porte ${PORT} s modelom ${MODEL_NAME}`);
});