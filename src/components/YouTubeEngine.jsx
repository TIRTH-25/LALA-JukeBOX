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
  const retryTimerRef = useRef(null);

  // =========================================
  // CLEAR RETRY TIMER
  // =========================================

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  // =========================================
  // RESET WHEN SONG CHANGES
  // =========================================

  useEffect(() => {
    durationRef.current = 0;
    endedRef.current = false;

    clearRetryTimer();

    return () => {
      clearRetryTimer();
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

        console.log(
          "Seeking to:",
          seconds
        );
      } catch (error) {
        console.error(
          "Seek failed:",
          error
        );
      }
    },
  }));

  // =========================================
  // TRY PLAY
  // =========================================

  const tryPlay = () => {
    if (!isPlaying) {
      return;
    }

    const player = playerRef.current;

    if (!player) {
      return;
    }

    try {
      // ReactPlayer v3 exposes the underlying
      // media interface through the ref.

      if (typeof player.play === "function") {
        const result = player.play();

        if (result?.catch) {
          result.catch(() => {
            console.log(
              "Playback waiting for browser/player"
            );
          });
        }
      }
    } catch (error) {
      console.log(
        "Play request failed:",
        error
      );
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

    clearRetryTimer();

    if (!isPlaying) {
      return;
    }

    // First attempt
    tryPlay();

    // =======================================
    // MOBILE RETRY
    // =======================================

    let attempts = 0;

    retryTimerRef.current = setInterval(() => {
      attempts++;

      if (!isPlaying || attempts >= 12) {
        clearRetryTimer();
        return;
      }

      // If already playing, stop retrying.
      if (playerRef.current) {
        tryPlay();
      }
    }, 400);
  };

  // =========================================
  // PLAY
  // =========================================

  const handlePlay = () => {
    console.log(
      "Playing:",
      currentSong?.title
    );

    clearRetryTimer();
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

