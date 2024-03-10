document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('query');
    const submitBtn = document.getElementById('submitBtn');
    const resultDiv = document.getElementById('result');
    const chatHistoryDiv = document.getElementById('chatHistory');

    submitBtn.addEventListener('click', async () => {
        const query = queryInput.value;

        // Voeg de vraag toe aan de chatgeschiedenis
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.textContent = `Jij: ${query}`;
        chatHistoryDiv.appendChild(questionElement);

        // Disable de submit knop en toon de loading spinner
        submitBtn.disabled = true;
        submitBtn.innerText = 'Bezig...';

        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();

            // Voeg het antwoord toe aan de chatgeschiedenis
            const answerElement = document.createElement('div');
            answerElement.classList.add('answer');
            answerElement.textContent = `AI: ${data.response}`;
            chatHistoryDiv.appendChild(answerElement);
        } catch (error) {
            console.error('Er is een fout opgetreden:', error);
        } finally {
            // Enable de submit knop en verwijder de loading spinner
            submitBtn.disabled = false;
            submitBtn.innerText = 'Verstuur';
        }
    });
});
