import { useRef, useState } from "react";

import FloorCanvas from "./components/FloorCanvas";
import Header from "./components/Header";
import PlayerDock from "./components/PlayerDock";
import YouTubeEngine from "./components/YouTubeEngine";
import DecorativeFrame from "./components/DecorativeFrame";

import playlistData from "./data/playlistData";

function App() {
  const youtubeRef = useRef(null);

  // =========================================
  // PLAYER STATE
  // =========================================

  const [activeCategory, setActiveCategory] =
    useState("Garba");

  const [currentSongIndex, setCurrentSongIndex] =
    useState(0);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  // =========================================
  // FILTER CURRENT CATEGORY
  // =========================================

  const filteredPlaylist =
    playlistData.filter(
      (song) =>
        song.category === activeCategory
    );

  const currentSong =
    filteredPlaylist[currentSongIndex];

  // =========================================
  // NEXT
  // =========================================

  const handleNext = () => {
    if (filteredPlaylist.length === 0) {
      return;
    }

    setCurrentTime(0);
    setDuration(0);

    setCurrentSongIndex(
      (currentSongIndex + 1) %
        filteredPlaylist.length
    );
  };

  // =========================================
  // PREVIOUS
  // =========================================

  const handlePrevious = () => {
    if (filteredPlaylist.length === 0) {
      return;
    }

    setCurrentTime(0);
    setDuration(0);

    setCurrentSongIndex(
      (currentSongIndex -
        1 +
        filteredPlaylist.length) %
        filteredPlaylist.length
    );
  };

  // =========================================
  // CATEGORY CHANGE
  // =========================================

  const handleCategoryChange = (
    category
  ) => {
    setActiveCategory(category);

    setCurrentSongIndex(0);

    setCurrentTime(0);

    setDuration(0);

    setIsPlaying(false);
  };

  // =========================================
  // SEEK
  // =========================================

  const handleSeek = (seconds) => {
    if (!youtubeRef.current) {
      return;
    }

    if (!Number.isFinite(seconds)) {
      return;
    }

    const safeTime = Math.max(
      0,
      Math.min(
        seconds,
        duration || 0
      )
    );

    console.log(
      "APP SEEK:",
      safeTime
    );

    youtubeRef.current.seekTo(
      safeTime
    );

    setCurrentTime(
      safeTime
    );
  };

  // =========================================
  // SELECT SONG FROM PLAYLIST POPUP
  // =========================================

  const handleSelectSong = (
    selectedSong
  ) => {
    if (!selectedSong) {
      return;
    }

    // Find all songs in selected category

    const selectedCategorySongs =
      playlistData.filter(
        (song) =>
          song.category ===
          selectedSong.category
      );

    // Find selected song index

    const selectedIndex =
      selectedCategorySongs.findIndex(
        (song) =>
          song.youtubeId ===
          selectedSong.youtubeId
      );

    if (selectedIndex === -1) {
      return;
    }

    // Change category

    setActiveCategory(
      selectedSong.category
    );

    // Change song

    setCurrentSongIndex(
      selectedIndex
    );

    // Reset timeline

    setCurrentTime(0);

    setDuration(0);

    // Start selected song

    setIsPlaying(true);
  };

  // =========================================
  // FULLSCREEN
  // =========================================

  const handleFullscreen = async () => {
    try {
      // Enter fullscreen
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      // Exit fullscreen
      else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(
        "Fullscreen failed:",
        error
      );
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="relative h-screen w-full overflow-hidden">

      {/* =====================================
          YOUTUBE ENGINE
      ===================================== */}

      <YouTubeEngine
        ref={youtubeRef}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onEnded={handleNext}

        onTimeUpdate={(event) => {
          setCurrentTime(
            event.currentTarget.currentTime
          );
        }}

        onDurationChange={(event) => {
          setDuration(
            event.currentTarget.duration
          );
        }}
      />

      {/* =====================================
          FLOOR
      ===================================== */}

      <FloorCanvas
        isPlaying={isPlaying}
        activeCategory={activeCategory}
      />

      {/* =====================================
          HEADER
      ===================================== */}

      <Header
        activeCategory={activeCategory}
        setActiveCategory={
          handleCategoryChange
        }
        setCurrentSongIndex={
          setCurrentSongIndex
        }
        setIsPlaying={
          setIsPlaying
        }
      />

      {/* =====================================
          PLAYER DOCK
      ===================================== */}

      <PlayerDock
        currentSong={currentSong}
        activeCategory={activeCategory}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={() =>
          setIsPlaying(
            (value) => !value
          )
        }
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onSelectSong={
          handleSelectSong
        }
        onFullscreen={
          handleFullscreen
        }
      />

      {/* =====================================
          DECORATIVE FRAME
      ===================================== */}

      <DecorativeFrame
        activeCategory={
          activeCategory
        }
      />

    </main>
  );
}

export default App;