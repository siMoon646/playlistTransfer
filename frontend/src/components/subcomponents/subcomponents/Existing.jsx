import "../../../styling.css"

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
        <div className = "centered">
            <h1 className = "instructionHeader centered text" style = {{marginBottom: '5vh'}}>Select an existing YouTube playlist:</h1>
            <select className="interactiveGlow selectPlaylist centered text" onChange={(e) => {
                const optionNum = e.target.selectedIndex; // gets the index of the option selected
                const selectedOption = e.target.options[optionNum]; // accesses the selectedOption using its index

                setDestinationPlaylistId(selectedOption.id);
                setDestinationPlaylistName(selectedOption.title);
            }}>
                <option className = "playlistOption centered text">-- Select a Playlist --</option> {/* adds placeholder item to the dropdown menu */}
                {
                    youtubePlaylists.map((pl) => ( // iterates over each playlist the youtubePlaylists state, making an option for them in the dropdown menu
                        <option className = "playlistOption centered text" key={pl.id} id={pl.id} title={pl.title}>{pl.title}</option>
                    ))}
            </select>
            <div className = "navButtons">

                <button className = "decisionButton interactiveGlow" onClick={() => { // deselects the spotify playlist
                    setDestinationPlaylistName('');
                    setSourcePlaylistName('');
                    setStep(step - 1);
                }}>Back</button>

                <button 
                className = {"decisionButton " + (isDefault ? "" : "interactiveGlow")} 
                style = {{ marginLeft: "30vw"}}
                disabled={isDefault} onClick={() => {
                    setStep(step + 1);
                }}>Next</button>

            </div>
        </div>
    )
}