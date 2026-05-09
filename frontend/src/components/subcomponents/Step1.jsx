import '../../styling.css'

export default function step1({
    setDestination, 
    step, 
    setStep
}) {

    return (
        <div>
            <h1 className = "instructionHeader centered text" style = {{marginBottom: "5vh"}}> Where Do You Want Your Playlist To Go? </h1>
            <div style = {{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "5vh",
            }}>
                <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    alignItems: "center", 
                    width: "30vw", 
                    minWidth: "220px" }}>
                    <button className = "decisionButton text interactiveGlow" style={{ width: "100%" }}
                        onClick={() => {
                            setDestination("new"); // user wants to create new playlist
                            setStep(step + 1);
                        }}
                    >To New Playlist</button>
                    <div className="descriptionBox text" style={{ width: "98%" }}>
                        Choose this to create a new playlist in your account and transfer your songs into it.
                    </div>
                </div>

                <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    width: "30vw", 
                    minWidth: "220px" }}>
                    <button className = "decisionButton text interactiveGlow" style={{ width: "100%" }}
                        onClick={() => {
                            setDestination("existing"); // users wants to use existing playlist
                            setStep(step + 1);
                        }}
                    >To Existing Playlist</button>
                    <div className="descriptionBox centered text" style={{ width: "98%" }}>
                        Choose this to add songs to an existing playlist you already have.
                    </div>
                </div>
            </div>
        </div>
    )
}