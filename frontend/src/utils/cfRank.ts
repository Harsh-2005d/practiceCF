import type { CfRank } from "../types/user";

export function getCfRank(rating?: number | null): CfRank {
  if (rating == null) return { title: "Unrated", color: "#999999" };
  if (rating >= 2900) return { title: "Legendary Grandmaster", color: "#ff0000" };
  if (rating >= 2600) return { title: "International Grandmaster", color: "#ff0000" };
  if (rating >= 2400) return { title: "Grandmaster", color: "#ff0000" };
  if (rating >= 2300) return { title: "International Master", color: "#ff8c00" };
  if (rating >= 2200) return { title: "Master", color: "#ff8c00" };
  if (rating >= 1900) return { title: "Candidate Master", color: "#aa00aa" };
  if (rating >= 1600) return { title: "Expert", color: "#0000ff" };
  if (rating >= 1400) return { title: "Specialist", color: "#03a89e" };
  if (rating >= 1200) return { title: "Pupil", color: "#008000" };
  return { title: "Newbie", color: "#808080" };
}
