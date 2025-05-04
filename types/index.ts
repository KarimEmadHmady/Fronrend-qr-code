
export interface Review {
  _id: string;
  name: string;
  comment: string;
  rating: number;
}

export interface Meal {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string | null;
  reviews: Review[];
}