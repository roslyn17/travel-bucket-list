export type List = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type ListItem = {
  id: string;
  list_id: string;
  name: string;
  code: string | null;
  sort_order: number;
  metadata: Record<string, string>;
};

export type DatePrecision = "day" | "month" | "year";

export type UserProgress = {
  id: string;
  user_id: string;
  list_item_id: string;
  visited: boolean;
  visited_on: string | null;
  visited_precision: DatePrecision | null;
};

export type ItemWithProgress = {
  item: ListItem;
  progress: UserProgress | null;
};
