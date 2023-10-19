export interface Content {
  id: string;
  url: string;
  category: string;
  slot: string;
  slideOrder: number;
}

export interface UpdateContent {
  id: string;
  category: string;
  slot: string;
  slideOrder: number;
}
