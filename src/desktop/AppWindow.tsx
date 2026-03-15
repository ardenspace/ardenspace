import { type ReactNode, useState, useRef, useCallback } from "react";
import { useStore } from "../stores/useStore";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { RxSize } from "react-icons/rx";
import { useIsMobile } from "../hooks/useIsMobile";

interface AppWindowProps {
  appId: string;
  title: string;
  children: ReactNode;
}

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;

const MIN_W = 400;
const MIN_H = 300;

function getDockTop() {
  const dock = document.querySelector("[data-dock]") as HTMLElement | null;
  return dock?.getBoundingClientRect().top ?? window.innerHeight - 80;
}

function getDockInset() {
  return window.innerHeight - getDockTop();
}

export default function AppWindow({ appId, title, children }: AppWindowProps) {
  const closeApp = useStore((s) => s.closeApp);
  const minimizeApp = useStore((s) => s.minimizeApp);
  const isMinimizedInStore = useStore((s) => s.minimizedApps.includes(appId));
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(() => {
    // Seeded random per appId for consistent but scattered positions
    let hash = 0;
    for (let i = 0; i < appId.length; i++) {
      hash = ((hash << 5) - hash + appId.charCodeAt(i)) | 0;
    }
    const rand = (seed: number) => (Math.abs(seed) % 1000) / 1000;
    const x = (rand(hash) - 0.5) * 800;
    const y = (rand(hash * 7 + 13) - 0.5) * 200;
    return { x, y };
  });
  const [size, setSize] = useState<{ w: number; h: number } | null>({
    w: 550,
    h: 450,
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      dragging.current = true;
      setIsInteracting(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        const newX = e.clientX - dragStart.current.x;
        let newY = e.clientY - dragStart.current.y;
        // 창 상단이 메뉴바 아래에 머물도록 제한
        const curH = size?.h ?? 450;
        const containerPadTop = 40;
        const dockTop = getDockTop();
        const containerPadBot = window.innerHeight - dockTop;
        const availH = window.innerHeight - containerPadTop - containerPadBot;
        const centerY = containerPadTop + availH / 2;
        const windowTop = centerY + newY - curH / 2;
        if (windowTop < 40) {
          newY += 40 - windowTop;
        }
        const windowBottom = centerY + newY + curH / 2;
        if (windowBottom > dockTop) {
          newY -= windowBottom - dockTop;
        }
        setPosition({ x: newX, y: newY });
      };

      const onMouseUp = () => {
        dragging.current = false;
        setIsInteracting(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [position, size, isMaximized],
  );

  const onResizeStart = useCallback(
    (e: React.MouseEvent, dir: ResizeDir) => {
      if (isMaximized || !dir) return;
      e.preventDefault();
      e.stopPropagation();
      setIsInteracting(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startPos = { ...position };
      const windowEl = (e.target as HTMLElement).closest(
        "[data-window]",
      ) as HTMLElement | null;
      const startW = size?.w ?? (windowEl?.offsetWidth || 600);
      const startH = size?.h ?? (windowEl?.offsetHeight || 500);
      const containerPadTop = 40;
      const dockTop = getDockTop();
      const containerPadBot = window.innerHeight - dockTop;
      const menuBarBottom = 40;
      const centerX = window.innerWidth / 2;
      const availH = window.innerHeight - containerPadTop - containerPadBot;
      const centerY = containerPadTop + availH / 2;
      const minLeft = 0;
      const maxRight = window.innerWidth;
      const maxBottom = dockTop;
      const startLeft = centerX + startPos.x - startW / 2;
      const startRight = centerX + startPos.x + startW / 2;
      const startTop = centerY + startPos.y - startH / 2;
      const startBottom = centerY + startPos.y + startH / 2;

      const onMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newLeft = startLeft;
        let newRight = startRight;
        let newTop = startTop;
        let newBottom = startBottom;

        if (dir.includes("e")) {
          newRight = Math.min(
            maxRight,
            Math.max(startLeft + MIN_W, startRight + dx),
          );
        }

        if (dir.includes("w")) {
          newLeft = Math.max(
            minLeft,
            Math.min(startRight - MIN_W, startLeft + dx),
          );
        }

        if (dir.includes("s")) {
          newBottom = Math.min(
            maxBottom,
            Math.max(startTop + MIN_H, startBottom + dy),
          );
        }

        if (dir.includes("n")) {
          newTop = Math.max(
            menuBarBottom,
            Math.min(startBottom - MIN_H, startTop + dy),
          );
        }

        const newW = newRight - newLeft;
        const newH = newBottom - newTop;
        const newX = (newLeft + newRight) / 2 - centerX;
        const newY = (newTop + newBottom) / 2 - centerY;

        setSize({ w: newW, h: newH });
        setPosition({ x: newX, y: newY });
      };

      const onMouseUp = () => {
        setIsInteracting(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [position, size, isMaximized],
  );

  const cursorMap: Record<string, string> = {
    n: "cursor-ns-resize",
    s: "cursor-ns-resize",
    e: "cursor-ew-resize",
    w: "cursor-ew-resize",
    ne: "cursor-nesw-resize",
    sw: "cursor-nesw-resize",
    nw: "cursor-nwse-resize",
    se: "cursor-nwse-resize",
  };

  const edges: { dir: ResizeDir; className: string }[] = [
    {
      dir: "n",
      className: `absolute -top-1 left-2 right-2 h-2 ${cursorMap.n}`,
    },
    {
      dir: "s",
      className: `absolute -bottom-1 left-2 right-2 h-2 ${cursorMap.s}`,
    },
    {
      dir: "e",
      className: `absolute top-2 -right-1 bottom-2 w-2 ${cursorMap.e}`,
    },
    {
      dir: "w",
      className: `absolute top-2 -left-1 bottom-2 w-2 ${cursorMap.w}`,
    },
    { dir: "nw", className: `absolute -top-1 -left-1 w-3 h-3 ${cursorMap.nw}` },
    {
      dir: "ne",
      className: `absolute -top-1 -right-1 w-3 h-3 ${cursorMap.ne}`,
    },
    {
      dir: "sw",
      className: `absolute -bottom-1 -left-1 w-3 h-3 ${cursorMap.sw}`,
    },
    {
      dir: "se",
      className: `absolute -bottom-1 -right-1 w-3 h-3 ${cursorMap.se}`,
    },
  ];

  return (
    <div
      className={`absolute z-30 ${isMobile ? "inset-0 top-9" : isMaximized ? "inset-0 pt-8 p-0" : "inset-0 flex items-center justify-center pt-10"}`}
      style={{
        ...(!isMobile && !isMaximized
          ? {
              pointerEvents: "none" as const,
              paddingBottom: getDockInset(),
            }
          : {}),
        ...(isMinimizedInStore ? { pointerEvents: "none" as const } : {}),
      }}
    >
      <div
        data-window
        className={`glass-frosted flex flex-col overflow-hidden relative ${isInteracting ? "" : "transition-all duration-300 ease-in-out"} ${isMobile ? "w-full h-full !rounded-none" : isMaximized ? "w-full h-full !rounded-none" : ""}`}
        style={{
          ...(isMobile
            ? {
                ...(isMinimizedInStore
                  ? { transform: "translateY(100vh) scale(0.5)", opacity: 0 }
                  : {}),
              }
            : !isMaximized
              ? {
                  transform: isMinimizedInStore
                    ? `translate(${position.x}px, 100vh) scale(0.5)`
                    : `translate(${position.x}px, ${position.y}px)`,
                  pointerEvents: isMinimizedInStore ? "none" : "auto",
                  opacity: isMinimizedInStore ? 0 : 1,
                  ...(size
                    ? { width: size.w, height: size.h }
                    : { width: "100%", maxWidth: "42rem", height: "100%" }),
                }
              : {
                  ...(isMinimizedInStore
                    ? { transform: "translateY(100vh) scale(0.5)", opacity: 0 }
                    : {}),
                }),
        }}
      >
        {/* Resize handles */}
        {!isMobile &&
          !isMaximized &&
          edges.map(({ dir, className }) => (
            <div
              key={dir}
              className={className}
              onMouseDown={(e) => onResizeStart(e, dir)}
              style={{ zIndex: 50 }}
            />
          ))}

        {/* Title bar - draggable */}
        <div
          className={`flex items-center gap-2 px-4 py-3 border-b border-white/10 select-none ${isMobile ? "" : "cursor-grab active:cursor-grabbing"}`}
          onMouseDown={isMobile ? undefined : onDragStart}
        >
          {/* Traffic lights with hover icons */}
          <div className="flex items-center gap-2.5 group/traffic">
            <button
              onClick={() => closeApp(appId)}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-colors cursor-pointer flex items-center justify-center"
            >
              <GoPlus
                className="hidden group-hover/traffic:block text-black rotate-45"
                size={12}
              />
            </button>
            {!isMobile && (
              <button
                onClick={() => minimizeApp(appId)}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-colors cursor-pointer flex items-center justify-center"
              >
                <FiMinus
                  className="hidden group-hover/traffic:block text-black"
                  size={10}
                />
              </button>
            )}
            {!isMobile && (
              <button
                onClick={() => {
                  setIsMaximized(!isMaximized);
                  setPosition({ x: 0, y: 0 });
                  setSize(null);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-colors cursor-pointer flex items-center justify-center"
              >
                <RxSize
                  className="hidden group-hover/traffic:block text-black"
                  size={8}
                />
              </button>
            )}
          </div>
          <span className="ml-2 text-white/60 text-xs">{title}</span>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 mdx-content">{children}</div>
      </div>
    </div>
  );
}
