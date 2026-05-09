export default function Step3({
  setSourcePlaylistId,
  setSourcePlaylistName,
  setDestinationPlaylistId,
  setDestinationPlaylistName,
  spotifyPlaylists,
  step,
  setStep,
  isDefault2,
}) {
  return (
    <div className="centered">
      <div>
        <h1 className="instructionHeader text" style={{ marginBottom: "2vh" }}>
          Select your Spotify playlist to use as a source
        </h1>
        <select
          className="interactiveGlow selectPlaylist centered text"
          style = {{width: "fit-content"}}
          onChange={(e) => {
            const optionNum = e.target.selectedIndex; // gets the index of the option selected
            const selectedOption = e.target.options[optionNum]; // accesses the selectedOption using its index

            setSourcePlaylistId(selectedOption.id);
            setSourcePlaylistName(selectedOption.title);
          }}
        >
          <option className = "playlistOption">-- Select a Playlist --</option> {/* placeholder */}
          {spotifyPlaylists.map((pl) => (
            <option className = "playlistOption" key={pl.id} id={pl.id} title={pl.title}>
              {pl.entry}
            </option>
          ))}
        </select>
      </div>
      <div className="navButtons">
        <button
          className="decisionButton interactiveGlow"
          onClick={() => {
            // deselects the spotify playlist
            setSourcePlaylistName("");
            setSourcePlaylistId("");
            // removes the destination playlist selection as well, since the spotify playlist selection is a prerequisite for the destination playlist selection
            setDestinationPlaylistName("");
            setDestinationPlaylistId("");
            setStep(step - 1);
          }}
        >
          Back
        </button>

        <button
          className={"decisionButton " + (isDefault2 ? "" : "interactiveGlow")}
          style = {{ marginLeft: "30vw" }}
          disabled={isDefault2}
          onClick={() => {
            setStep(step + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
