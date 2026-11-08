export interface Menu {
  id: number;
  name: string;
  calories: number;
  description: string;
}

export type MenuFormData = Omit<Menu, "id">;

export interface MenuCreateRequest extends MenuFormData {
  id?: number;
}