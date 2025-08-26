import { text } from "@/text";
import { useEffect, useRef, useState } from "react";

export default function Ver1() {
  const [scrollTop, setScrollTop] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Stałe wysokości
  const leftContentHeight = 2000; // wys. lewej kolumny
  const rightContentHeight = 4600; // wys. prawej kolumny

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      // Throttle z requestAnimationFrame
      if (rafId.current) {
        return;
      }

      rafId.current = requestAnimationFrame(() => {
        const currentScrollTop = containerRef.current!.scrollTop;
        const containerHeight = containerRef.current!.clientHeight;

        setScrollTop(currentScrollTop);

        // policz przesunięcie lewej kolumny
        const diff = currentScrollTop - leftContentHeight + containerHeight;

        // tylko dodatnie wartości (czyli gdy dół kolumny minął dół viewportu)
        let newTranslateY = diff > 0 ? diff : 0;

        // ogranicz maksymalne przesunięcie
        const maxTranslateY = rightContentHeight - leftContentHeight;
        newTranslateY = Math.min(newTranslateY, maxTranslateY);

        setTranslateY(newTranslateY);

        rafId.current = null;
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflow: "auto",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          columnGap: "40px",
          width: "1200px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Lewa kolumna */}
        <div
          style={{
            position: "relative",
            top: 0,
            width: "400px",
            height: leftContentHeight,
            transform: `translateY(${translateY}px)`,
            willChange: "transform",
            backgroundColor: "lightgray",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {text}
        </div>

        {/* Prawa kolumna */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "lightblue",
            padding: "20px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
