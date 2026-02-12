import React, { useEffect, useState } from "react";
import { AudioManager } from "../utility/audioManager";
import "./AudioControls.css";

export default function AudioControls() {
  // Initialize volumes from localStorage
  const getInitialMusicVolume = () => {
    const stored = localStorage.getItem("musicVolume");
    return stored !== null ? Number(stored) : 0.4;
  };

  const getInitialSfxVolume = () => {
    const stored = localStorage.getItem("sfxVolume");
    return stored !== null ? Number(stored) : 0.3;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(getInitialMusicVolume());
  const [sfxVolume, setSfxVolume] = useState(getInitialSfxVolume());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      AudioManager.setBgVolume(musicVolume);
    } catch {
      /* ignore */
    }

    const storedOn = localStorage.getItem("musicOn");

    if (storedOn === "true") {
      try {
        AudioManager.playBg();
        const shouldPlay = true;

        setTimeout(() => {
          if (!AudioManager.isBgPlaying()) {
            localStorage.setItem("musicOn", "false");
          } else if (shouldPlay) {
            setIsPlaying(true);
          }
        }, 400);
      } catch {
        /* ignore */
      }
    }
  }, [musicVolume]);

  // Apply SFX volume on mount and when it changes
  useEffect(() => {
    try {
      AudioManager.setSfxVolume(sfxVolume);
    } catch {
      /* ignore */
    }
  }, [sfxVolume]);

  const togglePlay = () => {
    if (isPlaying) {
      try {
        AudioManager.pauseBg();
      } catch {
        /* ignore */
      }
      setIsPlaying(false);
      localStorage.setItem("musicOn", "false");
    } else {
      try {
        AudioManager.playBg();
        setIsPlaying(true);
        localStorage.setItem("musicOn", "true");
        setTimeout(() => {
          if (!AudioManager.isBgPlaying()) {
            setIsPlaying(false);
            localStorage.setItem("musicOn", "false");
          }
        }, 400);
      } catch {
        /* ignore */
      }
    }
  };

  const onMusicVolumeChange = (e) => {
    const v = Number(e.target.value);
    setMusicVolume(v);
    try {
      AudioManager.setBgVolume(v);
    } catch {
      /* ignore */
    }
    localStorage.setItem("musicVolume", String(v));
  };

  const onSfxVolumeChange = (e) => {
    const v = Number(e.target.value);
    setSfxVolume(v);
    try {
      AudioManager.setSfxVolume(v);
    } catch {
      /* ignore */
    }
    localStorage.setItem("sfxVolume", String(v));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getVolumeIcon = () => {
    if (!isPlaying || musicVolume === 0) {
      return "ri-volume-mute-line";
    } else if (musicVolume < 0.5) {
      return "ri-volume-down-line";
    } else {
      return "ri-volume-up-line";
    }
  };

  return (
    <div className="audio-controls">
      {/* Speaker icon button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="audio-icon-btn"
        title="Audio settings"
      >
        <i className={getVolumeIcon()}></i>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="audio-dropdown">
          {/* Play/Pause toggle */}
          <button type="button" onClick={togglePlay} className="audio-play-btn">
            <i className={isPlaying ? "ri-pause-fill" : "ri-play-fill"}></i>
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          {/* Music volume */}
          <div className="audio-volume-section">
            <label className="audio-label">
              <i className="ri-music-2-line"></i> Music
            </label>
            <div className="audio-volume-row">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={musicVolume}
                onChange={onMusicVolumeChange}
                className="audio-slider"
              />
              <span className="audio-percent">
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
          </div>

          {/* SFX volume */}
          <div className="audio-volume-section">
            <label className="audio-label">
              <i className="ri-notification-3-line"></i> SFX
            </label>
            <div className="audio-volume-row">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sfxVolume}
                onChange={onSfxVolumeChange}
                className="audio-slider"
              />
              <span className="audio-percent">
                {Math.round(sfxVolume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
