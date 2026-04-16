import { convertSpotifyTracksToYouTubePlaylist } from "../models/convertModel.js";

export async function convert(req, res) {
    const { spotifyPlaylistId, youtubePlaylistId } = req.body;
 
    // Verify that we have a source and a target.
    if (!spotifyPlaylistId || !youtubePlaylistId) { // checks for falsy values--the empty string or undefined in this case.
        return res.status(400).json({ // 400 - bad req
            error: "Missing required fields: spotifyPlaylistId and youtubePlaylistId",
        });
    }
 
    // Check if logged in on both spotify and youtube
    if (!req.session.spotifyAccessToken) { // not logged in on spotify
        return res.status(401).json({ error: "Not logged in to Spotify" }); // 401 - unauthorized
    }
    if (!req.session.youtubeAccessToken) { // not logged in on YouTube
        return res.status(401).json({ error: "Not logged in to YouTube" }); // 401 - unauthorized
    }
 
    try {
        // orchestrator function
        const results = await convertSpotifyTracksToYouTubePlaylist( // function returns an object whose fields are arrays representing tracks that could be added and tracks that couldn't be added
            req.session.spotifyAccessToken,
            req.session.youtubeAccessToken,
            spotifyPlaylistId,
            youtubePlaylistId
        );
 
        // responds with status code and serializes data as JSON
        res.status(200).json({ // 200 - ok
            details: results,
        });
    } catch (err) {
        console.error("Conversion error:", err.message);
        res.status(500).json({ error: "Conversion failed" });
    }
}