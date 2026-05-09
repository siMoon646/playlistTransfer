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
            
            {console.log( "we made it here", youtubePlaylists)};

            <DropDownMenu
              playlists={youtubePlaylists}
              setSourcePlaylistId={setDestinationPlaylistId}
              setSourcePlaylistName={setDestinationPlaylistName}
              placeholder="-- SELECT YOUTUBE PLAYLIST --"
            />
                <h2 
                className = "text centered" 
                style={{
                    color: 'red', 
                    paddingTop: '8vh'
                }}
                hidden = {youtubePlaylists.length !== 0} 
                > Your YouTube account does not contain any elligible playlists</h2>
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