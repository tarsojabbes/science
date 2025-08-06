export interface PaginationQueryPaper {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  name?: string;
  journalId?: string;
  issueId?: string;
  publishedAfter?: string;
  publishedBefore?: string;
}

export interface PaginationQueryJournal {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  name?: string;
  issn?: string;
}

export interface PaginationQueryIssue {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  journalId?: string;
  publishedDate?: Date;
  number?: string;
  volume?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
  order?: [string, string][];
}

export interface PaginationResult<T> {
  rows: T[];
  count: number;
}

export interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}

export interface PaperFilters {
  name?: string;
  journalId?: number;
  issueId?: number;
  publishedAfter?: Date;
  publishedBefore?: Date;
}

export interface JournalFilters {
  name?: string;
  issn?: string;
}

export interface IssueFilters {
  number?: number;
  volume?: number;
  publishedDate?: Date;
  journalId?: number;
}