import type { ReactNode } from "react";

export default function RichSectionIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="ndx-rich-split-head">
      <div className="ndx-rich-split-head__lead">
        <p className="ndx-tech-meta">{eyebrow}</p>
        <h2 className="ndx-h2 ndx-rich-split-head__title">{title}</h2>
      </div>
      <div className="ndx-rich-split-head__copy">
        <div className="ndx-group-sub ndx-rich-split-head__text">{children}</div>
      </div>
    </div>
  );
}
