import { action } from "typesafe-actions";
import * as log from "loglevel";
import { Article, ArticleActionTypes, Section, Category } from "./types";
import { fetchArticle, fetchCategory, fetchSection } from "../../api/faq";

const articleDetailsRequest = (id: number) => action(ArticleActionTypes.ARTILE_DETAILS_REQUEST, id);
const articleDetailsSuccess = (id: number, data: Article) => action(ArticleActionTypes.ARTILE_DETAILS_SUCCESS, { id, data });
const articleDetailsError = (id: number, message: string) => action(ArticleActionTypes.ARTILE_DETAILS_FAILURE, { id, message });

const sectionRequest = (id: number) => action(ArticleActionTypes.SECTION_REQUEST, id);
const sectionSuccess = (id: number, data: Section) => action(ArticleActionTypes.SECTION_SUCCESS, { id, data });
const sectionFailure = (id: number, message: string) => action(ArticleActionTypes.SECTION_FAILURE, { id, message });

const categoryRequest = (id: number) => action(ArticleActionTypes.CATEGORY_REQUEST, id);
const categorySuccess = (id: number, data: Category) => action(ArticleActionTypes.CATEGORY_SUCCESS, { id, data });
const categoryFailure = (id: number, message: string) => action(ArticleActionTypes.CATEGORY_FAILURE, { id, message });

// Encapsulate the flow of articleDetailsRequest -> articleDetailsSuccess / articleDetailsError
export function fetchArticleDetails(id: number) {

    return function (dispatch: (param: any) => any): Promise<Article | string> {
        
        // Update app state to indicate that article details are being fetched
        log.info(`Fetching article-${id}`)
        dispatch(articleDetailsRequest(id))

        return fetchArticle(id).then((response: Article | null) => {
            if (response === null) {
                log.error(`Could not find article-${id}`)
                dispatch(articleDetailsError(id, 'Not found'))
                return null;
            } else {
                log.info(`Found article-${id} titled: "${response.title}"`)
                dispatch(articleDetailsSuccess(id, response))
                return response;
            }
        })
    }
}


export function fetchSectionDetails(id: number) {
    return function (dispatch: (param: any) => any): Promise<Section | string> {

        log.info(`Fetching section-${id}`)
        dispatch(sectionRequest(id))

        return fetchSection(id).then((response: Section | null) => {
            if (response === null) {
                log.error(`Could not find section-${id}`)
                dispatch(sectionFailure(id, 'Not found'))
                return null
            } else {
                log.info(`Found section-${id}`)
                dispatch(sectionSuccess(id, response))
                return response
            }
        })
    }
}

export function fetchCategoryDetails(id: number) {
    return function (dispatch: (param: any) => any): Promise<Category | string> {

        log.info(`Fetching category-${id}`)
        dispatch(categoryRequest(id))

        return fetchCategory(id).then((response: Section | null) => {
            if (response === null) {
                log.error(`Could not find category-${id}`)
                dispatch(categoryFailure(id, 'Not found'))
                return null
            } else {
                log.info(`Found category-${id}`)
                dispatch(categorySuccess(id, response))
                return response
            }
        })
    }
}