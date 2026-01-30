export interface ReviewInput {
    mealId: string;
    rating: number ;
    comment?: string;
}

//rating should be between 1 to 5
const isValidRating = (rating: number): boolean => {
    return rating >= 1 && rating <= 5;
}

export const ReviewValidator = {
    isValidRating
}