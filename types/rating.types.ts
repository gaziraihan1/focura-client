export interface RatingUser {
  id: string;
  name: string | null;
  image: string | null;
}

export interface Rating {
  id: string;
  userId: string;
  stars: number;
  comment: string | null;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
  user: RatingUser;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface RatingStats {
  averageStars: number;
  totalRatings: number;
  distribution: RatingDistribution;
}

export interface RatingPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RatingsResponse {
  ratings: Rating[];
  pagination: RatingPagination;
  stats: RatingStats;
}

export interface CreateRatingDto {
  stars: number;
  comment?: string | null;
}

export interface UpdateRatingDto {
  stars?: number;
  comment?: string | null;
}
