export interface MealInput {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    isAvailable: boolean;
}