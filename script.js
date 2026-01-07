// Referencie na HTML elementy
const form = document.getElementById('prompt-form');
const promptInput = document.getElementById('prompt-input');
const fileInput = document.getElementById('file-input'); // Musíš mať v HTML: <input type="file" id="file-input">
const responseDiv = document.getElementById('response');
const clearButton = document.getElementById('clear-button');

// Funkcia pre odoslanie (Submit)
form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const prompt = promptInput.value;
    const file = fileInput.files[0]; // Získame vybraný súbor

    if (!prompt) {
        alert("Prosím, zadaj otázku.");
        return;
    }

    responseDiv.textContent = 'Gemini (Pro) generuje...';

    // Používame FormData, aby sme mohli poslať text aj súbor naraz
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (file) {
        formData.append('file', file);
    }

    try {
        // Použi svoju URL z Renderu
        const res = await fetch('https://gemini-backend-lucia.onrender.com/api/chat', {
            method: 'POST',
            // DÔLEŽITÉ: Pri FormData nenastavujeme 'Content-Type' hlavičku! 
            // Prehliadač ju nastaví automaticky vrátane tzv. "boundary".
            body: formData, 
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        responseDiv.textContent = data.response;

    } catch (error) {
        console.error("Error:", error);
        responseDiv.textContent = 'Chyba: Nepodarilo sa získať odpoveď.';
    }
});

// Funkcia pre tlačidlo Clear (Vymazať)
clearButton.addEventListener('click', () => {
    promptInput.value = ''; 
    if (fileInput) fileInput.value = ''; // Vymaže aj vybraný súbor
    responseDiv.textContent = 'AI Response will appear here.';
});