
export interface FoodItem {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    description?: string | null;
  };
  isAvailable: boolean;
}

export interface CreateFoodItemRequest {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryId: number;
  isAvailable: boolean;
}

export interface UpdateFoodItemRequest {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryId: number;
  isAvailable: boolean;
}
