/**
 * Set config setup changes in both config.services.ts and config.d.ts
 * */

export type Config = {
  id: string;
  siteName: string;
  description: string;
  footerText: string;
  player: string;
  recommendationsPlaylist?: string;
  searchPlaylist?: string;
  analyticsToken?: string;
  adSchedule?: string;
  assets: { banner?: string };
  content: Content[];
  menu: Menu[];
  options: Options;
  genres?: string[];
  json?: Record<string, unknown>;
};

export type Simple = {
  id: string;
};

export type Content = {
  playlistId: string;
  featured?: boolean;
};

export type Menu = {
  label: string;
  playlistId: string;
};

export type Options = {
  backgroundColor?: string;
  highlightColor?: string;
  enableContinueWatching?: boolean;
  headerBackground?: string;
  enableCasting?: boolean;
  enableSharing?: boolean;
  dynamicBlur?: boolean;
  posterFading?: boolean;
  shelveTitles?: boolean;
};