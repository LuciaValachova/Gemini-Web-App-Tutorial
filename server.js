import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import 'dotenv/config';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: uploadDir });
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

// --- TOTO JE TA PAMÄŤ ---
// Pre jednoduchosť budeme ukladať históriu správ tu (zmizne pri reštarte servera)
let chatHistory = [];

app.post('/api/chat', upload.single('file'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest" });

        // Inicializujeme chat s doterajšou históriou
        const chat = model.startChat({
            history: chatHistory,
        });

        let result;

        if (file) {
            // Ak posielaš obrázok, Gemini 1.5 potrebuje generateContent (obrázky sa zatiaľ ťažšie držia v histórii startChat)
            const uploadResult = await fileManager.uploadFile(file.path, {
                mimeType: file.mimetype,
                displayName: file.originalname,
            });

            result = await model.generateContent([
                { fileData: { mimeType: uploadResult.file.mimeType, fileUri: uploadResult.file.uri } },
                prompt
            ]);
            
            fs.unlinkSync(file.path);
        } else {
            // Ak je to len text, použijeme sendMessage, ktorý automaticky ukladá históriu
            result = await chat.sendMessage(prompt);
        }

        const responseText = result.response.text();

        // Uložíme si otázku a odpoveď do histórie pre nabudúce
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });

        res.send({ response: responseText });

    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).send({ error: error.message });
    }
});

// Endpoint na resetovanie chatu (ak chceš začať odznova)
app.post('/api/reset', (req, res) => {
    chatHistory = [];
    res.send({ message: "Konverzácia bola vymazaná." });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));