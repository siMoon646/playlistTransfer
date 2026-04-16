import express from 'express';
import cors from 'cors';
import session from 'express-session';
import 'dotenv/config';
import spotifyRoutes from './routes/spotifyRoutes.js'
import youtubeRoutes from './routes/youtubeRoutes.js'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})); // Allows your React app to communicate with this server
app.use(express.json()); // Allows the server to read JSON data in POST requests
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
        secure: false, // false for localhost (no HTTPS)
        sameSite: 'lax'
    }
}))

// any endpoint involving '/spotify' is handled with a router object from the spotifyRoutes.js file.
app.use('/spotify', spotifyRoutes);

// any endpoint involving '/youtube' is handeld with a router object from the youtubeRoutes.js file.
app.use('/youtube', youtubeRoutes);

// A basic "GET" route for testing
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start the server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});