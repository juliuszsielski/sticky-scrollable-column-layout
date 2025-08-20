import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useRef, useState } from "react";

const text = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra, nibh ut fermentum fringilla, lacus sem iaculis tellus, at ultrices purus sapien vitae ante. In id ante tortor. Suspendisse nec est id leo fringilla mollis quis ut leo. Duis lorem justo, vehicula fermentum aliquet ac, accumsan vitae lacus. Sed pellentesque at ipsum et volutpat. Suspendisse diam sapien, vehicula vel sapien vitae, imperdiet fringilla mi. Donec sit amet varius sem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam sit amet viverra enim, at dapibus ex. Cras nibh augue, interdum ac erat eget, laoreet placerat elit. Pellentesque aliquet pretium justo, non semper tortor tristique at. Ut ullamcorper odio et massa faucibus dictum. Quisque sit amet dignissim dolor. Morbi posuere lorem eu eros rutrum, lacinia bibendum ex egestas. Ut nec finibus tortor. Proin dui orci, egestas gravida ligula quis, tincidunt fringilla dolor. Integer pulvinar at enim in sodales. Curabitur sodales, mi interdum luctus venenatis, risus ante lobortis orci, ullamcorper fringilla quam enim et neque. Aenean eget nibh arcu. In viverra, libero eu consequat vulputate, felis purus consequat turpis, quis maximus neque est at velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec eu eros malesuada, volutpat sem eu, lacinia libero. Nulla vel justo ante. Duis accumsan viverra dapibus. Quisque vitae magna sit amet diam laoreet condimentum. Curabitur facilisis justo dolor, at dignissim felis ullamcorper at. Ut aliquet faucibus vulputate. Curabitur accumsan varius nisi non vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur maximus eget mauris et feugiat. Sed sit amet dignissim ante. Sed tempus blandit elementum. Sed quam quam, dapibus nec bibendum sit amet, aliquam sagittis sem. Curabitur id mi bibendum diam tempor tempus vel vel sem. Etiam rutrum, tortor in scelerisque tempus, nunc neque hendrerit dui, non ultricies dui ante ac justo. Donec ut mauris ut odio venenatis porta ut nec turpis. Quisque eget interdum sapien, eu feugiat arcu. Mauris pretium semper tincidunt. Suspendisse mi dolor, condimentum id gravida et, volutpat a ligula. Nulla pharetra commodo lacus, iaculis ultrices nisi aliquam quis. Nulla dictum nisi eu lectus elementum luctus. Aliquam sit amet rutrum leo. In eleifend, metus sit amet lobortis cursus, quam diam egestas leo, vel placerat urna elit in turpis. Proin nisl lectus, sodales quis lorem non, rutrum efficitur dui. Nunc venenatis, augue et ullamcorper suscipit, justo lacus mollis metus, semper commodo dui arcu nec erat. Donec non malesuada odio. Pellentesque tempus, ex quis hendrerit sollicitudin, libero odio pretium nulla, sed ultrices ex est ac arcu. Vivamus semper ipsum lorem, et viverra sem sollicitudin ullamcorper. Pellentesque pretium convallis augue, non ultrices neque volutpat in. Nam in mauris placerat, blandit sapien at, egestas lacus. Curabitur ipsum urna, pellentesque vel lobortis id, sollicitudin vel massa. Sed varius lobortis felis, vitae mollis nibh molestie eget. Nullam malesuada ultrices orci nec commodo. Phasellus egestas elit eget elit lobortis dapibus. `;

export default function App({ Component, pageProps }: AppProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Stałe wysokości
  const leftContentHeight = 2000; // wys. lewej kolumny
  const rightContentHeight = 4600; // wys. prawej kolumny

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const currentScrollTop = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;

      setScrollTop(currentScrollTop);

      // policz przesunięcie lewej kolumny
      const diff = currentScrollTop - leftContentHeight + containerHeight;

      // tylko dodatnie wartości (czyli gdy dół kolumny minął dół viewportu)
      const newTranslateY = diff > 0 ? diff : 0;

      setTranslateY(newTranslateY);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
            height: rightContentHeight,
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
