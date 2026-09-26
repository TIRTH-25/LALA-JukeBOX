function DecorativeFrame({ activeCategory }) {
  const themes = {
    Garba: {
      primary: "#fbbf24",       // Neon amber
      secondary: "#1a0604",     // Near-black burgundy
      light: "#4c1d95",         // Dark slate red (for cards)
      strip: "rgba(251, 191, 36, 0.15)",
    },
    DJ: {
      primary: "#c084fc",       // Neon violet
      secondary: "#0f0518",     // Pitch black purple
      light: "#2e1065",         // Deep purple (for cards)
      strip: "rgba(192, 132, 252, 0.15)",
    },
    Soundcheck: {
      primary: "#E10600",
      secondary: "#000000",
      light: "#151515",
      strip: "rgba(225, 6, 0, 0.14)",
    },
    "kathiyawadi-raas": {
      primary: "#E6007E",       // Rani Pink borders
      secondary: "#0d1b2a",     // Midnight Indigo background
      light: "#3b0625",         // Mustard yellow for dots/diamonds
      strip: "rgba(230, 0, 126, 0.15)", // Translucent pink strip
    },
  };

  const theme = themes[activeCategory] || themes.Garba;

  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-0
        z-10
        transition-colors
        duration-300
      "
      aria-hidden="true"
    >
      {/* =====================================
          OUTER BORDER
      ===================================== */}

      <div
        className="
          absolute
          inset-[10px]
          border
          sm:inset-[16px]
          lg:inset-[24px]
          transition-colors
          duration-300
        "
        style={{
          borderColor: theme.primary,
        }}
      />

      {/* =====================================
          TOP TILE STRIP
      ===================================== */}

      <div
        className="
          absolute
          left-[11px]
          right-[11px]
          top-[11px]
          h-[22px]
          sm:left-[17px]
          sm:right-[17px]
          sm:top-[17px]
          lg:left-[25px]
          lg:right-[25px]
          lg:top-[25px]
          lg:h-[28px]
        "
        style={{
          backgroundColor: theme.strip,

          borderTop: `1px solid ${theme.primary}`,
          borderBottom: `1px solid ${theme.primary}`,

          backgroundImage: `
            linear-gradient(
              90deg,
              transparent 0,
              transparent 28px,
              ${theme.primary} 28px,
              ${theme.primary} 29px
            ),
            radial-gradient(
              circle at 50% 50%,
              ${theme.light} 0 2px,
              transparent 2.5px
            ),
            radial-gradient(
              circle at 42% 50%,
              ${theme.light} 0 1.5px,
              transparent 2px
            ),
            radial-gradient(
              circle at 58% 50%,
              ${theme.light} 0 1.5px,
              transparent 2px
            )
          `,

          backgroundSize:
            "29px 100%, 29px 100%, 29px 100%, 29px 100%",

          backgroundRepeat: "repeat-x",

          transition:
            "background-color 300ms ease, border-color 300ms ease",
        }}
      />

      {/* =====================================
          BOTTOM TILE STRIP
      ===================================== */}

      <div
        className="
          absolute
          bottom-[11px]
          left-[11px]
          right-[11px]
          h-[22px]
          sm:bottom-[17px]
          sm:left-[17px]
          sm:right-[17px]
          lg:bottom-[25px]
          lg:left-[25px]
          lg:right-[25px]
          lg:h-[28px]
        "
        style={{
          backgroundColor: theme.strip,

          borderTop: `1px solid ${theme.primary}`,
          borderBottom: `1px solid ${theme.primary}`,

          backgroundImage: `
            linear-gradient(
              90deg,
              transparent 0,
              transparent 28px,
              ${theme.primary} 28px,
              ${theme.primary} 29px
            ),
            radial-gradient(
              circle at 50% 50%,
              ${theme.light} 0 2px,
              transparent 2.5px
            ),
            radial-gradient(
              circle at 42% 50%,
              ${theme.light} 0 1.5px,
              transparent 2px
            ),
            radial-gradient(
              circle at 58% 50%,
              ${theme.light} 0 1.5px,
              transparent 2px
            )
          `,

          backgroundSize:
            "29px 100%, 29px 100%, 29px 100%, 29px 100%",

          backgroundRepeat: "repeat-x",

          transition:
            "background-color 300ms ease, border-color 300ms ease",
        }}
      />

      {/* =====================================
          LEFT TILE STRIP
      ===================================== */}

      <div
        className="
          absolute
          bottom-[11px]
          left-[11px]
          top-[11px]
          w-[22px]
          sm:bottom-[17px]
          sm:left-[17px]
          sm:top-[17px]
          lg:bottom-[25px]
          lg:left-[25px]
          lg:top-[25px]
          lg:w-[28px]
        "
        style={{
          backgroundColor: theme.strip,

          borderLeft: `1px solid ${theme.primary}`,
          borderRight: `1px solid ${theme.primary}`,

          backgroundImage: `
            linear-gradient(
              0deg,
              transparent 0,
              transparent 28px,
              ${theme.primary} 28px,
              ${theme.primary} 29px
            ),
            radial-gradient(
              circle at 50% 50%,
              ${theme.light} 0 2px,
              transparent 2.5px
            ),
            radial-gradient(
              circle at 42% 50%,
              ${theme.light} 0 1.5px,
              transparent 2px
            ),
            radial-gradient(
              circle at 58% 50%,
              ${theme.light} 0 1.5px,
              transparent 2px
            )
          `,

          backgroundSize:
            "100% 29px, 100% 29px, 100% 29px, 100% 29px",

          backgroundRepeat: "repeat-y",

          transition:
            "background-color 300ms ease, border-color 300ms ease",
        }}
      />

      {/* =====================================
          RIGHT TILE STRIP
      ===================================== */}

      <div
        className="
          absolute
          bottom-[11px]
          right-[11px]
          top-[11px]
          w-[22px]
          sm:bottom-[17px]
          sm:right-[17px]
          sm:top-[17px]
          lg:bottom-[25px]
          lg:right-[25px]
          lg:top-[25px]
          lg:w-[28px]
        "
        style={{
          backgroundColor: theme.strip,

          borderLeft: `1px solid ${theme.primary}`,
          borderRight: `1px solid ${theme.primary}`,

          backgroundImage: `
            linear-gradient(
              0deg,
              transparent 0,
              transparent 28px,
              ${theme.primary} 28px,
              ${theme.primary} 29px
            ),
            radial-gradient(
              circle at 50% 50%,
              ${theme.light} 0 2px,
              transparent 2.5px
            ),
            radial-gradient(
              circle at 42% 50%,
              ${theme.light} 0 1.5px,
              transparent 2px
            ),
            radial-gradient(
              circle at 58% 50%,
              ${theme.light} 0 1.5px,
              transparent 2px
            )
          `,

          backgroundSize:
            "100% 29px, 100% 29px, 100% 29px, 100% 29px",

          backgroundRepeat: "repeat-y",

          transition:
            "background-color 300ms ease, border-color 300ms ease",
        }}
      />

      {/* =====================================
          INNER FRAME
      ===================================== */}

      <div
        className="
          absolute
          inset-[26px]
          border
          sm:inset-[32px]
          lg:inset-[46px]
        "
        style={{
          borderColor: theme.primary,
          transition: "border-color 300ms ease",
        }}
      />

      {/* =====================================
          CORNER DIAMONDS
      ===================================== */}

      <Corner
        className="
          left-[17px]
          top-[17px]
          sm:left-[23px]
          sm:top-[23px]
          lg:left-[31px]
          lg:top-[31px]
        "
        theme={theme}
      />

      <Corner
        className="
          right-[17px]
          top-[17px]
          sm:right-[23px]
          sm:top-[23px]
          lg:right-[31px]
          lg:top-[31px]
        "
        theme={theme}
      />

      <Corner
        className="
          bottom-[17px]
          left-[17px]
          sm:bottom-[23px]
          sm:left-[23px]
          lg:bottom-[31px]
          lg:left-[31px]
        "
        theme={theme}
      />

      <Corner
        className="
          bottom-[17px]
          right-[17px]
          sm:bottom-[23px]
          sm:right-[23px]
          lg:bottom-[31px]
          lg:right-[31px]
        "
        theme={theme}
      />
    </div>
  );
}

/* =========================================
   CORNER
========================================= */

function Corner({ className, theme }) {
  return (
    <div
      className={`
        absolute
        flex
        h-7
        w-7
        items-center
        justify-center
        ${className}
      `}
    >
      <div
        className="
          h-4
          w-4
          rotate-45
          border
          transition-colors
          duration-300
        "
        style={{
          borderColor: theme.primary,
        }}
      />

      <div
        className="
          absolute
          h-1.5
          w-1.5
          rounded-full
          transition-colors
          duration-300
        "
        style={{
          backgroundColor: theme.light,
        }}
      />
    </div>
  );
}

export default DecorativeFrame;