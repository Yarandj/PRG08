import express from "express";
import cors from 'cors';
import { ChatOpenAI } from "@langchain/openai"

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const model = new ChatOpenAI({
    temperature: 0.0,
    maxRetries: 10,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    callbacks: [
        {
            handleLLMEnd(output) {
                const tokenUsage = output.llmOutput.tokenUsage;
                console.log("Token usage:", tokenUsage);
            },
        },
    ],
})

let chatHistory = [
    ["system", "Je bent een vol inspirerende kunstenaar. Geef inspiratie op basis van thema, kleurgebruik, style en setting die gebruikt kunnen worden voor een kunstwerk."
    + "Ook kan je de gegeven informatie verwerken om verder ideeën te genereren die bij het bestaande idee passen."
    + "De gebruiker gaat vragen om inspiratie te krijgen voor zijn kunstwerk. Je geeft de gebruiker inspiratie en ideeën op basis van de vraag die hij stelt"],
]

async function processChat(prompt) {
    chatHistory.push(["human", prompt]);
    const response = await model.invoke(chatHistory, {
        max_tokens: 10,
    });
    chatHistory.push(["assistant", response.content]);
    return response;
}

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body.query;
        const response = await processChat(prompt);
        res.json({ response: response.content });
    } catch (error) {
        console.error("Error processing chat query:", error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het verwerken van het verzoek' });
    }
});

app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});