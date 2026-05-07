export interface Bird {
  uid: string;
  name: { spanish: string; english: string; latin: string; };
  images: { main: string; full: string; thumb: string; };
  _links: { self: string; parent: string; };
  sort: number;
}

export interface BirdDetail {
  uid: string;
  name: { spanish: string; english: string; latin: string; };
  images: { main: string; full?: string; thumb?: string; gallery?: { url: string }[]; };
  map?: { image: string; title: string; };
  iucn?: { category?: string; label?: string; };
  habitat?: string;
  didyouknow?: string;
  migration?: boolean;
  dimorphism?: boolean;
  size?: string;
  order?: string;
  species?: string;
  audio?: { author: string; file: string; };
  _links: { self: string; parent: string; };
  sort: number;
}

export interface XCRecording {
  id: string; gen: string; sp: string; en: string;
  rec: string; cnt: string; loc: string; lat: string; lon: string;
  type: string; sex: string; stage: string;
  url: string; file: string; "file-name": string;
  sono: { small: string; med: string; large: string; full: string; };
  lic: string; q: string; length: string; time: string; date: string; rmk: string;
}

export interface XCResponse {
  numRecordings: string; numSpecies: string;
  page: number; numPages: number;
  recordings: XCRecording[];
  _fallback?: boolean;
}

export type SortOption  = "default" | "az" | "za" | "latin";
export type FilterGroup = "all" | "favorites" | "seen" | "unseen";
