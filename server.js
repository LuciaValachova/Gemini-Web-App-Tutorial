import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// --- FUNKCIA NA VÝPIS MODELOV (Zavolá sa pri štarte) ---
async function debugModels() {
    try {
        console.log("--- DEBUG: LISTING AVAILABLE MODELS ---");
        // Použijeme priamy fetch na Google API, aby sme videli pravdu
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.models) {
            data.models.forEach(m => console.log(`Dostupný model: ${m.name}`));
        } else {
            console.log("Žiadne modely neboli nájdené. Skontroluj API kľúč.");
            console.log("Odpoveď od Google:", JSON.stringify(data));
        }
    } catch (err) {
        console.error("Chyba pri hľadaní modelov:", err.message);
    }
}

debugModels();

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        // Skúsime tento názov - je to najuniverzálnejší názov
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.send({ response: response.text() });
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
