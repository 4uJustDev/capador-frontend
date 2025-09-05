import { http } from 'src/shared/api/http';
import type { ICategory } from 'src/entities';

export async function fetchCategoryTree() {
  const { data } = await http.get<ICategory[]>('/categories/tree');
  return data;
}
