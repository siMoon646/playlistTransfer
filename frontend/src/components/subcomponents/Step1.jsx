export default function step1({
    setDestination, 
    step, 
    setStep
}) {

    return (

        <div>
            <h3>Where are we moving music to?</h3>
            <button
                onClick={() => {
                    setDestination("new"); // user wants to create new playlist
                    setStep(step + 1);
                }}
            >Add tracks to NEW YouTube playlist</button>

            <button
                onClick={() => {
                    setDestination("existing"); // users wants to use existing playlist
                    setStep(step + 1);
                }}
            >Add tracks to EXISTING YouTube playlist</button>
        </div>
    )
}