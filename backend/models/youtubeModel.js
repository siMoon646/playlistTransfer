const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function exchangeCodeForTokens(code) {
    const params = new URLSearchParams({
        grant_type: "authorization_code", // requests the snippet field group, which includes title, channelTitle, thumbnails, etc.
        code, // the code to be exchanged for the API access token
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI, // redirect URI for security, YouTube verifies this matches the URI used in the login step.
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST", // sending data to YouTube, so POST
        headers: {
            // request headers:
            "Content-Type": "application/x-www-form-urlencoded",
        },
        // the actual data being sent:
        body: params.toString(),
    });

    // if YouTube returns an error status (e.g. 401, 500), throw an error to be caught by the controller's catch block
    if (!response.ok) throw new Error(`YouTube token error: ${response.status}`);
    // returns the response as json data
    return response.json();
}

export async function getVideo(query, accessToken) {
    const params = new URLSearchParams({
        part: "snippet", // API wants this. This app doesn't really use it for anything other than to appease YouTube API.
        q: query,        // The search term
        maxResults: "1", // Want only the first result, the top result
        type: "video",   // The query will only get videos, not other things like channels
    });

    const response = await fetch(`${BASE_URL}/search?${params}`, {
        method: "GET", // we are making a GET request
        headers: { Authorization: `Bearer ${accessToken}` }, // Authorize this GET request as the bearer of the access token
    });

    if (!response.ok) throw new Error(`Youtube error: ${response.status}`);

    const data = await response.json();

    // Safety check: if items array is empty, return null so the controller knows nothing was found
    if (!data.items || data.items.length === 0) return null;

    // returns a search result resource object. Notably: .id.videoId, .snippet.title, .snippet.channelTitle
    return data.items[0];
}

export async function fetchPlaylists(accessToken) {
    const params = new URLSearchParams({
        part: "snippet",
        mine: "true",
        maxResults: "50" 
    });

    // fetching from dynamic endpoint for user playlists
    const response = await fetch(`${BASE_URL}/playlists?${params}`, {
        // sends the fetch request as the bearer of the access token -> uses authority to fetch from the playlists endpoint.
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    // if Spotify returns an error status (e.g. 401, 500), throw an error to be caught by the controller's catch block
    if (!response.ok) throw new Error(`YouTube playlists error: ${response.status}`);
    // parses the response into a javascript object (json = javascript object notation)
    const data = await response.json();

    // returns the items field of the json data from the Spotify response. The items field contains metadata about the user's playlists like playlist names.
    return data.items;
}

export async function makePlaylist(title, accessToken) {
    const response = await fetch(`${BASE_URL}/playlists?part=snippet,status`, {
        method: "POST", // CRUD -> create request
        headers: {
            Authorization: `Bearer ${accessToken}`, // Authorize this POST request as the bearer of the access token
            "Content-Type": "application/json", // Tells the server the request body is formatted as JSON
        },
        // The body contains an object defining the new playlist
        body: JSON.stringify({ // serializing JSON data -> adjusted for promise made in the header (Content-Type:"application/json")
            snippet: {
                title: title, // title of the playlist
            },
            status: {
                privacyStatus: "private", // Defaulting to private for the user's safety
            },
        }),
    });

    if (!response.ok) throw new Error(`YouTube create playlist error: ${response.status}`);

    // Returns the "receipt" (Playlist Resource) containing the new playlistId
    return await response.json();
}

export async function addVideoToPlaylist(playlistId, videoId, accessToken) {
    const response = await fetch(`${BASE_URL}/playlistItems?part=snippet`, { // accessing the playlist
        method: "POST", // CRUD -> creation request
        headers: {
            Authorization: `Bearer ${accessToken}`, // Authorizing the POST request as the bearer of the access token
            "Content-Type": "application/json", // Tells the server the request body is formatted as JSON
        },
        body: JSON.stringify({ // Serializing JSON data
            snippet: {
                playlistId: playlistId, // target playlist where the video is to be added
                resourceId: {
                    kind: "youtube#video", // YouTube's identifier for content type
                    videoId: videoId, // the target video to be added to targeted playlist
                },
            },
        }),
    });

    if (!response.ok) throw new Error(`YouTube add to playlist error: ${response.status}`);

    // Returns the "receipt" (Playlist Item Resource)
    return await response.json();
}