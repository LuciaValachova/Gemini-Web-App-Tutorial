// Get references to the HTML elements
const form = document.getElementById('prompt-form');
const promptInput = document.getElementById('prompt-input');
const responseDiv = document.getElementById('response');
const clearButton = document.getElementById('clear-button'); // Get the new clear button by its ID

// Add event listener for the form submission (Generate button)
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    const prompt = promptInput.value; // Get the current value from the input field
    responseDiv.textContent = 'Generating...'; // Show a loading message

    try {
        // Send a POST request to the backend API
        const res = await fetch('https://gemini-backend-lucia.onrender.com/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify that we're sending JSON
            },
            body: JSON.stringify({ prompt: prompt }), // Convert the prompt object to a JSON string
        });

        // Check if the response from the server was successful (status code 2xx)
        if (!res.ok) {
            const errorData = await res.json(); // Attempt to parse error response as JSON
            // Throw an error with a more specific message if available, otherwise a generic one
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        // Parse the successful response as JSON
        const data = await res.json();
        // Display the AI's response in the response area
        responseDiv.textContent = data.response;

    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error:", error);
        // Display a user-friendly error message in the response area
        responseDiv.textContent = 'Error: Could not get a response.';
    }
});

// Add event listener for the Clear button
clearButton.addEventListener('click', () => {
    promptInput.value = ''; // Clear the text in the prompt input field
    responseDiv.textContent = 'AI Response will appear here.'; // Optionally, clear the response area as well
});