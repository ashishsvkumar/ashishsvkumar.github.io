export interface Article {
    id?: number,
    title?: string,
    body?: string,
    promoted?: boolean,
    loading?: boolean,
    errors?: string
}

export interface Section {
    id?: number,
    name?: string,
    articles?: Article[],
    loading?: boolean,
    errors?: string
}

export interface Category {
    id?: number,
    sections?: Section[],
    loading?: boolean,
    errors?: string
}

export const enum ArticleActionTypes {
    ARTILE_DETAILS_REQUEST = "article/details/request",
    ARTILE_DETAILS_SUCCESS = "article/details/success",
    ARTILE_DETAILS_FAILURE = "article/details/failure",

    CATEGORY_REQUEST = "category/request",
    CATEGORY_SUCCESS = "category/success",
    CATEGORY_FAILURE = "category/failure",

    SECTION_REQUEST = "section/request",
    SECTION_SUCCESS = "section/success",
    SECTION_FAILURE = "section/failure"
}

export interface ArticlesState {
    [articleId: number]: Article
}

export interface SectionsState {
    [sectionId: number]: Section
}

export interface CategoriesState {
    [cateogryId: number]: Category
}