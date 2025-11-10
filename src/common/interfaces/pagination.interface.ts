/* eslint-disable prettier/prettier */


export interface Pagination<T> {
    currentPage: number;
    totalPage: number;
    limit: number;
    totalItems: number;
    items?: T[] | undefined
}