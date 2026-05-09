export default function Step4({
    sourcePlaylistName,
    destinationPlaylistName,
    handleConvert,
    conversionResults
}) {
  return (
    <div className = "centered">
      <div>
        <h1 className="instructionHeader text" style={{ marginBottom: "2vh" }}>
          Confirm and Convert
        </h1>
        <div className="descriptionBox text" style={{ margin: "0 auto 4vh", textAlign: "center", maxWidth: "min(60vw, 560px)" }}>
          <p className="text" style={{ marginBottom: "1vh" }}>
            Source: <strong>{sourcePlaylistName}</strong>
          </p>
          <p className="text" style={{ margin: 0 }}>
            Destination: <strong>{destinationPlaylistName}</strong>
          </p>
        </div>
        <button className = "decisionButton interactiveGlow" onClick={handleConvert}>Convert</button>
        <div className="resultsRow" style = {{ position: "relative", bottom: "28.2vh"}}>
          <div className="resultColumn">
            <div className="descriptionBox resultBox text">
              <h2 className="resultBoxTitle">Failed Tracks</h2>
              <ol className="resultList">
                {conversionResults.failed.map((item, index) => (
                  <li style = {{fontSize: "1px"}} key={`${item.track}-${index}`}>
                    {item.track} — {item.reason}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="resultColumn">
            <div className="descriptionBox resultBox text">
              <h2 className="resultBoxTitle">Successful Tracks</h2>
              <ol className="resultList">
                {conversionResults.succeeded.map((item, index) => (
                  <li style = {{fontSize: "1vw"}} key={`${item.spotifyTrack}-${index}`}>
                    {item.spotifyTrack} as {item.youtubeTitle}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
