import * as React from "react";
import * as log from "loglevel";
import { connect } from "react-redux";
import { ItemLevelHelpPage as Component, Category } from "../../components/pages/order/ItemLevelHelpPage"
import { fetchRedMartOrder } from "../../store/package/actions";
import { setBreadcrumbs } from "../../store/breadcrumb/actions";
import { ApplicationState } from "../../store";
import { Spinner } from "../../components/icons/Spinner";
import { isLoggedIn } from "../../utils/session";
import { ProtectedPage } from "../../components/wrappers/AuthWrapper";
import { createTicket } from "../../store/ticket/actions";
import { Ticket } from "../../store/ticket/types";
import { BreadcrumbEntry } from "../../store/breadcrumb/types";
import { RedMartOrder } from "../../store/package/types";
import { isEmpty, get } from 'lodash';
import { NotFound } from "../../components/pages/notFound/NotFound";
import { trackPageView } from "../../utils/tracker";
import { setTitle } from "../../utils/container";

export class ItemLevelHelpPage extends React.Component<ItemLevelHelpPageProps, {}> {

    constructor(props: ItemLevelHelpPageProps) {
        super(props);
    }

    componentWillMount() {
        log.info('Item level help page countainer will mount for order 📝', this.props.match.params.tradeOrderId);
        const title = this.props.match.params.category === Category.missing ? 'Report missing items' : 'Report an issue with received items';

        this.props.setBreadcrumbs([
            { text: 'My RedMart Orders', url: '/orders', needLogin: true },
            { text: 'Order Help', url: `/orders/${this.props.match.params.tradeOrderId}`, needLogin: true },
            { text: title, url: location.href, needLogin: true }
        ]);

        if (isLoggedIn() && this.props.order === null && !this.props.fetching) {
            this.props.fetchRedMartOrder(this.props.match.params.tradeOrderId);
        }

        trackPageView(`Order Help: items ${this.props.match.params.category}`);
        setTitle(title);
    }

    unknownHelp = () => {
        const category = this.props.match.params.category;
        return !(category === Category.damaged || category === Category.missing);
    }

    render() {
        const { fetching, order } = this.props;
        if (this.unknownHelp()) {
            return <NotFound />;
        }
        else if (this.props.notFound) {
            return <NotFound message="Sorry, the order you are looking for could not be found."/>;
        }
        else if (fetching || order === null) {
            return <ProtectedPage><Spinner /></ProtectedPage>
        } else {
            return <Component order={order} helpCategory={this.props.match.params.category} createTicket={this.props.createTicket} inProgress={this.props.ticketInProgress} />
        }
    }
}

interface PropsFromDispatch {
    fetchRedMartOrder: (tradeOrderId: string) => void,
    createTicket: (ticket: Ticket) => void,
    setBreadcrumbs: (breadcrumbs: BreadcrumbEntry[]) => void
}

interface PropsFromState {
    fetching: boolean,
    order: RedMartOrder,
    ticketInProgress: boolean,
    notFound: boolean
}

interface PropsFromRoute {
    match: { params: { tradeOrderId: string, category: Category } }
}

type ItemLevelHelpPageProps = PropsFromDispatch & PropsFromState & PropsFromRoute;

const mapDispatchToProps = {
    fetchRedMartOrder: fetchRedMartOrder,
    createTicket: createTicket,
    setBreadcrumbs: setBreadcrumbs
}

const maptStateToProps = ({ redmartOrders, ticket }: ApplicationState, ownProps: ItemLevelHelpPageProps) => {
    const orderId = ownProps.match.params.tradeOrderId;
    const fetching =  get(redmartOrders, `details[${orderId}].fetching`, false);
    const notFound = !isEmpty(get(redmartOrders, `details[${orderId}].error`))
    const order = get(redmartOrders, `details[${orderId}].order`, null);

    return {
        fetching,
        notFound,
        order
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(ItemLevelHelpPage);