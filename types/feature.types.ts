export type FeatureStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PLANNED' | 'COMPLETED';
export type VoteType      = 'UP' | 'DOWN';

export interface FeatureRequestUser {
  id:    string;
  name:  string;
  image: string | null;
}

export interface FeatureRequest {
  id:          string;
  title:       string;
  description: string;
  status:      FeatureStatus;
  adminNote:   string | null;
  createdAt:   string;
  updatedAt:   string;
  createdBy:   FeatureRequestUser;
  _count: {
    upvotes:   number;
    downvotes: number;
  };
  userVote: VoteType | null;
}

export interface FeaturePagination {
  page:       number;
  pageSize:   number;
  totalCount: number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface FeaturesResponse {
  data:       FeatureRequest[];
  pagination: FeaturePagination;
}

export interface CreateFeatureRequestDto {
  title:       string;
  description: string;
}

export interface UpdateFeatureStatusDto {
  status:     FeatureStatus;
  adminNote?: string;
}

export interface FeatureFilters {
  status?:   FeatureStatus | 'ALL';
  page?:     number;
  pageSize?: number;
  search?:   string;
}