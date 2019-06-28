import fetch from 'cross-fetch';
import { Article, Category, Section } from '../store/faq/types';

export function fetchArticle(id: number): Promise<Article> {
    const ARTICLE_DETAIL = `https://myredmart.zendesk.com/api/v2/help_center/en-us/articles/${id}.json`;
    return fetch(ARTICLE_DETAIL)
        .then((response: any) => {

            if (response.status === 200) {
                return response.json().then((json: any) => {
                    return { title: json.article.title, body: json.article.body, id: id };
                })
            }

            return null;

        }).catch(err => null)
}

export function fetchCategory(categoryId: number): Promise<Category> {
    const SECTIONS_LIST = `https://myredmart.zendesk.com/api/v2/help_center/en-us/categories/${categoryId}/sections.json`;
    return fetch(SECTIONS_LIST).then((response: any) => {

        if (response.status === 200) {
            return response.json().then((json: any) => {
                return { 
                    id: categoryId, 
                    sections: json.sections.map( (summary: any) => { return { id: summary.id, name: summary.name }; } ) 
                }
            })
        }
        
        return null;

    }).catch(err => null)
}

export function fetchSection(sectionId: number): Promise<Section> {
    const ARTICLE_LIST = `https://myredmart.zendesk.com/api/v2/help_center/en-us/sections/${sectionId}/articles.json`;
    return fetch(ARTICLE_LIST).then((response: any) => {

        if (response.status === 200) {
            return response.json().then((json: any) => {
                return {
                    id: sectionId,
                    articles: json.articles.map( (summary: any) => { return { id: summary.id, title: summary.title }; } )
                }
            })
        }
        
        return null;

    }).catch(err => null)
}