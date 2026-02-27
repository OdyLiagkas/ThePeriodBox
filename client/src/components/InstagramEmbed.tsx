import { useEffect, useRef } from "react";

export function InstagramEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram's embed script
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }

      // Additional cleanup: force remove outlines after embed renders
      setTimeout(() => {
        const embeds = document.querySelectorAll('.instagram-media, .instagram-media *');
        embeds.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.outline = 'none';
          htmlEl.style.boxShadow = 'none';
          htmlEl.setAttribute('tabindex', '-1');
        });
      }, 1000);
    };

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center instagram-embed-container"
      style={{ outline: 'none' }}
    >
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
          outline: "none",
        }}
      >
        <div style={{ padding: "16px", outline: "none" }}>
          <a
            id="main_link"
            href="https://www.instagram.com/the_period_box/"
            style={{
              background: "#FFFFFF",
              lineHeight: 0,
              padding: "0 0",
              textAlign: "center",
              textDecoration: "none",
              width: "100%",
              outline: "none",
            }}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
          >
            <div 
              style={{ 
                display: "flex", 
                flexDirection: "row", 
                alignItems: "center",
                outline: "none",
              }}
            >
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: "50%",
                  flexGrow: 0,
                  height: "40px",
                  marginRight: "14px",
                  width: "40px",
                  outline: "none",
                }}
              />
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  flexGrow: 1, 
                  justifyContent: "center",
                  outline: "none",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#F4F4F4",
                    borderRadius: "4px",
                    flexGrow: 0,
                    height: "14px",
                    marginBottom: "6px",
                    width: "100px",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    backgroundColor: "#F4F4F4",
                    borderRadius: "4px",
                    flexGrow: 0,
                    height: "14px",
                    width: "60px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
            <div style={{ padding: "19% 0", outline: "none" }} />
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
              outline: "none",
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
                outline: "none",
              }}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
            >
              @the_period_box
            </a>
          </p>
        </div>
      </blockquote>
    </div>
  );
}
