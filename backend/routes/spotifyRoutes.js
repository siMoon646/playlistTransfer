import express from 'express';
import { login, callback, getPlaylists } from '../controllers/spotifyController.js';

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/playlists', getPlaylists);

export default router;