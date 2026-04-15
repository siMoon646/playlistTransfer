import { exchangeCodeForTokens, getVideo, makePlaylist, addVideoToPlaylist } from '../models/youtubeModel.js';

export function login(req, res) {
    const SCOPES = [
        'https://www.googleapis.com/auth/youtube',
    ].join(' ');

    const params = new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
        response_type: 'code',
        scope: SCOPES,
        access_type: 'offline', // google specific param, equivalent to refresh token functionality.
    });

    res.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + params.toString());
}

export async function callback(req, res) {
    // the query object has a field called "code", this line pulls the code field from the query and stores it in a local variable called "code"
    const { code } = req.query;

    try {
        // retrieves tokens from the code from login
        const tokens = await exchangeCodeForTokens(code);
        // creates a 'spotifyAccessToken' field for an Express session object and stores the spotify access token in it.
        // saved to the session for future API access
        req.session.youtubeAccessToken = tokens.access_token;
        // creates a 'spotifyRefreshToken' field for an Express session object and stores the spotify refresh token in it.
        // Used for getting a new token when the previous access token expires.
        req.session.youtubeRefreshToken = tokens.refresh_token;
        // redirects to the frontend root.
        res.redirect("http://localhost:5173");
        // something went wrong
    } catch (err) {
        console.error("YouTube callback error:", err.message);
        res.status(500).send("YouTube authentication failed");
    }
}

export async function search(req, res) {
    const { q } = req.query; // https://developers.google.com/youtube/v3/docs/search/list q - string - represents the query term to search for on the YouTube API
    // req.query.q is undefined/""/null or any other falsy value.
    if (!query) return res.status(400).json({ error: "Missing search query parameter 'q'" });

    try {
        // getVideo function returns video based on given query(q) and stores in result
        const result = await getVideo(q, req.session.youtubeAccessToken);
        // Serializes the video's data as JSON and sends as response // takes object in memory -> turn into series of bytes (could be string) that is written to file or sent over network
        res.json(result);
    } catch (err) {
        console.error("YouTube search error:", err.message);
        res.status(500).json({ error: "YouTube search failed" });
    }
}

export async function createPlaylist(req, res) {
    const { title, description } = req.body; // grabs 'title' and 'description' fields from request body and stores in corresponding variables
    // hard check for title, because YouTube requires playlists have titles. Absent description fine.
    if (!title) return res.status(400).json({ error: "Missing playlist title" });

    try {
        // makePlaylist function creates a playlist on YouTube's end. Stores the result of the action in 'playlistCreationResult'
        const playlistCreationResult = await makePlaylist(title, description ?? "", req.session.youtubeAccessToken); // description is optional, as noted by '??' <nullish coalescing operator>. Empty string if (null or undef)
        // serializes the result resource as JSON and sends it as response
        res.status(201).json(playlistCreationResult); // status code 201 - created
    } catch (err) {
        console.error("YouTube createPlaylist error:", err.message);
        res.status(500).json({ error: "Failed to create YouTube playlist" });
    }
}

export async function addToPlaylist(req, res) {
    const { playlistId } = req.params; // grabs playlistId from URL path params <seperated by '/'> -> store in playlistId
    const { videoId } = req.body; // grabs videoId from field of request body -> store in videoId
    // no videoId = no video. Stop
    if (!videoId) return res.status(400).json({ error: "Missing videoId in request body" });

    try {
        // addVideoToPlaylist function adds video to playlist on Youtube's end and returns data regarding the completion of the action
        const additionResult = await addVideoToPlaylist(playlistId, videoId, req.session.youtubeAccessToken);
        // serializes the result as JSON and sends as response
        res.status(201).json(additionResult); // status code 201 - created
    } catch (err) {
        console.error("YouTube addToPlaylist error:", err.message);
        res.status(500).json({ error: "Failed to add video to playlist" });
    }
}

