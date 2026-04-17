import { useState, useEffect } from 'react';

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH PLAYLISTS ON LOAD
  useEffect(() => {
    fetch('http://127.0.0.1:3000/spotify/playlists', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch playlists");
        return res.json();
      })
      .then((data) => {
        setPlaylists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching playlists:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>playlistTransfer</h1>
      <hr />

      {/* STEP 1: INITIAL DECISION */}
      {step === 1 && (
        <div>
          <h3>Where are we moving music to?</h3>
          <button onClick={() => setStep(2)}>Add tracks to NEW YouTube playlist</button>
          <button onClick={() => setStep(2)}>Add tracks to EXISTING YouTube playlist</button>
        </div>
      )}

      {/* STEP 2: SPOTIFY SELECTION */}
      {step === 2 && (
        <div>
          <h3>Select your Spotify Source</h3>
          {loading ? (
            <p>Loading your Spotify playlists...</p>
          ) : (
            <select 
              value={selectedPlaylist} 
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              style={{ padding: '10px', width: '100%' }}
            >
              <option value="" disabled>Select a playlist...</option>
              {playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name} ({pl.tracks.total} songs)
                </option>
              ))}
            </select>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(1)}>Back</button>
            <button 
              disabled={!selectedPlaylist} 
              onClick={() => setStep(3)}
              style={{ marginLeft: '10px' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FINAL CONFIRMATION */}
      {step === 3 && (
        <div>
          <h3>Ready to begin?</h3>
          <p>You've selected: <strong>{playlists.find(p => p.id === selectedPlaylist)?.name}</strong></p>
          <p>Everything looks good. Click below to start the transfer.</p>
          <button onClick={() => setStep(2)}>Back</button>
          <button 
            style={{ backgroundColor: 'gold', marginLeft: '10px' }}
            onClick={() => console.log("Starting transfer for ID:", selectedPlaylist)}
          >
            BEGIN TRANSFER
          </button>
        </div>
      )}
    </div>
  );
}