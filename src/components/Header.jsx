import { useEffect, useState } from "react";

const categories = [
  { id: "Garba", label: "ગરબા" },
  { id: "DJ", label: "DJ" },
  { id: "Soundcheck", label: "સાઉન્ડચેક" },
];

function Header({ activeCategory, setActiveCategory, setCurrentSongIndex }) {
  const [time, setTime] = useState(new Date());

  // =========================================
  // CLOCK
  // =========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // =========================================
  // CATEGORY THEMES
  // =========================================

  const themes = {
    Garba: {
      text: "#d7aa35",
      logo: "#eadfc8",
      muted: "#bba99d",
      activeBg: "#d7aa35",
      activeText: "#7a1d1e",
      wrapperBg: "rgba(158, 43, 37, 0.4)",
      wrapperBorder: "rgba(215, 170, 53, 0.3)",
    },
    DJ: {
      text: "#a83cff",
      logo: "#f0e7ff",
      muted: "#aaa0b8",
      activeBg: "#a83cff",
      activeText: "#32104f",
      wrapperBg: "rgba(50, 16, 79, 0.4)",
      wrapperBorder: "rgba(168, 60, 255, 0.3)",
    },
Soundcheck: {
  text: "#E10600",
  logo: "#FFFFFF",
  muted: "#A3A3A3",
  activeBg: "#E10600",
  activeText: "#000000",
  wrapperBg: "rgba(0, 0, 0, 0.75)",
  wrapperBorder: "rgba(225, 6, 0, 0.35)",
},
  };

  const theme = themes[activeCategory] || themes.Garba;

  // =========================================
  // CATEGORY CHANGE
  // =========================================

  const handleCategory = (category) => {
    setActiveCategory(category);
    setCurrentSongIndex(0);
  };

return (
  <header
    className="
      fixed
      left-0
      right-0
      top-0
      z-20
      px-12
      pt-12
      pb-3

      sm:px-14
      sm:pt-18
      sm:pb-4

      lg:px-18
    "
  >
    {/* =========================================
        MOBILE HEADER
        ROW 1 = LOGO + CLOCK
    ========================================= */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">

      {/* ROW 1 */}
      <div className="flex items-start justify-between sm:flex-1 sm:items-center">

        {/* LOGO */}
        <div className="shrink-0">
          <div
            className="
              mb-0.5
              text-[9px]
              font-semibold
              tracking-[0.18em]

              sm:mb-1
              sm:text-xs
              sm:tracking-widest
            "
            style={{ color: theme.text }}
          >
            ✦ LALA'S
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-3">
            <div
              className="
                text-[20px]
                font-bold
                leading-none
                tracking-wide
                transition-colors
                duration-300

                sm:text-2xl
              "
              style={{ color: theme.logo }}
            >
              નવરાત્રિ
            </div>

            <div
              className="
                text-[7px]
                uppercase
                tracking-[0.12em]
                opacity-80

                sm:text-[10px]
                sm:tracking-[0.2em]
              "
              style={{ color: theme.logo }}
            >
              | JUKE BOX
            </div>
          </div>
        </div>

        {/* CLOCK */}
        <div className="shrink-0 text-right sm:hidden">
          <div
            className="
              text-[12px]
              font-medium
              tracking-wide
            "
            style={{ color: theme.logo }}
          >
            {formattedTime}
          </div>

          <div
            className="
              mt-0.5
              text-[7px]
              uppercase
              tracking-[0.15em]
            "
            style={{ color: theme.muted }}
          >
            IN THE CIRCLE
          </div>
        </div>

      </div>

      {/* =========================================
          ROW 2 MOBILE
          CATEGORIES
      ========================================= */}
      <div className="flex justify-center pt-5 sm:shrink-0 sm:pt-3">

        <nav
          className="
            flex
            items-center
            rounded-full
            border
            p-1
            backdrop-blur-md
            transition-all
            duration-300
            
            sm:p-1.5
          "
          style={{
            backgroundColor: theme.wrapperBg,
            borderColor: theme.wrapperBorder,
          }}
        >
          {categories.map((category) => {
            const active =
              activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() =>
                  handleCategory(category.id)
                }
                className="
                  shrink-0
                  rounded-full
                  px-3
                  py-1
                  text-[15px]
                  font-medium
                  transition-all
                  duration-300

                  sm:px-5
                  sm:py-1.5
                  sm:text-sm
                "
                style={{
                  backgroundColor: active
                    ? theme.activeBg
                    : "transparent",

                  color: active
                    ? theme.activeText
                    : theme.logo,

                  boxShadow: active
                    ? `0 2px 10px ${theme.activeBg}66`
                    : "none",

                  opacity: active
                    ? 1
                    : 0.7,
                }}
              >
                {category.label}
              </button>
            );
          })}
        </nav>

      </div>

      {/* =========================================
          DESKTOP CLOCK
          Keep desktop layout
      ========================================= */}
      <div className="hidden sm:flex sm:flex-1 sm:justify-end">
        <div className="shrink-0 text-right">

          <div
            className="
              text-sm
              font-medium
              tracking-wide
              transition-colors
              duration-300
            "
            style={{ color: theme.logo }}
          >
            {formattedTime}
          </div>

          <div
            className="
              mt-1
              text-[9px]
              uppercase
              tracking-[0.2em]
              transition-colors
              duration-300
            "
            style={{ color: theme.muted }}
          >
            IN THE CIRCLE
          </div>

        </div>
      </div>

    </div>
  </header>
);
}

export default Header;