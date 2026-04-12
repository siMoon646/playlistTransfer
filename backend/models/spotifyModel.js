const BASE_URL = 'https://api.spotify.com/v1';

export async function fetchTokens(code) {
    const params = new URLSearchParams({
        grant_type: 'authorization_code', // URL search param specifying a desire for API access token
        code, // the code to be exchanged for the API access token
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI, // redirect URI for security, Spotify verifies this matches the URI used in the login step.
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {                                                        
        method: 'POST', // sending data to spotify, so POST
        headers: { // request headers:
            'Content-Type': 'application/x-www-form-urlencoded',
            // below is for authorization, the clientID and Secret are encoded and sent to Spotify to prove the identity of the app making the request
            Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
        },
        // the actual data being sent: 
        body: params,
    });

    // if Spotify returns an error status (e.g. 401, 500), throw an error to be caught by the controller's catch block
    if (!response.ok) throw new Error(`Spotify token error: ${response.status}`);
    // returns the response as json data
    return response.json();
}

// function for retrieving user playlists:
export async function fetchPlaylists(accessToken) {
    // fetching from dynamic endpoint for user playlists
    const response = await fetch(`${BASE_URL}/me/playlists`, {
        // sends the fetch request as the bearer of the access token -> uses authority to fetch from the playlists endpoint.
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    // if Spotify returns an error status (e.g. 401, 500), throw an error to be caught by the controller's catch block
    if (!response.ok) throw new Error(`Spotify playlists error: ${response.status}`);
    // parses the response into a javascript object (json = javascript object notation)
    const data = await response.json();
    
    // returns the items field of the json data from the Spotify response. The items field contains metadata about the user's playlists like playlist names.
    return data.items;
}

// function for retrieving individual tracks in a user's playlist using 'playlistId' metadata:
export async function fetchPlaylistTracks(accessToken, playlistId) {
    // fetching from dynamic endpoint for user playlists
    const response = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
        // sends the fetch request as the bearer of the access token -> uses authority to fetch from the tracks endpoint beyond the dynamic playlistId endpoint
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    // if Spotify returns an error status (e.g. 401, 500), throw an error to be caught by the controller's catch block
    if (!response.ok) throw new Error(`Spotify tracks error: ${response.status}`);
    // parses the response into a javascript object (json = javascript object notation)
    const data = await response.json();

    // returns a new array containing track objects consisting of track names and artist name(s)
    return data.items.map(item => ({
        title: item.track.name, 
        // there may be multiple artists for one track, so their names are joined by ', '
        artist: item.track.artists.map(a => a.name).join(', '),
    }));
}