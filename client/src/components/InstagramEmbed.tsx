import { useEffect, useRef } from "react";

export function InstagramEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram's embed script
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Re-process embeds when script loads
    script.onload = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink="https://www.instagram.com/the_period_box/"
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: "0",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          margin: "0 auto",
          maxWidth: "540px",
          minWidth: "326px",
          padding: "0",
          width: "calc(100% - 40px)",
        }}
      >
        <div style={{ padding: "16px" }}>
          <a
            href="https://www.instagram.com/the_period_box/"
            style={{
              background: "#FFFFFF",
              lineHeight: 0,
              padding: "0 0",
              textAlign: "center",
              textDecoration: "none",
              width: "100%",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: "50%",
                  flexGrow: 0,
                  height: "40px",
                  marginRight: "14px",
                  width: "40px",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                <div
                  style={{
                    backgroundColor: "#F4F4F4",
                    borderRadius: "4px",
                    flexGrow: 0,
                    height: "14px",
                    marginBottom: "6px",
                    width: "100px",
                  }}
                />
                <div
                  style={{
                    backgroundColor: "#F4F4F4",
                    borderRadius: "4px",
                    flexGrow: 0,
                    height: "14px",
                    width: "60px",
                  }}
                />
              </div>
            </div>
            <div style={{ padding: "19% 0" }} />
          </a>
          <p
            style={{
              color: "#c9c8cd",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              lineHeight: "17px",
              marginBottom: 0,
              marginTop: "8px",
              overflow: "hidden",
              padding: "8px 0 7px",
              textAlign: "center",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <a
              href="https://www.instagram.com/the_period_box/"
              style={{
                color: "#c9c8cd",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "normal",
                lineHeight: "17px",
                textDecoration: "none",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              @the_period_box
            </a>
          </p>
        </div>
      </blockquote>
    </div>
  );
}