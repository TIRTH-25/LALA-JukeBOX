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

  // =========================================
  // RESET WHEN SONG CHANGES
  // =========================================

  useEffect(() => {
    durationRef.current = 0;
    endedRef.current = false;
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

      console.log("Seeking to:", seconds);

      try {
        player.currentTime = seconds;
      } catch (error) {
        console.error("Seek failed:", error);
      }
    },
  }));

  // =========================================
  // PLAYER READY
  // =========================================

  const handleReady = () => {
    console.log(
      "Player ready:",
      currentSong?.title
    );

    /*
     * If the user pressed Next/Previous while
     * music was already playing, ask the new
     * source to start playing.
     */
    if (isPlaying && playerRef.current) {
      try {
        const result = playerRef.current.play();

        if (result?.catch) {
          result.catch((error) => {
            console.log(
              "Mobile autoplay prevented:",
              error
            );
          });
        }
      } catch (error) {
        console.log(
          "Playback request failed:",
          error
        );
      }
    }
  };

  // =========================================
  // TIME UPDATE
  // =========================================

  const handleTimeUpdate = (event) => {
    const currentTime =
      event.currentTarget.currentTime;

    const duration =
      durationRef.current;

    // Keep App.jsx timeline working
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
        "Song finished - moving to next"
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
  // NORMAL ENDED EVENT
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
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
      />
    </div>
  );
});

export default YouTubeEngine;