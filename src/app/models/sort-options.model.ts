export type SortOrder = 'asc' | 'desc';
export type SortColumn = 'name' | 'date';
export type SortOption = {
  column: SortColumn;
  order: SortOrder;
};
