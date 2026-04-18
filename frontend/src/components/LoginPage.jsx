export default function LoginPage() {
  return (
    <div style={{
      display: 'flex', 
      height: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '50px' 
      }}>

      {/* Spotify Icon Section */}
      <a href="http://127.0.0.1:3000/spotify/login" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ width: '150px', height: '150px', backgroundColor: '#1DB954', borderRadius: '50%' }}>SpotifyLogin</div>
          <h2>Spotify</h2>
        </div>
      </a>

      {/* YouTube Icon Section */}
      <a href="http://127.0.0.1:3000/youtube/login" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ width: '150px', height: '150px', backgroundColor: '#FF0000', borderRadius: '50%' }}>YouTubeLogin</div>
          <h2>YouTube</h2>
        </div>
      </a>

    </div>
  );
}