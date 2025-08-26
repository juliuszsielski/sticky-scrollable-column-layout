import { text } from "@/text";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Uproszczony komponent StickySweet
function StickySweet({
  children,
  dir,
  lst,
  containerRef,
  backgroundColor,
}: {
  children: React.ReactNode;
  dir: "up" | "down";
  lst: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  backgroundColor: string;
}) {
  const fillRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const atTopRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef<HTMLDivElement>(null);

  const [atTop, setAtTop] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  const calc = (direction: string) => {
    const fill = fillRef.current;
    const sticky = stickyRef.current;
    const container = containerRef.current;
    if (!fill || !sticky || !container) return;

    const rSticky = sticky.getBoundingClientRect();
    const rContainer = container.getBoundingClientRect();
    const h = rContainer.height - rSticky.height;

    if (h > 0) {
      sticky.style.top = "0px";
      return;
    }

    if (direction === "up") {
      sticky.style.bottom = `${h}px`;
      if (atBottom) {
        fill.style.height = `${Math.max(
          0,
          lst + rContainer.height - rSticky.height
        )}px`;
      }
    } else {
      sticky.style.top = `${h}px`;
      if (atTop) {
        fill.style.height = `${lst}px`;
      }
    }
  };

  // dodaje style do wypełniacza fill i zmienia style kontenenra sticky
  useEffect(() => {
    calc(dir);
  }, [dir, atTop, atBottom, lst]);

  // określa czy komponent jest na górze lub dole
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target === atTopRef.current) {
            setAtTop(e.intersectionRatio >= 1);
          } else if (e.target === atBottomRef.current) {
            setAtBottom(e.intersectionRatio >= 1);
          }
        });
      },
      { threshold: [1] }
    );

    if (atTopRef.current) observer.observe(atTopRef.current);
    if (atBottomRef.current) observer.observe(atBottomRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div ref={fillRef} />
      <div
        style={{
          position: "sticky",
        }}
        ref={stickyRef}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          ref={atTopRef}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
          ref={atBottomRef}
        />
        <div
          style={{
            padding: 20,
            margin: "auto",
            borderRadius: 10,
            width: 400,
            backgroundColor,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Ver3Content() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);
  const viewPortRef = useRef<HTMLDivElement>(null);

  // określa kierunek scrollowania
  useEffect(() => {
    const viewPort = viewPortRef.current;
    if (!viewPort) return;

    const handleScroll = () => {
      const currentScrollTop = viewPort.scrollTop;
      const direction = currentScrollTop > lastScrollY ? "down" : "up";

      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }

      setLastScrollY(currentScrollTop);
    };

    viewPort.addEventListener("scroll", handleScroll);
    return () => viewPort.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, scrollDirection]);

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        position: "relative",
      }}
      ref={viewPortRef}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <StickySweet
          dir={scrollDirection}
          lst={lastScrollY}
          containerRef={viewPortRef}
          backgroundColor="#2472ab"
        >
          {text}
          {text}
        </StickySweet>

        <StickySweet
          dir={scrollDirection}
          lst={lastScrollY}
          containerRef={viewPortRef}
          backgroundColor="#30a520"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <p key={i}>{text}</p>
          ))}
        </StickySweet>
      </div>
    </div>
  );
}

// Eksportuj komponent z dynamicznym importem, aby uniknąć problemów z SSR
const Ver3 = dynamic(() => Promise.resolve(Ver3Content), {
  ssr: false,
});

export default Ver3;
