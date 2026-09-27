import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import ReactPlayer from "react-player";

const YouTubeEngine = forwardRef(function YouTubeEngine(
  {
    currentSong,
    isPlaying,
    onEnded,
    onTimeUpdate,
    onDurationChange,
  },
  ref
) {
  const playerRef = useRef(null);

  const durationRef = useRef(0);
  const endedRef = useRef(false);

  // Retry timer
  const playRetryRef = useRef(null);

  // Track current song
  const songIdRef = useRef(null);

  // =========================================
  // CLEAR RETRY
  // =========================================

  const clearPlayRetry = () => {
    if (playRetryRef.current) {
      clearInterval(playRetryRef.current);
      playRetryRef.current = null;
    }
  };

  // =========================================
  // RESET WHEN SONG CHANGES
  // =========================================

  useEffect(() => {
    const newSongId = currentSong?.youtubeId;

    songIdRef.current = newSongId;

    durationRef.current = 0;
    endedRef.current = false;

    clearPlayRetry();

    console.log(
      "Song changed:",
      currentSong?.title
    );

    return () => {
      clearPlayRetry();
    };
  }, [currentSong?.youtubeId]);

  // =========================================
  // SEEK
  // =========================================

  useImperativeHandle(ref, () => ({
    seekTo(seconds) {
      const player = playerRef.current;

      if (!player) {
        console.log(
          "YouTube player not ready"
        );
        return;
      }

      if (!Number.isFinite(seconds)) {
        return;
      }

      try {
        player.currentTime = seconds;
      } catch (error) {
        console.error(
          "Seek failed:",
          error
        );
      }
    },
  }));

  // =========================================
  // PLAY PLAYER
  // =========================================

  const tryPlay = () => {
    const player = playerRef.current;

    if (!player || !isPlaying) {
      return false;
    }

    // Make sure we are still controlling
    // the current song
    if (
      songIdRef.current !==
      currentSong?.youtubeId
    ) {
      return false;
    }

    try {
      const result = player.play();

      if (result && typeof result.catch === "function") {
        result.catch((error) => {
          console.log(
            "Play waiting:",
            error?.message || error
          );
        });
      }

      return true;
    } catch (error) {
      console.log(
        "Play request failed:",
        error
      );

      return false;
    }
  };

  // =========================================
  // START PLAY RETRY
  // =========================================

  const startPlayRetry = () => {
    clearPlayRetry();

    if (!isPlaying) {
      return;
    }

    let attempts = 0;

    playRetryRef.current = setInterval(() => {
      attempts++;

      if (
        !isPlaying ||
        attempts > 15
      ) {
        clearPlayRetry();
        return;
      }

      const player = playerRef.current;

      if (!player) {
        return;
      }

      try {
        const result = player.play();

        if (
          result &&
          typeof result.then === "function"
        ) {
          result
            .then(() => {
              console.log(
                "Playback started:",
                currentSong?.title
              );

              clearPlayRetry();
            })
            .catch(() => {
              // Keep retrying
            });
        }
      } catch {
        // Keep retrying
      }
    }, 300);
  };

  // =========================================
  // PLAYER READY
  // =========================================

  const handleReady = () => {
    console.log(
      "Player ready:",
      currentSong?.title
    );

    if (!isPlaying) {
      return;
    }

    // First attempt
    tryPlay();

    // Mobile / YouTube loading fallback
    startPlayRetry();
  };

  // =========================================
  // PLAY
  // =========================================

  const handlePlay = () => {
    console.log(
      "Playing:",
      currentSong?.title
    );

    clearPlayRetry();
  };

  // =========================================
  // PAUSE
  // =========================================

  const handlePause = () => {
    console.log(
      "Paused:",
      currentSong?.title
    );
  };

  // =========================================
  // TIME UPDATE
  // =========================================

  const handleTimeUpdate = (event) => {
    const currentTime =
      event.currentTarget.currentTime;

    const duration =
      durationRef.current;

    if (onTimeUpdate) {
      onTimeUpdate(event);
    }

    // =======================================
    // FALLBACK END DETECTION
    // =======================================

    if (
      isPlaying &&
      duration > 0 &&
      currentTime >= duration - 0.5 &&
      !endedRef.current
    ) {
      endedRef.current = true;

      clearPlayRetry();

      console.log(
        "Song finished - next song"
      );

      onEnded?.();
    }
  };

  // =========================================
  // DURATION
  // =========================================

  const handleDurationChange = (event) => {
    const duration =
      event.currentTarget.duration;

    if (
      Number.isFinite(duration) &&
      duration > 0
    ) {
      durationRef.current = duration;
    }

    if (onDurationChange) {
      onDurationChange(event);
    }
  };

  // =========================================
  // ENDED
  // =========================================

  const handleEnded = () => {
    if (endedRef.current) {
      return;
    }

    endedRef.current = true;

    clearPlayRetry();

    console.log(
      "YouTube ended:",
      currentSong?.title
    );

    onEnded?.();
  };

  // =========================================
  // WHEN PLAYING CHANGES TO TRUE
  // =========================================

  useEffect(() => {
    if (!isPlaying) {
      clearPlayRetry();
      return;
    }

    // If player is already ready,
    // try starting immediately.
    const timer = setTimeout(() => {
      tryPlay();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [
    isPlaying,
    currentSong?.youtubeId,
  ]);

  // =========================================
  // NO SONG
  // =========================================

  if (!currentSong?.youtubeId) {
    return null;
  }

  // =========================================
  // PLAYER
  // =========================================

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "320px",
        height: "180px",
        zIndex: 1,
        opacity: 0.01,
        pointerEvents: "none",
      }}
    >
      <ReactPlayer
        ref={playerRef}

        src={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}

        playing={isPlaying}

        controls={false}

        width="320px"
        height="180px"

        volume={1}
        muted={false}
        playsInline

        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
      />
    </div>
  );
});

export default YouTubeEngine;

