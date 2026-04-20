export default function Step3({
  setSourcePlaylistId,
  setSourcePlaylistName,
  spotifyPlaylists,
  step,
  setStep,
  isDefault2,
}) {
  return (
    <div>
      <h2>Step 3: Select Spotify playlist as Source</h2>
      <div>
        <label>Select your Spotify playlist to use as a source</label>
        <select
          onChange={(e) => {
            const optionNum = e.target.selectedIndex; // gets the index of the option selected
            const selectedOption = e.target.options[optionNum]; // accesses the selectedOption using its index

            setSourcePlaylistId(selectedOption.id);
            setSourcePlaylistName(selectedOption.title);
          }}
        >
          <option>-- Select a Playlist --</option> {/* placeholder */}
          {spotifyPlaylists.map((pl) => (
            <option key={pl.id} id={pl.id} title={pl.title}>
              {pl.entry}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            // deselects the spotify playlist
            setStep(step - 1);
          }}
        >
          Back
        </button>

        <button
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
