import express from 'express';
import {login, callback, search, createPlaylist, addToPlaylist} from '../controllers/youtubeControllers.js';

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/search', search) // search YouTube for a video
router.post('/playlists', createPlaylist); // create a playlist on a user's YouTube account 
router.post('/playlists/:playlistId/videos', addToPlaylist); // add songs to a playlist on a user's YouTube account

export default router;
