import projects from "./projects";

export type SelectedWorkTeaser = {
  slug: string;
  tag: string;
  title: string;
  desc: string;
  cover: string | null;
  underDevelopment?: boolean;
};

function shortDesc(tagline: string, max = 110) {
  const t = tagline.trim();
  return t.length > max ? `${t.slice(0, max).trim()}…` : t;
}

/** Real portfolio teasers — shared by Services, Technologies, Apps, and service detail pages */
export const selectedWorkTeasers: SelectedWorkTeaser[] = projects
  .filter((p): p is typeof p & { slug: string } => Boolean(p.slug))
  .map((p) => ({
    slug: p.slug,
    tag: (p.industry.split("·")[0] || p.industry).trim(),
    title: p.title,
    desc: shortDesc(p.tagline),
    cover: p.cover,
    underDevelopment: p.underDevelopment,
  }));
