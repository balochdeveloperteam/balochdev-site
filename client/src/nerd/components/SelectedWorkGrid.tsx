import { Link } from "react-router-dom";
import { selectedWorkTeasers, type SelectedWorkTeaser } from "../data/selectedWorkTeasers";

type Props = {
  items?: SelectedWorkTeaser[];
  /** Card media height */
  mediaHeight?: string;
  className?: string;
};

export default function SelectedWorkGrid({
  items = selectedWorkTeasers,
  mediaHeight = "11rem",
  className = "ndx-card-grid ndx-card-grid--cols-3",
}: Props) {
  return (
    <div className={className} style={{ marginTop: "1.5rem" }}>
      {items.map((item, index) => (
        <Link
          key={item.slug}
          to={`/projects/${item.slug}/`}
          className="ndx-card ndx-card-link"
          style={{ overflow: "hidden", padding: 0, display: "block", textDecoration: "none" }}
        >
          <div
            style={{
              position: "relative",
              height: mediaHeight,
              background: "var(--ndx-bg-elev)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.65rem",
            }}
          >
            {item.cover ? (
              <img
                src={item.cover}
                alt={`${item.title} — ${item.tag}`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : null}
            <span
              className="ndx-pill"
              style={{
                position: "absolute",
                left: "0.85rem",
                top: "0.85rem",
                color: "var(--ndx-accent)",
                background: "color-mix(in srgb, var(--ndx-bg) 88%, transparent)",
                backdropFilter: "blur(6px)",
              }}
            >
              {item.tag}
            </span>
            {item.underDevelopment ? (
              <span
                className="ndx-pill"
                style={{
                  position: "absolute",
                  right: "0.85rem",
                  top: "0.85rem",
                  color: "#d97706",
                  borderColor: "rgba(245,158,11,0.4)",
                  background: "rgba(245,158,11,0.12)",
                  fontSize: "0.65rem",
                }}
              >
                Under development
              </span>
            ) : (
              <span
                style={{
                  position: "absolute",
                  right: "0.85rem",
                  bottom: "0.75rem",
                  fontFamily: "var(--ndx-font-serif)",
                  fontSize: "2rem",
                  fontStyle: "italic",
                  opacity: 0.35,
                  color: "var(--ndx-text)",
                  lineHeight: 1,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>
          <div style={{ padding: "1.35rem" }}>
            <h3 style={{ margin: 0 }}>{item.title}</h3>
            <p className="ndx-tech-blurb" style={{ marginTop: "0.35rem", marginBottom: 0 }}>
              {item.desc}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "0.75rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--ndx-accent)",
              }}
            >
              View case study →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
