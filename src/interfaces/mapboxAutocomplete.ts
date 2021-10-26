export default interface MapboxAutocomplete {
  type?: string;
  query: string[];
  features: Feature[];
  attribution?: string;
}

interface Feature {
  id: string;
  type?: string;
  place_type?: string[];
  relevance?: number;
  properties?: Properties;
  text_en?: string;
  language_en?: string;
  place_name_en?: string;
  text?: string;
  language?: string;
  place_name: string;
  bbox?: number[];
  center: number[];
  geometry?: Geometry;
  context?: Context[];
}

interface Context {
  id?: string;
  wikidata?: string;
  short_code?: string;
  text_en?: string;
  language_en?: string;
  text?: string;
  language?: string;
}

interface Geometry {
  type?: string;
  coordinates?: number[];
}

interface Properties {
  wikidata?: string;
  short_code?: string;
}
