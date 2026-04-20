export default function Step4({
    sourcePlaylistName,
    destinationPlaylistName,
    handleConvert,
    conversionResults
}) {
  return (
    <div>
      <h2>Step 4: Confirm and Convert</h2>
      <div>
        <p>
          Source <strong>{sourcePlaylistName}</strong>{" "}
        </p>
        <p>
          Destination <strong>{destinationPlaylistName}</strong>
        </p>
        <button onClick={handleConvert}>Convert</button>
        <div>
          Tracks we found on YouTube:
          {conversionResults.succeeded.map((item) => (
            <li key={item.spotifyTrack}>
              {item.spotifyTrack} as ${item.youtubeTitle}
            </li>
          ))}
          Tracks we couldn't find on YouTube:
          {conversionResults.failed.map((item) => (
            <li key={item.track}>
              {item.track} - {item.reason}
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}
