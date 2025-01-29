import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import bodyParser from 'body-parser';



dotenv.config();
const app = express();
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors());
app.use(express.json());

// Add logging to verify route registration
console.log('Registering routes...');
app.use('/api', routes); // Make sure this matches your expected endpoint

app.get('/', (req, res) => {
  res.send('API is working!');
});
app.use((req, res, next) => {
  console.error(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route notsss found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
