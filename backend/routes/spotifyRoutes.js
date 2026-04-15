import express from 'express';
import { login, callback, getPlaylists, getPlaylistTracks } from '../controllers/spotifyControllers.js';

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/playlists', getPlaylists);
router.get('/playlists/:playlistId/tracks', getPlaylistTracks);

export default router;