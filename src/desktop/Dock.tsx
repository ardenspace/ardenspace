import { useState, type ReactNode } from "react";
import { useStore } from "../stores/useStore";
import { FaFaceSmileWink } from "react-icons/fa6";
import { FaKeyboard, FaAddressBook } from "react-icons/fa";
import {
  MdOutlineWorkHistory,
  MdOutlineContactEmergency,
} from "react-icons/md";
import { IoRocket } from "react-icons/io5";
import { ImMusic } from "react-icons/im";

const dockItems: {
  id: string;
  icon: ReactNode;
  label: string;
  type: "app" | "link";
  url?: string;
}[] = [
  {
    id: "aboutme",
    icon: <FaFaceSmileWink size={26} />,
    label: "About Me",
    type: "app",
  },
  {
    id: "experience",
    icon: <MdOutlineWorkHistory size={27} />,
    label: "Experience",
    type: "app",
  },
  {
    id: "projects",
    icon: <IoRocket size={27} />,
    label: "Projects",
    type: "app",
  },
  {
    id: "blog",
    icon: <FaKeyboard size={27} />,
    label: "Blog",
    type: "app",
  },
  {
    id: "contact",
    icon: <MdOutlineContactEmergency size={27} />,
    label: "Contact",
    type: "app",
  },
  {
    id: "guest-book",
    icon: <FaAddressBook size={26} />,
    label: "Guest Book",
    type: "app",
  },
  {
    id: "music",
    icon: <ImMusic size={26} />,
    label: "Music",
    type: "link",
    url: "https://spotify.com",
  },
];

export default function Dock() {
  const openApp = useStore((s) => s.openApp);
  const focusApp = useStore((s) => s.focusApp);
  const restoreApp = useStore((s) => s.restoreApp);
  const openApps = useStore((s) => s.openApps);
  const minimizedApps = useStore((s) => s.minimizedApps);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-frosted flex items-center justify-center py-3 px-3">
        <div className="flex items-center gap-4 px-2">
          {dockItems.map((item) => {
            const isOpen = openApps.includes(item.id);
            return (
              <div key={item.id} className="relative flex flex-col items-center">
                {/* Tooltip */}
                {hoveredId === item.id && (
                  <div className="absolute -top-13 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="glass-frosted px-4 py-1 text-xs font-semibold text-white/90 rounded-lg">
                      {item.label}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (item.type === "link") {
                      window.open(item.url, "_blank");
                    } else if (isOpen && minimizedApps.includes(item.id)) {
                      restoreApp(item.id);
                    } else if (isOpen) {
                      focusApp(item.id);
                    } else {
                      openApp(item.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="glass-button rounded-xl w-12 h-12 flex items-center justify-center text-white/80 cursor-pointer"
                >
                  {item.icon}
                </button>
                {/* Open indicator dot */}
                {isOpen && (
                  <div className="w-1 h-1 rounded-full bg-white/80 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
