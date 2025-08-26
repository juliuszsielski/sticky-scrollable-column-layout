import { text } from "@/text";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function Ver4Content() {
  const filtersHeight = 2000;
  const filtersRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollChangeY, setScrollChangeY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [spacerHeight, setSpacerHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? "down" : "up";

      // Sprawdź czy zmienił się kierunek scrollowania
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
        setScrollChangeY(currentScrollY);
        setIsScrollingUp(direction === "up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, scrollDirection]);

  useEffect(() => {
    const currentScrollY = window.scrollY;

    if (!filtersRef.current) return;

    // scrolujemy w dół i ustawiamy wysokość spacera
    if (
      !isScrollingUp &&
      currentScrollY >= filtersHeight - window.innerHeight
    ) {
      const newSpacerHeight =
        currentScrollY - (filtersHeight - window.innerHeight);
      setSpacerHeight(Math.max(0, newSpacerHeight));
    }

    // scrolujemy w górę i ustawiamy wysokość spacera
    if (isScrollingUp) {
      const newSpacerHeight =
        currentScrollY - (filtersHeight - window.innerHeight);
      setSpacerHeight(Math.max(0, newSpacerHeight));
    }
  }, [
    scrollDirection,
    lastScrollY,
    scrollChangeY,
    isScrollingUp,
    filtersHeight,
  ]);

  return (
    <div>
      <div
        style={{
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div>currentScrollY: {window.scrollY}</div>
        <div>lastScrollY: {lastScrollY}</div>
        <div>scrollDirection: {scrollDirection}</div>
        <div>scrollChangeY: {scrollChangeY}</div>
        <div>isScrollingUp: {isScrollingUp.toString()}</div>
        <div>spacerHeight: {spacerHeight}</div>
      </div>
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 40,
          justifyContent: "center",
        }}
      >
        <div>
          {/* <div
            id="spacer"
            style={{
              height: `${spacerHeight}px`,
              width: "100%",
              backgroundColor: "lightcoral",
            }}
          /> */}
          <div
            ref={filtersRef}
            id="filters"
            style={{
              width: 400,
              backgroundColor: "lightblue",
              padding: 20,
              height: filtersHeight,
              overflowY: "hidden",
              transform: `translateY(${spacerHeight}px)`,
            }}
          >
            {text}
            {text}
          </div>
        </div>

        <div style={{ width: 400, backgroundColor: "lightgreen", padding: 20 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Eksportuj komponent z dynamicznym importem, aby uniknąć problemów z SSR
const Ver4 = dynamic(() => Promise.resolve(Ver4Content), {
  ssr: false,
});

export default Ver4;
