import { useState, useEffect } from 'react';
import Step1 from "./subcomponents/Step1"
import Step2 from "./subcomponents/Step2"
import Step3 from "./subcomponents/Step3"
import Step4 from "./subcomponents/Step4"

export default function HomePage() {
  const [step, setStep] = useState(1); // represents where the user is in the decision-making process
  const [destination, setDestination] = useState(null); // represents if the user wants to add tracks to new playlist or existing playlist

  // states and variables pertaining to destination playlist:
  const [destinationPlaylistName, setDestinationPlaylistName] = useState(''); // contains the custom name the user provides if they chose to make a new playlist for tracks
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

    if (!destinationPlaylistId) {

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
        step === 1 && (
          <Step1
            setDestination={setDestination}
            step={step}
            setStep={setStep} />
        )
      }
      {
        step === 2 && (
          <Step2
            destination={destination}
            destinationPlaylistName={destinationPlaylistName}
            setDestinationPlaylistName={setDestinationPlaylistName}
            setDestinationPlaylistId={setDestinationPlaylistId}
            youtubePlaylists={youtubePlaylists}
            setSourcePlaylistName={setSourcePlaylistName}
            isDefault={isDefault}
            step={step}
            setStep={setStep}
          />
        )
      }
      {
        step === 3 && (
          <Step3
          setSourcePlaylistId={setSourcePlaylistId}
          setSourcePlaylistName={setSourcePlaylistName}
          spotifyPlaylists={spotifyPlaylists}
          step={step}
          setStep={setStep}
          isDefault2={isDefault2}
          />
        )
      }
      {
        step === 4 && (
          <Step4 
          sourcePlaylistName={sourcePlaylistName}
          destinationPlaylistName={destinationPlaylistName}
          handleConvert={handleConvert}
          conversionResults={conversionResults}
          />
        )
      }
    </div>
  );
}