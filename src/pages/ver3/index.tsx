import { text } from "@/text";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Komponent StickySweet w React
function StickySweet({
  containerClass,
  children,
}: {
  containerClass: string;
  children: React.ReactNode;
}) {
  const fillRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const atTopRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef<HTMLDivElement>(null);

  const [atTop, setAtTop] = useState(false);
  const [atBottom, setAtBottom] = useState<boolean | null>(null);
  const [dir, setDir] = useState<string | null>(null);
  const [lst, setLst] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<Element | null>(null);

  const onScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.scrollTop > lst) setDir("down");
    else setDir("up");
    setLst(target.scrollTop);
  };

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
      sticky.style.top = "";
      sticky.style.bottom = `${h}px`;
      if (atBottom) {
        fill.style.height = `${Math.max(
          0,
          lst + rContainer.height - rSticky.height
        )}px`;
      }
    } else {
      sticky.style.bottom = "";
      sticky.style.top = `${h}px`;
      if (atTop) {
        fill.style.height = `${lst}px`;
      }
    }
  };

  useEffect(() => {
    if (dir) {
      calc(dir);
    }
  }, [dir, atTop, atBottom, lst]);

  useEffect(() => {
    // Tworzenie IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target.classList.contains("atTop")) {
            setAtTop(e.intersectionRatio >= 1);
          } else if (e.target.classList.contains("atBottom")) {
            setAtBottom(e.intersectionRatio >= 1);
          }
        });
      },
      { threshold: [1] }
    );

    // Znajdowanie kontenera
    if (stickyRef.current) {
      containerRef.current = stickyRef.current.closest(`.${containerClass}`);
      if (containerRef.current) {
        containerRef.current.addEventListener("scroll", onScroll);
      }
    }

    // Obserwowanie elementów
    if (atTopRef.current) {
      observerRef.current.observe(atTopRef.current);
    }
    if (atBottomRef.current) {
      observerRef.current.observe(atBottomRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", onScroll);
      }
    };
  }, [containerClass]);

  return (
    <div className="stickySweet">
      <div className="fill" ref={fillRef} />
      <div className="sticky" ref={stickyRef}>
        <div className="atTop" ref={atTopRef} />
        <div className="atBottom" ref={atBottomRef} />
        {children}
      </div>
    </div>
  );
}

function Ver3Content() {
  return (
    <div className="viewPort">
      <div>
        <StickySweet containerClass="viewPort">
          <div className="demo one">
            {text}
            {text}
          </div>
        </StickySweet>

        <StickySweet containerClass="viewPort">
          <div className="demo five">
            {Array.from({ length: 9 }).map((_, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
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
