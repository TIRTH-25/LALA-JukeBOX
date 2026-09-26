import { useState } from "react";
import playlistData from "../data/playlistData";

function PlayerDock({
  currentSong,
  activeCategory,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onSelectSong,
  onFullscreen,
}) {
  const [isSongsOpen, setIsSongsOpen] = useState(false);

  if (!currentSong) return null;

  // =========================================
  // CATEGORY THEMES
  // =========================================

  const themes = {
    Garba: {
      panel: "#3b0915",
      border: "#d7aa35",
      accent: "#d7aa35",
      title: "#eadfc8",
      muted: "#bba99d",
      secondary: "#5a1524",
    },

    DJ: {
      panel: "#100b18",
      border: "#a83cff",
      accent: "#a83cff",
      title: "#f0e7ff",
      muted: "#aaa0b8",
      secondary: "#261333",
    },

    Soundcheck: {
      panel: "#000000",
      border: "#E10600",
      accent: "#E10600",
      title: "#FFFFFF",
      muted: "#A3A3A3",
      secondary: "#151515",
    },

    "kathiyawadi-raas": {
      panel: "#0d1b2a",
      border: "#E6007E",
      accent: "#E6007E",
      title: "#F4E8D0",
      muted: "#C8AFA0",
      secondary: "#8B3A3A",
    },
  };

  const theme =
    themes[activeCategory] || themes.Garba;

  // =========================================
  // CATEGORY LABELS
  // =========================================

  const categoryLabels = {
    Garba: "ગરબા",
    DJ: "DJ",
    Soundcheck: "સાઉન્ડચેક",
    "kathiyawadi-raas": "કાઠિયાવાડી-રાસ",
  };

  const categoryLabel =
    categoryLabels[activeCategory] || "ગરબા";

  // =========================================
  // ACTIVE CATEGORY SONGS
  // =========================================

  const activeCategorySongs = playlistData.filter(
    (song) =>
      song.category === activeCategory
  );

  // =========================================
  // YOUTUBE URL
  // =========================================

  const youtubeUrl = currentSong.youtubeId
    ? `https://www.youtube.com/watch?v=${currentSong.youtubeId}`
    : "#";

  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime = (seconds) => {
    if (
      !Number.isFinite(seconds) ||
      seconds < 0
    ) {
      return "0:00";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds = Math.floor(
      seconds % 60
    );

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const currentTimeText =
    formatTime(currentTime);

  const durationText =
    formatTime(duration);

  // =========================================
  // TIMELINE
  // =========================================

  const progress =
    duration > 0
      ? Math.min(
          Math.max(
            (currentTime / duration) * 100,
            0
          ),
          100
        )
      : 0;

  const seekFromPointer = (event) => {
    if (!duration || !onSeek) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    if (!rect.width) return;

    const position =
      event.clientX - rect.left;

    const percentage = Math.min(
      Math.max(position / rect.width, 0),
      1
    );

    const newTime =
      percentage * duration;

    onSeek(newTime);
  };

  const handleTimelinePointerDown = (
    event
  ) => {
    if (!duration || !onSeek) return;

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    seekFromPointer(event);
  };

  const handleTimelinePointerMove = (
    event
  ) => {
    if (!duration || !onSeek) return;

    if (
      !event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      return;
    }

    seekFromPointer(event);
  };

  const handleTimelinePointerUp = (event) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  };

  // =========================================
  // SONG SELECTION
  // =========================================

  const handleSongSelect = (song) => {
    if (!onSelectSong) return;

    onSelectSong(song);

    setIsSongsOpen(false);
  };

  // =========================================
  // NEXT SONG
  // ONLY WITHIN ACTIVE CATEGORY
  // =========================================

  // const handleCategoryNext = () => {
  //   if (!activeCategorySongs.length) return;

  //   const currentIndex =
  //     activeCategorySongs.findIndex(
  //       (song) =>
  //         song.youtubeId ===
  //         currentSong.youtubeId
  //     );

  //   const nextIndex =
  //     currentIndex === -1
  //       ? 0
  //       : (currentIndex + 1) %
  //         activeCategorySongs.length;

  //   handleSongSelect(
  //     activeCategorySongs[nextIndex]
  //   );
  // };

  // =========================================
  // PREVIOUS SONG
  // ONLY WITHIN ACTIVE CATEGORY
  // =========================================

  // const handleCategoryPrevious = () => {
  //   if (!activeCategorySongs.length) return;

  //   const currentIndex =
  //     activeCategorySongs.findIndex(
  //       (song) =>
  //         song.youtubeId ===
  //         currentSong.youtubeId
  //     );

  //   const previousIndex =
  //     currentIndex === -1
  //       ? 0
  //       : (currentIndex -
  //           1 +
  //           activeCategorySongs.length) %
  //         activeCategorySongs.length;

  //   handleSongSelect(
  //     activeCategorySongs[previousIndex]
  //   );
  // };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[220px]">

      {/* =====================================
          CREATED BY
      ===================================== */}

      <div
        className="
          absolute
          bottom-12
          left-12
          flex
          items-center
          gap-3
          sm:left-18
          sm:bottom-18
        "
        style={{
          color: theme.muted,
        }}
      >
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-[0.15em] sm:text-[12px]">
            MADE BY
          </div>

          <div className="mt-1 text-[12px] font-bold uppercase tracking-[0.15em] sm:text-[18px]">
            TIRTH-25
          </div>
        </div>
      </div>

      {/* =====================================
          CENTER PLAYER
      ===================================== */}

      <div
        className="
          pointer-events-auto
          absolute
          bottom-24
          left-1/2
          w-[calc(100%-90px)]
          max-w-[530px]
          -translate-x-1/2

          sm:bottom-16
          sm:w-[calc(100%-32px)]
        "
      >

        {/* ===================================
            SONGS POPUP
        =================================== */}

        {isSongsOpen && (
          <div
            className="
              absolute
              bottom-[calc(100%+10px)]
              left-1/2
              w-[calc(100vw-90px)]
              max-w-[530px]
              -translate-x-1/2
              overflow-hidden
              rounded-xl
              border
              shadow-2xl
            "
            style={{
              backgroundColor: "#050505",
              borderColor: theme.border,
              boxShadow:
                "0 15px 50px rgba(0,0,0,0.75)",
            }}
          >

            {/* POPUP HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                px-4
                py-3
              "
              style={{
                borderColor: theme.border,
              }}
            >
              <div>

                <div
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                  "
                  style={{
                    color: theme.title,
                  }}
                >
                  PLAYLIST
                </div>

                <div
                  className="
                    mt-1
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                  "
                  style={{
                    color: theme.muted,
                  }}
                >
                  {categoryLabel} •{" "}
                  {activeCategorySongs.length}{" "}
                  {activeCategorySongs.length === 1
                    ? "SONG"
                    : "SONGS"}
                </div>

              </div>

              <button
                onClick={() =>
                  setIsSongsOpen(false)
                }
                aria-label="Close songs"
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  border
                  text-sm
                  transition
                  hover:bg-white/10
                "
                style={{
                  borderColor: theme.border,
                  color: theme.accent,
                }}
              >
                ×
              </button>

            </div>

            {/* =================================
                ACTIVE CATEGORY SONG LIST
            ================================= */}

            <div className="hide-scrollbar max-h-[320px] overflow-y-auto">

              {activeCategorySongs.length ===
              0 ? (
                <div
                  className="
                    px-4
                    py-8
                    text-center
                    text-[10px]
                    uppercase
                    tracking-[0.12em]
                  "
                  style={{
                    color: theme.muted,
                  }}
                >
                  No songs in this category
                </div>
              ) : (
                activeCategorySongs.map(
                  (song) => {
                    const isCurrentSong =
                      currentSong?.youtubeId ===
                      song.youtubeId;

                    return (
                      <button
                        key={song.youtubeId}
                        onClick={() =>
                          handleSongSelect(song)
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          border-b
                          px-4
                          py-2.5
                          text-left
                          transition
                          hover:bg-white/5
                        "
                        style={{
                          backgroundColor:
                            isCurrentSong
                              ? `${theme.accent}18`
                              : "transparent",

                          borderColor:
                            "rgba(255,255,255,0.05)",
                        }}
                      >

                        {/* THUMBNAIL */}

                        <div
                          className="
                            h-10
                            w-10
                            shrink-0
                            overflow-hidden
                            rounded-md
                          "
                          style={{
                            border:
                              `1px solid ${theme.border}`,
                          }}
                        >
                          {song.youtubeId ? (
                            <img
                              src={`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`}
                              alt=""
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                              "
                              style={{
                                backgroundColor:
                                  theme.secondary,
                                color:
                                  theme.accent,
                              }}
                            >
                              ♪
                            </div>
                          )}
                        </div>

                        {/* SONG INFO */}

                        <div className="min-w-0 flex-1">

                          <div
                            className="
                              truncate
                              text-[11px]
                              font-semibold
                              sm:text-[12px]
                            "
                            style={{
                              color:
                                isCurrentSong
                                  ? theme.accent
                                  : theme.title,
                            }}
                          >
                            {song.title}
                          </div>

                          <div
                            className="
                              mt-0.5
                              truncate
                              text-[9px]
                              sm:text-[10px]
                            "
                            style={{
                              color: theme.muted,
                            }}
                          >
                            {song.artist}
                          </div>

                        </div>

                        {/* CURRENT SONG */}

                        {isCurrentSong && (
                          <div
                            className="
                              flex
                              shrink-0
                              items-center
                              gap-1
                              text-[9px]
                            "
                            style={{
                              color: theme.accent,
                            }}
                          >
                            <span>
                              {isPlaying
                                ? "▶"
                                : "Ⅱ"}
                            </span>

                            <span className="hidden sm:inline">
                              NOW
                            </span>
                          </div>
                        )}

                      </button>
                    );
                  }
                )
              )}

            </div>
          </div>
        )}

        {/* ===================================
            PLAYER PANEL
        =================================== */}

        <div
          className="px-3 py-2.5 sm:px-3.5 sm:py-3"
          style={{
            backgroundColor: theme.panel,
            border:
              `1px solid ${theme.border}`,
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.4)",
          }}
        >

          {/* SONG INFORMATION */}

          <div className="flex items-center gap-3">

            {/* COVER */}

            <div
              className="
                h-11
                w-11
                shrink-0
                overflow-hidden
                sm:h-12
                sm:w-12
              "
              style={{
                border:
                  `1px solid ${theme.border}`,
              }}
            >
              {currentSong.youtubeId ? (
                <img
                  src={`https://img.youtube.com/vi/${currentSong.youtubeId}/mqdefault.jpg`}
                  alt=""
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    text-xs
                  "
                  style={{
                    backgroundColor:
                      theme.panel,
                    color:
                      theme.accent,
                  }}
                >
                  ♪
                </div>
              )}
            </div>

            {/* TITLE */}

            <div className="min-w-0 flex-1">

              <div
                className="
                  truncate
                  text-[13px]
                  font-semibold
                  leading-tight
                  sm:text-[14px]
                "
                style={{
                  color: theme.title,
                }}
              >
                {currentSong.title}
              </div>

              <div
                className="
                  mt-1
                  truncate
                  text-[10px]
                  sm:text-[11px]
                "
                style={{
                  color: theme.muted,
                }}
              >
                {currentSong.artist}
              </div>

            </div>

            {/* TIME */}

            <div
              className="
                shrink-0
                self-start
                pt-1
                text-[10px]
                sm:text-[11px]
              "
              style={{
                color: theme.muted,
              }}
            >
              {currentTimeText} /{" "}
              {durationText}
            </div>

          </div>

          {/* TIMELINE */}

          <div className="mt-3 w-full">

            <div
              className="
                relative
                h-[8px]
                w-full
                cursor-pointer
                rounded-full
              "
              style={{
                backgroundColor:
                  "rgba(255,255,255,0.14)",
                touchAction: "none",
              }}
              onPointerDown={
                handleTimelinePointerDown
              }
              onPointerMove={
                handleTimelinePointerMove
              }
              onPointerUp={
                handleTimelinePointerUp
              }
              role="slider"
              aria-label="Song progress"
              aria-valuemin={0}
              aria-valuemax={duration || 0}
              aria-valuenow={currentTime}
            >

              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-full
                  rounded-full
                "
                style={{
                  width: `${progress}%`,
                  backgroundColor:
                    theme.accent,
                }}
              />

              <div
                className="
                  absolute
                  top-1/2
                  h-3
                  w-3
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                "
                style={{
                  left: `${progress}%`,
                  backgroundColor:
                    theme.accent,
                  boxShadow:
                    `0 0 8px ${theme.accent}`,
                }}
              />

            </div>

            <div
              className="
                mt-1
                flex
                justify-between
                text-[9px]
                sm:text-[10px]
              "
              style={{
                color: theme.muted,
              }}
            >
              <span>
                {currentTimeText}
              </span>

              <span>
                {durationText}
              </span>
            </div>

          </div>

          {/* PLAYER CONTROLS */}

          <div
            className="
              mt-2
              flex
              items-center
              justify-between
              gap-2
              sm:gap-2.5
            "
          >

            {/* PLAY / PAUSE */}

            <button
              onClick={onPlayPause}
              aria-label={
                isPlaying
                  ? "Pause"
                  : "Play"
              }
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                text-sm
                transition-transform
                duration-150
                active:scale-95
                sm:h-12
                sm:w-12
                sm:text-base
              "
              style={{
                backgroundColor:
                  theme.accent,
                color:
                  theme.panel,
              }}
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>

            {/* PREVIOUS */}

            <button
              onClick={onPrevious}
              aria-label="Previous song"
              className="
                flex
                h-10
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1
                rounded-full
                border
                px-2
                transition-colors
                duration-200
                hover:bg-white/5
                sm:h-11
                sm:gap-1.5
              "
              style={{
                borderColor:
                  theme.border,
                color:
                  theme.accent,
              }}
            >
              <span className="text-[11px] sm:text-xs">
                |◀
              </span>

              <span className="text-[10px] sm:text-[12px]">
                પાછલું
              </span>

              <span className="hidden text-[7px] tracking-[0.12em] sm:inline sm:text-[8px]">
                PREV
              </span>
            </button>

            {/* NEXT */}

            <button
              onClick={onNext}
              aria-label="Next song"
              className="
                flex
                h-10
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1
                rounded-full
                border
                px-2
                transition-colors
                duration-200
                hover:bg-white/5
                sm:h-11
                sm:gap-1.5
              "
              style={{
                borderColor:
                  theme.border,
                color:
                  theme.accent,
              }}
            >
              <span className="text-[11px] sm:text-xs">
                ▶|
              </span>

              <span className="text-[10px] sm:text-[12px]">
                આગળ
              </span>

              <span className="hidden text-[7px] tracking-[0.12em] sm:inline sm:text-[8px]">
                NEXT
              </span>
            </button>

            {/* SONGS */}

            <button
              onClick={() =>
                setIsSongsOpen(
                  (value) => !value
                )
              }
              aria-label="Open songs"
              aria-expanded={isSongsOpen}
              className="
                flex
                h-10
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1
                rounded-full
                border
                px-2
                transition-colors
                duration-200
                hover:bg-white/5
                sm:h-11
                sm:gap-1.5
              "
              style={{
                borderColor:
                  theme.border,
                color:
                  theme.accent,
                backgroundColor:
                  isSongsOpen
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
              }}
            >
              <span className="text-[11px] sm:text-xs">
                ☰
              </span>

              <span className="truncate text-[9px] sm:text-[11px]">
                {categoryLabel}
              </span>

              <span className="hidden text-[6px] tracking-[0.08em] sm:inline sm:text-[8px]">
                SONGS
              </span>
            </button>

            {/* FULLSCREEN */}

            <button
              onClick={onFullscreen}
              aria-label="Fullscreen"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                text-sm
                transition-all
                duration-200
                hover:bg-white/5
                active:scale-95
                sm:h-11
                sm:w-11
                sm:text-base
              "
              style={{
                borderColor:
                  theme.border,
                color:
                  theme.accent,
              }}
            >
              ⛶
            </button>

          </div>
        </div>
      </div>

      {/* =====================================
          STREAMING VIA YOUTUBE
      ===================================== */}

      {currentSong.youtubeId && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${currentSong.title} on YouTube`}
          className="
            pointer-events-auto
            absolute
            bottom-13
            right-12
            flex
            items-center
            gap-2
            transition-opacity
            duration-200
            hover:opacity-80
            sm:right-18
            sm:bottom-18
          "
        >
          <span
            className="
              text-[9px]
              sm:text-[12px]
            "
            style={{
              color: theme.muted,
            }}
          >
            Streaming via
          </span>

          <span
            className="
              flex
              items-center
              gap-1
              text-[22px]
              font-semibold
              leading-none
              sm:text-[30px]
            "
            style={{
              color: theme.title,
            }}
          >
            <span
              className="
                flex
                h-[19px]
                w-[30px]
                items-center
                justify-center
                rounded-[5px]
                sm:h-[26px]
                sm:w-[42px]
              "
              style={{
                backgroundColor:
                  "#ff0000",
              }}
            >
              <span className="ml-[2px] text-[9px] text-white sm:text-[13px]">
                ▶
              </span>
            </span>

            YouTube
          </span>
        </a>
      )}

    </div>
  );
}

export default PlayerDock;
