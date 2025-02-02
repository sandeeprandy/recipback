import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import bodyParser from 'body-parser';
import { dbInit } from './database/db.js'; // Import your database initialization function

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    console.log('Initializing database connection...');
    await dbInit(); // Ensure database is initialized before proceeding
    console.log('Database initialized successfully.');

    console.log('Registering routes...');
    app.use('/api', routes); // Register routes only after DB is ready

    app.get('/', (req, res) => {
      res.send('API is working in main branch!');
    });

    // Handle 404
    app.use((req, res) => {
      console.error(`404 Not Found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({ message: 'Route not found' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1); // Exit process if database connection fails
  }
};

startServer();
