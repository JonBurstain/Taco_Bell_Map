export const MIN_REVIEWS_FOR_RANKING = 100;
export const PAGE_DELAY_MS = 2000;
export const MAX_PAGES = 3;
export const TACO_BELL_PURPLE = '#702082';
export const TACO_BELL_LIVE_MAS = '#EB6014';
export const WORKER_URL = 'https://homebell-proxy.jonburstain.workers.dev';

// Search radii for adaptive search
export const RADIUS_TIGHT = 8000;  // 8km — used first for dense cities
export const RADIUS_WIDE  = 30000; // 30km — fallback for suburban/rural areas
export const EXPAND_THRESHOLD = 20; // expand if fewer results than this
