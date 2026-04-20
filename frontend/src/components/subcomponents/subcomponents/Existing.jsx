export default function Existing({
setDestinationPlaylistId,
setDestinationPlaylistName,
youtubePlaylists,
setSourcePlaylistName,
step,
setStep,
isDefault
}) {
    return (
        <div>
            <label>Select an existing YouTube playlist:</label>
            <select onChange={(e) => {
                const optionNum = e.target.selectedIndex; // gets the index of the option selected
                const selectedOption = e.target.options[optionNum]; // accesses the selectedOption using its index

                setDestinationPlaylistId(selectedOption.id);
                setDestinationPlaylistName(selectedOption.title);
            }}>
                <option>-- Select a Playlist --</option> {/* adds placeholder item to the dropdown menu */}
                {
                    youtubePlaylists.map((pl) => ( // iterates over each playlist the youtubePlaylists state, making an option for them in the dropdown menu
                        <option key={pl.id} id={pl.id} title={pl.title}>{pl.title}</option>
                    ))}
            </select>
            <div style={{ marginTop: '20px' }}>

                <button onClick={() => { // deselects the spotify playlist

                    setDestinationPlaylistName('');
                    setSourcePlaylistName('');
                    setStep(step - 1);
                }}>Back</button>

                <button disabled={isDefault} onClick={() => {

                    setStep(step + 1);
                }}>Next</button>

            </div>
        </div>
    )
}