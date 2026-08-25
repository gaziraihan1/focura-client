/**
 * Re-export the canonical guide data from constants so the Help Center and the
 * Guides page render the exact same real feature documentation.
 */
export { GUIDE_SECTIONS } from "@/constants/guides.constants";
export type { GuideArticle as Article, GuideSection } from "@/types/guides.types";
