import "../styling.css"
import { useState, useRef, useEffect } from "react";

/**
 * PixelSelect
 *
 * A fully custom dropdown that replaces <select> entirely,
 * giving you complete control over styling — including centered options.
 *
 * Props:
 *  - playlists ({ id, title }[]) — list of playlist objects to display
 *  - setSourcePlaylistId (fn)    — called with the id of the selected playlist
 *  - setSourcePlaylistName (fn)  — called with the title of the selected playlist
 *  - placeholder (string)        — text shown when nothing is selected
 *  - maxVisible (number)         — how many items before scrolling (default: 7)
 */
 
const ITEM_HEIGHT = 36; /* px — height of each option row */
 
export default function PixelSelect({
  playlists,
  setSourcePlaylistId,
  setSourcePlaylistName,
  placeholder = "-- SELECT PLAYLIST --",
  maxVisible = 7,
}) {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
 
  const handleSelect = (playlist) => {
    setSelected(playlist);
    setSourcePlaylistId?.(playlist.id);
    setSourcePlaylistName?.(playlist.title);
    setOpen(false);
  };
 
  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  const listMaxHeight = ITEM_HEIGHT * maxVisible;
 
  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block", minWidth: "220px" }}
    >
      {/* ── Trigger button ── */}
      <button
        className = "interactiveGlow"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: "32vw",
          height: `100%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1vh 1vw",
          backgroundColor: "rgb(4,79,15)",
          border: "0.1vw solid #272727",
          fontFamily: "Minefont",
          fontSize: "1vw",
          color: "white",
          cursor: "pointer",
          outline: "none",
          imageRendering: "pixelated",
          
        }}
      >
        <span style={{ flex: 1, textAlign: "center" }}>
          {selected ? selected.title : placeholder}
        </span>

      </button>
 
      {/* ── Dropdown list ── */}
      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "100%",
            maxHeight: `${listMaxHeight}px`,
            overflowY: playlists.length > maxVisible ? "auto" : "hidden",
            margin: 0,
            padding: "0",
            listStyle: "none",
            backgroundColor: "rgb(55, 56, 55)",
            boxShadow: "4px 4px 0 rgb(0,0,0)",
            fontFamily: "Minefont",
            fontSize: "1vw",
            scrollbarWidth: "thin",
            scrollbarColor: "#rgb(0,0,0)"
          }}
        >
          {playlists.map((playlist, i) => {
            const isSelected = playlist.id === selected?.id;
            return (
              <li
                key={playlist.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(playlist)}
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1vh 1vw",
                  cursor: "pointer",
                  color: isSelected ? "lime" : "white",
                  fontFamily: "Minefont",
                  textShadow: isSelected ? "1px 1px 0 #0f0f1a" : "none",
                  borderBottom:
                    i < playlists.length - 1 ? "2px solid black" : "none",
                  textAlign: "center",
                  userSelect: "none",
                  transition: "background-color 0.05s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "rgba(82, 82, 82, 1)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "rgba(55, 56, 55, 0)";
                }}
              >
                {/* {isSelected && (
                  <span style={{ marginRight: "8px", fontSize: "9px" }}>►</span>
                )} */}
                {playlist.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
