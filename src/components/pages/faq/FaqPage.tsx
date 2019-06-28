import * as React from "react";
import * as styles from "./FaqPage.scss";
import { setTitle } from '../../../utils/container'
import ContactUs from "../../../containers/partials/ContactUs";
import { decode } from "../../../utils/extras";
import { basePath } from "../../../config/environment";

export const FaqPage = (props: FaqPageProps) => {

    setTitle(decode(props.heading || props.title))

    return (
        <div className={styles.content}>
            <div className={styles.body} dangerouslySetInnerHTML={createMarkup(props)} />
            <ContactUs />
        </div>
    );
}

function createMarkup(props: FaqPageProps) {
    const body = sanitizeFaqLink(props.body);
    return { __html: `<h3>${props.title}</h3><p>${body}</p>` }
}

function sanitizeFaqLink(str: string): string {
    const doc = document.createElement('body');
    doc.innerHTML = str;

    const links = Array.prototype.slice.call(doc.getElementsByTagName('a'));

    links.filter((link: any) => link.href.indexOf('https://support.redmart.com/hc/en-us/articles/') >= 0)
    .forEach((link: any) => {
        const matches = link.href.match(/(\d+)/);
        if (matches && matches.length > 0) {
            link.href = `${basePath}faq/${matches[0]}`
        }
    })

    const tables = Array.prototype.slice.call(doc.getElementsByTagName('table'));
    tables.forEach(table => {
        table.style = '';
    })

    const images = Array.prototype.slice.call(doc.getElementsByTagName('img'));
    images.forEach(image => {
        image.style.maxWidth = '100%';
        image.style.width = 'auto';
        image.style.height = 'auto';
    });

    return doc.outerHTML;
}

export interface FaqPageProps {
    heading?: string
    title: string,
    body: string
}

