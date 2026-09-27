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
  const playRetryRef = useRef(null);

  // =========================================
  // RESET WHEN SONG CHANGES
  // =========================================

  useEffect(() => {
    durationRef.current = 0;
    endedRef.current = false;

    // Clear previous retry timer
    if (playRetryRef.current) {
      clearInterval(playRetryRef.current);
      playRetryRef.current = null;
    }

    return () => {
      if (playRetryRef.current) {
        clearInterval(playRetryRef.current);
        playRetryRef.current = null;
      }
    };
  }, [currentSong?.youtubeId]);

  // =========================================
  // SEEK
  // =========================================

  useImperativeHandle(ref, () => ({
    seekTo(seconds) {
      const player = playerRef.current;

      if (!player) {
        console.log("YouTube player not ready");
        return;
      }

      if (!Number.isFinite(seconds)) {
        return;
      }

      try {
        player.currentTime = seconds;
      } catch (error) {
        console.error("Seek failed:", error);
      }
    },
  }));

  // =========================================
  // TRY PLAY
  // =========================================

  const tryPlay = () => {
    const player = playerRef.current;

    if (!player || !isPlaying) {
      return;
    }

    try {
      const result = player.play();

      if (result?.catch) {
        result.catch(() => {
          // Browser may temporarily reject playback.
          // Retry from handleReady.
        });
      }
    } catch (error) {
      console.log("Play request failed:", error);
    }
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

    // Try immediately
    tryPlay();

    // =======================================
    // MOBILE FALLBACK
    // =======================================
    //
    // Some mobile browsers need a little time
    // after a YouTube source changes.
    //

    let attempts = 0;

    playRetryRef.current = setInterval(() => {
      attempts++;

      if (!isPlaying || attempts > 10) {
        clearInterval(playRetryRef.current);
        playRetryRef.current = null;
        return;
      }

      tryPlay();
    }, 300);
  };

  // =========================================
  // PLAY EVENT
  // =========================================

  const handlePlay = () => {
    console.log(
      "Playing:",
      currentSong?.title
    );

    if (playRetryRef.current) {
      clearInterval(playRetryRef.current);
      playRetryRef.current = null;
    }
  };

  // =========================================
  // PAUSE EVENT
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

    console.log(
      "YouTube ended:",
      currentSong?.title
    );

    onEnded?.();
  };

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