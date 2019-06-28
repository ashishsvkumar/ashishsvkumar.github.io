import * as React from "react";
import * as log from "loglevel";
import { connect } from "react-redux";
import { FaqPage as Component } from "../../components/pages/faq/FaqPage"
import { fetchArticleDetails } from "../../store/faq/actions";
import { setBreadcrumbs } from "../../store/breadcrumb/actions";
import { ApplicationState } from "../../store";
import { ArticlesState, Article } from "../../store/faq/types";
import { Spinner } from "../../components/icons/Spinner";
import { isEmptyObject, decode } from "../../utils/extras";
import { BreadcrumbEntry } from "../../store/breadcrumb/types";
import { trackEvent, trackPageView } from "../../utils/tracker";
import {get} from 'lodash';

export class FaqPage extends React.Component<FaqPageProps, FaqPageState> {

    constructor(props: FaqPageProps) {
        super(props);
    }

    componentWillMount() {
        log.info('FAQ page countainer will mount❓');

        const { tradeOrderId, categoryId, categoryHeading, heading } = this.props.match.params;
        const crumbs = [{ text: decode(heading || 'FAQ'), url: location.href, needLogin: false }];

        if (tradeOrderId) {
            crumbs.unshift({ text: 'Order Help', url: `/orders/${tradeOrderId}`, needLogin: true });
            crumbs.unshift({ text: 'My RedMart Orders', url: '/orders', needLogin: true },);
        } else if (categoryId && categoryHeading) {
            crumbs.unshift({ text: decode(categoryHeading), url: `/category/${categoryId}/${categoryHeading}`, needLogin: false });
        }

        this.props.setBreadcrumbs(crumbs);

        if (this.props.match.params.id && !this.getArticle()) {
            this.props.fetchArticleDetails(this.props.match.params.id);
        }

        trackPageView(`FAQ Page`);
    }

    getArticle = (): Article => {
        const article = this.props.articles ? this.props.articles[this.props.match.params.id] : null
        return isEmptyObject(article) || isEmptyObject(article) || article.loading ? null : article;
    }

    render() {
        if (!this.props.match.params || !this.props.match.params.id) {
            return <div>Sorry, the page you are looking for does not exist</div>
        }

        const article = this.getArticle();
        const heading = this.props.match.params.heading;

        if (article) {
            trackEvent('FAQ', 'View', 'knowledge', decode(article.title));

            return <Component heading={heading} title={article.title} body={article.body} />
        } else {
            return <Spinner />;
        }
    }
}

interface FaqPageState {

}

interface PropsFromDispatch {
    fetchArticleDetails: Function,
    setBreadcrumbs: (breadcrumbs: BreadcrumbEntry[]) => void
}

interface PropsFromState {
    articles: ArticlesState
}

interface PropsFromRoute {
    match: { 
        params: { 
            id: number, 
            heading?: string,
            tradeOrderId: number,
            categoryId: number,
            categoryHeading: string
        } 
    }
}

type FaqPageProps = PropsFromDispatch & PropsFromState & PropsFromRoute;

const mapDispatchToProps = {
    fetchArticleDetails: fetchArticleDetails,
    setBreadcrumbs: setBreadcrumbs
}

const maptStateToProps = ({ articles }: ApplicationState) => {
    return {
        articles
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(FaqPage);