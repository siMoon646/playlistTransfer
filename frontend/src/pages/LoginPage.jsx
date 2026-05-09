import "../styling.css";
import SiteHeader from "../components/SiteHeader.jsx";
import Footer from "../components/Footer.jsx";

export default function LoginPage() {
  return (
    <div className="centered">
      <SiteHeader />
      <h1
        className="instructionHeader text centered"
        style={{
          marginBottom: "8vh",
        }}
      >
        {" "}
        Login With Both Platforms{" "}
      </h1>

      <div
        style={{
          // styling to position the two icons
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: "10vw",
        }}
      >
        {/* Spotify Icon Section */}
        <a href="http://127.0.0.1:3000/spotify/login">
          <img
            className="loginIcon interactiveGlow"
            src="spotify.png"
            alt="Spotify icon"
          />
        </a>

        {/* YouTube Icon Section */}
        <a href="http://127.0.0.1:3000/youtube/login">
          <img
            className="loginIcon interactiveGlow"
            src="youtube.png"
            alt="YouTube icon"
          />
        </a>
      </div>
      <Footer />
    </div>
  );
}
