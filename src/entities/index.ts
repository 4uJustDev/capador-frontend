export type ICategory = {
  id: number;
  name: string;
  sysname: string;
  created_at: string;
  updated_at: string;
  is_leaf: boolean;

  product_type_id: number | null;
  parent_id: number | null;
  children: ICategory[] | null;
};
