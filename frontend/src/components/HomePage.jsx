import { useState, useEffect } from "react";

export default function HomePage() {
  const [step, setStep] = useState(1); // represents where the user is in the decision-making process
  const [destination, setDestination] = useState(null); // represents if the user wants to add tracks to new playlist or existing playlist

  // states and variables pertaining to destination playlist:
  const [destinationPlaylistName, setDestinationPlaylistName] = useState(''); // contains the custom name the user provides if they chose to make a new playlist for tracks
  const isNameEmpty = (destinationPlaylistName.trim() === ''); // checks if the name is empty
  const hasInvalidChars = /[<>\u2028]/.test(destinationPlaylistName); // playlist names cannot contain '<', '>', or '\u2028'
  const isNameTooLong = destinationPlaylistName.length > 150; // YouTube doesn't allow playlist names > 150 chars
  const isNameValid = !isNameEmpty && !hasInvalidChars && !isNameTooLong;
  const [youtubePlaylists, setYoutubePlaylists] = useState([]); // contains the playlists in the user's YouTube account, so we can display them in a drowpdown menu
  const [destinationPlaylistId, setDestinationPlaylistId] = useState(''); // contains the id of the playlist that the user wants to copy tracks to
  const isDefault = (destinationPlaylistId === '');

  // states and variables peratining to source playlist:
  const [sourcePlaylistName, setSourcePlaylistName] = useState(''); // contains the name of the platylist that the user wants to copy tracks from
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]); // contains the playlists in the user's Spotify profile, so we can display them in a dropdown menu
  const [sourcePlaylistId, setSourcePlaylistId] = useState(''); // contains the id of the playlist that the user wants to copy tracks from
  const isDefault2 = (sourcePlaylistId === '');

  const [conversionResults, setConversionResults] = useState({ succeeded: [], failed: [] });

  /** returns the user's YouTube playlists in an array */
  async function getYoutubePlaylists() {
    const response = await fetch('http://127.0.0.1:3000/youtube/playlists', { credentials: 'include' });
    const data = await response.json();
    // console.log(data);
    const playlistNames = data.map((obj) => ({
      title: obj.snippet.title,
      id: obj.id,
    }))
    // console.log("data:", data);
    // console.log("youtube playlists: ", playlistNames);
    return playlistNames;
  }

  /** Sets youtubePlaylists field to contains an array of the user's existing YouTube playlists */
  useEffect(() => { // runs when destination is changed
    // Only fetch if the user actually wants an existing playlist
    if (destination === 'existing') {
      try {
        getYoutubePlaylists().then((playlists) => {
          if (playlists) {
            setYoutubePlaylists(playlists);
          }
        })
      } catch (err) {
        console.err(err);
      }
    }
  }, [destination]); // dependencies of this useEffect -> useEffect only runs when this dependency changes

  /** returns the user's spotify playlists in an array */
  async function getSpotifyPlaylists() {
    const response = await fetch('http://127.0.0.1:3000/spotify/playlists', { credentials: 'include' });
    const playlists = await response.json();

    const playlistNames = playlists.map((playlist) => ({
      id: playlist.id,
      title: playlist.name,
      entry: `${playlist.name} (${playlist.items.total})`, // creates an 'entry' composed of 'playlist-name' + the number of tracks in the playlist
    }))

    // console.log("spotify playlists: ", playlistNames);
    return playlistNames;
  }

  {// navigation: ------------------------------------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => { // runs when app gets to step 3
      console.log(`-- entering step ${step}--`);
      if (step === 3) {
        try {
          getSpotifyPlaylists().then((playlists) => {
            if (playlists) {
              setSpotifyPlaylists(playlists);
            }
          })
        } catch (err) {
          console.err(err);
        }
      }
    }, [step]);
  }
  {// debug: -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
      console.log("source playlist id:", sourcePlaylistId)
    }, [sourcePlaylistId]);

    useEffect(() => {
      console.log("source playlist name:", sourcePlaylistName)
    }, [sourcePlaylistName]);

    useEffect(() => {
      console.log("destination playlist id:", destinationPlaylistId)
    }, [destinationPlaylistId]);

    useEffect(() => {
      console.log("destination playlist name:", destinationPlaylistName)
    }, [destinationPlaylistName]);
  }

  async function handleConvert() {
    console.log("destinationPlaylistId: ", destinationPlaylistId);
    console.log("sourcePlaylistId: ", sourcePlaylistId);
    let destinationPlaylistIdLocal = '';

    if(!destinationPlaylistId){
      
      const response = await fetch('http://127.0.0.1:3000/youtube/playlists', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: destinationPlaylistName
        })
      });

      const data = await response.json();
      destinationPlaylistIdLocal = data.id;
    } else {
      destinationPlaylistIdLocal = destinationPlaylistId
    }

    console.log("destinationPlaylistIdLocal: ", destinationPlaylistIdLocal);
    console.log("sourcePlaylistId: ", sourcePlaylistId);

    try {
      const response = await fetch('http://127.0.0.1:3000/convert', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spotifyPlaylistId: sourcePlaylistId,
          youtubePlaylistId: destinationPlaylistIdLocal
        })
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setConversionResults(data.details); // Store the results to show the user
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="app-container">
      {
        step === 1 && ( // User decides where they want their spotify tracks copied to:
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
            >
              Add tracks to EXISTING YouTube playlist</button>
          </div>
        )
      }
      {
        step === 2 && (
          <div>
            <h2>Step 2: YouTube Setup</h2>

            {destination === 'new' && ( // users wants to create a new playlist
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
            )}

            {destination === 'existing' && ( // user wants to use an existing playlist
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
            )}

          </div>
        )
      }
      {
        step === 3 && (
          <div>
            <h2>Step 3: Select Spotify playlist as Source</h2>
            <div>
              <label>Select your Spotify playlist to use as a source</label>
              <select onChange={(e) => {
                  const optionNum = e.target.selectedIndex; // gets the index of the option selected
                  const selectedOption = e.target.options[optionNum]; // accesses the selectedOption using its index

                  setSourcePlaylistId(selectedOption.id); 
                  setSourcePlaylistName(selectedOption.title);
              }}>
                <option>-- Select a Playlist --</option> {/* placeholder */}
                {
                  spotifyPlaylists.map((pl) => (
                    <option key={pl.id} id={pl.id} title={pl.title}>{pl.entry}</option>
                  ))}
              </select>
            </div>
            <div style={{ marginTop: '20px' }}>

              <button onClick={() => { // deselects the spotify playlist
                setStep(step - 1);
              }}>Back</button>

              <button disabled={isDefault2} onClick={() => {

                setStep(step + 1);
              }}>Next</button>

            </div>
          </div>
        )
      }
      {
        step === 4 && (
          <div>
            <h2>Step 4: Confirm and Convert</h2>
              <div>
                <p>Source <strong>{sourcePlaylistName}</strong> </p>
                <p>Destination <strong>{destinationPlaylistName}</strong></p>
                <button onClick={handleConvert}>
                  Convert
                </button>
                <div>

                  Tracks we found on YouTube:
                  {conversionResults.succeeded.map((item) => (
                    <li key={item.spotifyTrack}>
                      {item.spotifyTrack} as ${item.youtubeTitle}
                    </li>                    
                  ))}

                  Tracks we couldn't find on YouTube:
                  {conversionResults.failed.map((item) => (
                    <li key={item.track}>
                      {item.track} - {item.reason}
                    </li>                    
                  ))}
                </div>
              </div>
          </div>
        )
      }
    </div>
  );
}