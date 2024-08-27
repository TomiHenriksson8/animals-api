export type WikiImage = {
  batchcomplete: boolean;
  query: Query;
};

type Query = {
  normalized: Normalized[];
  pages: Page[];
};

type Normalized = {
  fromencoded: boolean;
  from: string;
  to: string;
};

type Page = {
  pageId: number;
  ns: number;
  title: string;
  thumbnail: Thumbnail;
  pageImage: string;
};

type Thumbnail = {
  source: string;
  width: number;
  height: number;
};
