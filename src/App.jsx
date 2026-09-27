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

    console.log(
      "NEXT:",
      currentSong?.title
    );

    setCurrentTime(0);
    setDuration(0);

    setCurrentSongIndex((prevIndex) => {
      const nextIndex =
        (prevIndex + 1) %
        filteredPlaylist.length;

      console.log(
        "Next index:",
        nextIndex
      );

      return nextIndex;
    });

    // IMPORTANT:
    // Keep player in playing state
    setIsPlaying(true);
  };

  // =========================================
  // PREVIOUS
  // =========================================

  const handlePrevious = () => {
    if (filteredPlaylist.length === 0) {
      return;
    }

    console.log(
      "PREVIOUS:",
      currentSong?.title
    );

    setCurrentTime(0);
    setDuration(0);

    setCurrentSongIndex((prevIndex) => {
      const previousIndex =
        (prevIndex -
          1 +
          filteredPlaylist.length) %
        filteredPlaylist.length;

      console.log(
        "Previous index:",
        previousIndex
      );

      return previousIndex;
    });

    // IMPORTANT:
    // Keep player in playing state
    setIsPlaying(true);
  };

  // =========================================
  // CATEGORY CHANGE
  // =========================================

  const handleCategoryChange = (
    category
  ) => {
    console.log(
      "CATEGORY:",
      category
    );

    setActiveCategory(category);

    setCurrentSongIndex(0);

    setCurrentTime(0);

    setDuration(0);

    // Start first song
    setIsPlaying(true);
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
  // SELECT SONG FROM PLAYLIST
  // =========================================

  const handleSelectSong = (
    selectedSong
  ) => {
    if (!selectedSong) {
      return;
    }

    console.log(
      "SELECT SONG:",
      selectedSong.title
    );

    // Find songs from selected category

    const selectedCategorySongs =
      playlistData.filter(
        (song) =>
          song.category ===
          selectedSong.category
      );

    // Find selected song

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
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
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
        /*
         * IMPORTANT:
         *
         * Force a completely fresh ReactPlayer
         * whenever YouTube video changes.
         *
         * This helps especially on mobile browsers
         * when changing from one YouTube video
         * directly to another.
         */
        key={currentSong?.youtubeId || "no-song"}

        ref={youtubeRef}

        currentSong={currentSong}

        isPlaying={isPlaying}

        onEnded={handleNext}

        onTimeUpdate={(event) => {
          const time =
            event.currentTarget.currentTime;

          if (Number.isFinite(time)) {
            setCurrentTime(time);
          }
        }}

        onDurationChange={(event) => {
          const newDuration =
            event.currentTarget.duration;

          if (
            Number.isFinite(newDuration) &&
            newDuration > 0
          ) {
            setDuration(newDuration);
          }
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
