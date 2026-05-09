import express from 'express';
import cors from 'cors';
import session from 'express-session';
import 'dotenv/config';
import spotifyRoutes from './routes/spotifyRoutes.js'
import youtubeRoutes from './routes/youtubeRoutes.js'
import convertRoutes from './routes/convertRoutes.js'

console.log('spotifyRoutes:', spotifyRoutes);

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_BASE_URL, // Allow requests from your React app's URL
  credentials: true
})); // Allows your React app to communicate with this server
app.use(express.json()); // Allows the server to read JSON data in POST requests

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
        secure: false, // false for localhost (no HTTPS)
        sameSite: 'lax',
    }
}))

// any endpoint involving '/spotify' is handled with a router object from the spotifyRoutes.js file.
app.use('/spotify', spotifyRoutes);

// any endpoint involving '/youtube' is handled with a router object from the youtubeRoutes.js file.
app.use('/youtube', youtubeRoutes);

// any endpoint involving '/convert' is handled with a router object from the convertRoutes.js file.
app.use('/convert', convertRoutes);

// A basic "GET" route for testing
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start the server
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('Server is running on port ' + (process.env.PORT || 3000));
});