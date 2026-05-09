import DropDownMenu from "../DropDownMenu";

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
        <h1 className="instructionHeader text">
          Select your Spotify playlist to use as a source
        </h1>
        <DropDownMenu
          playlists={spotifyPlaylists}
          setSourcePlaylistId={setSourcePlaylistId}
          setSourcePlaylistName={setSourcePlaylistName}
          placeholder="-- SELECT SPOTIFY PLAYLIST --"
        />
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
