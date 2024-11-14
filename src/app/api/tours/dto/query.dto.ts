export interface UserToursQueryDto {
    rowsPerPage: string;
    page: string;
    searchText?: string;
    sortBy: string;
    direction: string;
}