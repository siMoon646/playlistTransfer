import { fetchPlaylistTracks } from "./spotifyModel.js";
import { getVideo, addVideoToPlaylist } from "./youtubeModel.js";

/**
 * Converts a Spotify playlist into a YouTube playlist by:
 * 1. Fetching all tracks from the Spotify playlist
 * 2. Searching YouTube for each track using "track name + artist name(s)"
 * 3. Adding the top YouTube result to the specified YouTube playlist
 *
 * Returns a summary of which tracks succeeded and which failed.
 */
export async function convertSpotifyTracksToYouTubePlaylist(
    spotifyAccessToken,
    youtubeAccessToken,
    spotifyPlaylistId,
    youtubePlaylistId
) {
    // fetching all tracks from the Spotify playlist
    const tracks = await fetchPlaylistTracks(spotifyAccessToken, spotifyPlaylistId);

    const results = {
        succeeded: [],
        failed: [],
    };

    // for each track, search YouTube and add to the YouTube playlist
    for (const track of tracks) {
        // forms queries using track title and artist name(s)
        const query = `${track.title} ${track.artist}`;

        try {
            // search YouTube for the track
            const video = await getVideo(query, youtubeAccessToken);

            if (!video) { // no result -> failed to find track -> go to next track
                // YouTube returned no results for this query
                results.failed.push({ track: query, reason: "No YouTube results found" });
                continue;
            } 

            const videoId = video.id.videoId;
            const videoTitle = video.snippet.title;

            // add the top result to the YouTube playlist
            // note: controller verified the target playlist, so we know this is the target playlist in the param below
            await addVideoToPlaylist(youtubePlaylistId, videoId, youtubeAccessToken);

            // succeeded in finding track
            results.succeeded.push({
                spotifyTrack: query,
                youtubeVideoId: videoId,
                youtubeTitle: videoTitle,
            });

        } catch (err) {
            results.failed.push({ track: query, reason: err.message });
        }
    }
    return results;
}