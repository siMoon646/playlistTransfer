import { fetchTokens, fetchPlaylists } from "../models/spotifyModel.js";

// Only requesting this scope of permissions. We only want access to user's private playlists and collaborative playlists. Nothing else.
const SCOPES = ["playlist-read-private", "playlist-read-collaborative"].join(
    " ",
); // scopes = "playlist-read-private playlist-read-collaborative" can add more to the playlist should more be found.

// getting a code to exchange for an access token from spotify API
export function login(req, res) {
    const params = new URLSearchParams({
        // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
        // the developer's client ID on spotify:
        client_id: process.env.SPOTIFY_CLIENT_ID,
        // what we want from spotify:
        response_type: "code",
        // after auth, redirects here (success or fail)
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        // the code will only give an access token with permissions for scope spec.
        scope: SCOPES,
    });

    // redirects the user to a spotify URL concatinated with the params above.
    res.redirect("https://accounts.spotify.com/authorize?" + params.toString());
}

export async function callback(req, res) {
    // the query object has a field called "code", this line pulls the code field from the query and stores it in a local variable called "code"
    const { code } = req.query;

    try {
        // retrieves tokens from the code from login
        const tokens = await fetchTokens(code);
        // creates a 'accessToken' field for an Express session object and stores the spotify access token in it.
        // saved to the session for future API access
        req.session.accessToken = tokens.access_token;
        // creates a 'refreshToken' field for an Express session object and stores the spotify refresh token in it.
        // Used for getting a new token when the previous access token expires.
        req.session.refreshToken = tokens.refresh_token;
        // redirects to the frontend root.
        res.redirect("http://localhost:5173");
        // something went wrong
    } catch (err) {
        console.error("Spotify callback error:", err.message);
        res.status(500).send("Authentication failed");
    }
}

export async function getPlaylists(req, res) {
    // if there is no access token -> user is not logged in
    if (!req.session.accessToken) {
        // 401 -> you need to be logged in to do this
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        // call and wait for the fetchPlaylists function from the model directory and store its result in playlist. Authorized by the spotify access token)
        const playlists = await fetchPlaylists(req.session.accessToken);
        // respond by sending back playlists as json data.
        res.json(playlists);
    // something went wrong
    } catch (err) {
        console.error("Error fetching playlists:", err.message);
        // 500 -> something went wrong server-side.
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
}
