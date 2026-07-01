require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.get('/', (req, res) => {
  res.send('Hello! Backend server is working! 🎉');
});

app.get('/test-db', async (req, res) => {
  try {
    await client.connect();
    res.send('✅ Database connected successfully!');
  } catch (err) {
    res.send('❌ Database connection failed: ' + err.message);
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Ellaa fields um fill pannunga' });
    }

    await client.connect();
    const db = client.db('portfolioDB');
    const collection = db.collection('messages');

    await collection.insertOne({
      name: name,
      email: email,
      message: message,
      submittedAt: new Date()
    });

    res.json({ success: true, msg: 'Message save aagiduchu! Thanks!' });
  } catch (err) {
    res.status(500).json({ error: 'Edhavadhu prachana: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});