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
        <div>
            <label>{"What should we name your new YouTube playlist? "}</label>

            <input
                type="text"
                // e - event, e.target - the html element in which the event occurred, e.target.value - the current value inside the html element in which the event occurred.
                onBlur={(e) => { setDestinationPlaylistName(e.target.value) }}
                // placeholder value for the playlist's name
                placeholder="Playlist Name"
            />

            {hasInvalidChars && (
                <p> YouTube playlist connot contain characters: {"'<' or '>'"}</p>
            )}

            {isNameEmpty && (
                <p> YouTube playlist requires name </p>
            )}

            <div style={{ marginTop: '20px' }}>

                <button onClick={() => { // deselects the spotify playlist

                    setDestinationPlaylistName('');
                    setStep(step - 1);
                }}>Back</button>

                <button disabled={!isNameValid} onClick={() => {

                    setStep(step + 1);
                }}>Next</button>

            </div>
        </div>
    )
}