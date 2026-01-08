const form = document.getElementById('prompt-form');
const promptInput = document.getElementById('prompt-input');
const fileInput = document.getElementById('file-input');
const responseDiv = document.getElementById('response');
const clearButton = document.getElementById('clear-button');

// Pomocná funkcia na pridanie bubliny do chatu
function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    
    if (isUser) {
        msgDiv.className = "self-end bg-fuchsia-600 text-white p-3 rounded-lg max-w-[80%] shadow-sm";
        msgDiv.textContent = text; 
    } else {
        // Pridali sme triedu 'markdown-body', aby kód vyzeral profesionálne
        msgDiv.className = "self-start bg-white border border-gray-200 text-gray-800 p-3 rounded-lg max-w-[90%] shadow-sm markdown-body";
        
        // TOTO JE KĽÚČ: Premení surový text s kódom na pekné bloky
        msgDiv.innerHTML = marked.parse(text); 
    }
    
    responseDiv.appendChild(msgDiv);
    responseDiv.scrollTop = responseDiv.scrollHeight;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const prompt = promptInput.value.trim();
    const file = fileInput.files[0];

    if (!prompt) return;

    // 1. Zobraz tvoju správu v okne
    addMessage(prompt, true);
    promptInput.value = ''; 

    // 2. Dočasná bublina pre indikáciu načítania
    const loadingDiv = document.createElement('div');
    loadingDiv.className = "self-start text-gray-400 text-xs italic ml-2";
    loadingDiv.textContent = "Gemini premýšľa...";
    responseDiv.appendChild(loadingDiv);
    responseDiv.scrollTop = responseDiv.scrollHeight;

    const formData = new FormData();
    formData.append('prompt', prompt);
    if (file) formData.append('file', file);

    try {
        const res = await fetch('https://gemini-backend-lucia.onrender.com/api/chat', {
            method: 'POST',
            body: formData, 
        });

        responseDiv.removeChild(loadingDiv); // Odstráň indikátor načítania

        if (!res.ok) throw new Error(`Chyba servera: ${res.status}`);

        const data = await res.json();
        
        // 3. Zobraz odpoveď od AI
        addMessage(data.response, false);

    } catch (error) {
        if (loadingDiv.parentNode) responseDiv.removeChild(loadingDiv);
        addMessage("Chyba: Nepodarilo sa spojiť so serverom.", false);
        console.error(error);
    }
});

clearButton.addEventListener('click', async () => {
    // Zavoláme reset na serveri, aby si vymazal históriu
    try {
        await fetch('https://gemini-backend-lucia.onrender.com/api/reset', { method: 'POST' });
    } catch (e) {}

    responseDiv.innerHTML = '<div class="text-center text-gray-400 text-sm italic">Konverzácia bola vymazaná.</div>';
    promptInput.value = '';
    fileInput.value = '';
});