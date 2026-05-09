import "../../../styling.css"

export default function New({
    destinationPlaylistName,
    setDestinationPlaylistName,
    step,
    setStep
}) {
    const isNameEmpty = (destinationPlaylistName.trim() === ''); // checks if the name is empty
    const hasInvalidChars = /[<>\u2028]/.test(destinationPlaylistName); // playlist names cannot contain '<', '>', or '\u2028'
    const isNameTooLong = destinationPlaylistName.length > 150; // YouTube doesn't allow playlist names > 150 chars
    const isNameValid = !isNameEmpty && !hasInvalidChars && !isNameTooLong;

    return (
        <div className = "centered">
            <h1 className = "instructionHeader text" style = {{marginBottom: "2vh"}}> What Is The Name Of This New Playlist? </h1>

            <textarea
                className = "interactiveGlow centered text namingInput"
                type="text"
                // e - event, e.target - the html element in which the event occurred, e.target.value - the current value inside the html element in which the event occurred.
                onBlur={(e) => { setDestinationPlaylistName(e.target.value) }}
                // placeholder value for the playlist's name
                placeholder=""
            />

            {hasInvalidChars && (
                <p className = "text centered" style = {{color: "red"}}> YouTube playlist connot contain characters: {"'<' or '>'"}</p>
            )}

            {isNameEmpty && (
                <p className = "centered text" style = {{color: "red"}}> YouTube playlist requires name </p>
            )}

            <div className = "navButtons">
                <button className = "decisionButton interactiveGlow" onClick={() => { // deselects the spotify playlist
                    setDestinationPlaylistName('');
                    setStep(step - 1);
                }}>Back</button>

                <button 
                style = {{ marginLeft: "30vw"}}
                className = {"decisionButton " + (!isNameValid ? "" : "interactiveGlow")} 
                disabled={!isNameValid} onClick={() => {
                    setStep(step + 1);
                }}>Next</button>

            </div>
        </div>
    )
}