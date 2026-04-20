import Existing from "./subcomponents/Existing";
import New from "./subcomponents/New";

export default function Step2({
  destination,
  destinationPlaylistName,
  setDestinationPlaylistName,
  setDestinationPlaylistId,
  youtubePlaylists,
  setSourcePlaylistName,
  isDefault,
  step,
  setStep,
}) {
  return (
    <div>
      <h2>Step 2: YouTube Setup</h2>

      {destination === "new" && ( // users wants to create a new playlist
        <New
          destinationPlaylistName={destinationPlaylistName}
          setDestinationPlaylistName={setDestinationPlaylistName}
          step={step}
          setStep={setStep}
        />
      )}

      {destination === "existing" && ( // user wants to use an existing playlist
        <Existing
          setDestinationPlaylistId={setDestinationPlaylistId}
          setDestinationPlaylistName={setDestinationPlaylistName}
          youtubePlaylists={youtubePlaylists}
          setSourcePlaylistName={setSourcePlaylistName}
          step={step}
          setStep={setStep}
          isDefault={isDefault}
        />
      )}
    </div>
  );
}
