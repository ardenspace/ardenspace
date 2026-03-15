import { useState, useRef, useEffect } from "react";
import { BsStars } from "react-icons/bs";
import { GrLanguage } from "react-icons/gr";
import { IoVolumeMediumSharp, IoVolumeMuteOutline } from "react-icons/io5";
import { useStore } from "../stores/useStore";
import { useT } from "../i18n";

function MenuItem({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded hover:bg-black/5 text-white/80 hover:text-white text-xs font-semibold  cursor-pointer transition-colors"
    >
      {children}
    </button>
  );
}

function Clock() {
  const [now, setNow] = useState(new Date());
  const lang = useStore((s) => s.lang);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = lang === "ko" ? "ko-KR" : "en-US";
  const formatted =
    now.toLocaleDateString(locale, {
      month: "long",
      day: "numeric",
      weekday: "short",
    }) +
    " " +
    now.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <span className="text-xs font-bold min-w-[145px] text-center">
      {formatted}
    </span>
  );
}

export default function MenuBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const setScene = useStore((s) => s.setScene);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const setSoundEnabled = useStore((s) => s.setSoundEnabled);
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const t = useT();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="absolute left-1 right-1 sm:left-2 sm:right-3 h-10 flex items-center justify-between px-2 sm:px-4 text-white/80 text-xs z-50">
      {/* Left: Icon + menu */}
      <div ref={menuRef} className="relative flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hover:text-white transition-colors cursor-pointer flex items-center"
        >
          <BsStars size={19} />
          <span className="ml-2 font-bold">arden'space</span>
        </button>
        {menuOpen && (
          <div className="glass-frosted absolute top-7 left-3 shadow-2xl text-black/80 font-medium flex flex-col min-w-[200px]">
            <MenuItem
              onClick={() => {
                setScene("SPACE");
                setMenuOpen(false);
              }}
            >
              {t("backToSpace")}
            </MenuItem>
          </div>
        )}
      </div>

      {/* Right: Controls + Clock */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <IoVolumeMediumSharp size={17} />
          ) : (
            <IoVolumeMuteOutline size={17} />
          )}
        </button>
        <button
          onClick={() => setLang(lang === "ko" ? "en" : "ko")}
          className="hover:text-white transition-colors cursor-pointer"
        >
          <GrLanguage size={14} />
        </button>
        <Clock />
      </div>
    </div>
  );
}
