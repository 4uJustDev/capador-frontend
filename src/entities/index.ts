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

export type IProductPhoto = {
  id: number;
  filename: string;
  filepath: string;
  thumbpath: string;
  is_main: boolean;
  sort_order: number;
  product_id: number;
};

export type ICarpetInfo = {
  id: number;
  material: string;
  origin: string;
  age: number;
  width: number;
  length: number;
};

export type IProduct = {
  id: number;
  name: string;
  sku: string;
  description: string;
  category_id: number;
  amount: number;
  price: number;
  category_name: string;
  category_product_type_sysname: string;
  created_at: string;
  updated_at: string;
  is_leaf: boolean;

  photos: IProductPhoto[] | null;
  extended_info: ICarpetInfo | null;
};
