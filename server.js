const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

// Используйте ваш API ключ
const apiKey = 'AIzaSyCacVxvnxZWDUShxSA1oXQ8XUvNugQfp1Q'; // Замените на ваш API ключ
const genAI = new GoogleGenerativeAI(apiKey);

// Инициализируйте модель с инструкцией "You are a professional farmer and expert in agriculture"
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a professional farmer and expert in agriculture",
});

// Конфигурация генерации
const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

let chatSession = null;

// Serve static files (CSS, JS, Images)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Parse incoming JSON requests
app.use(bodyParser.json());

// Route for the home page (dashboard)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});

// Serve specific pages, like billing.html
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'pages', page));
});

// Начало сессии чата
async function startChat() {
  if (!chatSession) {
    chatSession = model.startChat({
      generationConfig,
      history: [], // Здесь сохраняется история сообщений
    });
  }
}

// API для отправки сообщений в чат
app.post('/send-message', async (req, res) => {
  const userMessage = req.body.message;

  if (!chatSession) {
    await startChat();
  }

  try {
    // Отправка сообщения пользователю
    const result = await chatSession.sendMessage(userMessage);
    const aiResponse = await result.response.text(); // Получение текста ответа от AI

    // Возврат ответа ИИ на фронтенд
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error('Error while sending message to AI:', error);
    res.status(500).send('Error in AI processing');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
