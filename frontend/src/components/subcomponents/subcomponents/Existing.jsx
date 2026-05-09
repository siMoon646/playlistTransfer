import "../../../styling.css"
import DropDownMenu from "../../DropDownMenu";

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
            
            <DropDownMenu
              playlists={youtubePlaylists}
              setSourcePlaylistId={setDestinationPlaylistId}
              setSourcePlaylistName={setDestinationPlaylistName}
              placeholder="-- SELECT YOUTUBE PLAYLIST --"
            />

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