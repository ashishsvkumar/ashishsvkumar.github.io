import * as React from "react";
import * as styles from "./CategoryPage.scss";
import { setTitle } from '../../../utils/container'
import ContactUs from "../../../containers/partials/ContactUs";
import { Section, Article } from "../../../store/faq/types";
import cx from 'classnames';
import { decode, encodeSpace } from "../../../utils/extras";
import { NavigationCard, Theme } from "../../card/NavigationCard";
import { ContentTitle } from "../../labels/ContentTitle";

export const CategoryPage = (props: CategoryPageProps) => {

    setTitle(decode(props.title))

    return (
        <div className={styles.content}>
            <div className={styles.sections}>{props.sections.map(section => prepareSection(section, props.id, props.title))}</div>
            <ContactUs />
        </div>
    );
}

function prepareSection(section: Section, categoryId: number, categoryHeading: string) {
    return (
        <div className={styles.section} key={`section-${section.id}`}>
            <div className={styles.section_title}><ContentTitle text={section.name} /></div>
            <div className={cx([styles.cards, styles.only_mobile])}>{ section.articles.map(article => articleLinkMobile(article, categoryId, categoryHeading)) }</div>
            <div className={cx([styles.cards, styles.only_desktop])}>{ section.articles.map(article => articleLinkDesktop(article, categoryId, categoryHeading)) }</div>
        </div>
    )
}

function articleLinkMobile(article: Article, categoryId: number, categoryHeading: string) {
    return (
        <NavigationCard text={article.title} to={`/category/${categoryId}/${categoryHeading}/faq/${article.id}/${encodeSpace(article.title)}`} theme={Theme.STRIP} key={`mobile-article-link-${article.id}`}/>
    )
}

function articleLinkDesktop(article: Article, categoryId: number, categoryHeading: string) {
    return (
        <div className={styles.alt_card} key={`desktop-article-link-${article.id}`}><NavigationCard text={article.title} to={`/category/${categoryId}/${categoryHeading}/faq/${article.id}/${encodeSpace(article.title)}`} theme={Theme.CARD}/></div>
    )
}

export interface CategoryPageProps {
    id: number,
    title: string,
    sections: Section[]
}
