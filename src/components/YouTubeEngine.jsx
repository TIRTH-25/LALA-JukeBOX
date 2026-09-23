import {
  forwardRef,
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

  useImperativeHandle(ref, () => ({
    seekTo(seconds) {
      const player = playerRef.current;

      if (!player) {
        console.log("YouTube player not ready");
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

  if (!currentSong?.youtubeId) {
    return null;
  }

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
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onDurationChange={onDurationChange}
      />
    </div>
  );
});

export default YouTubeEngine;