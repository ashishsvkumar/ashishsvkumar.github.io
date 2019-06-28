import * as React from "react";
import * as log from "loglevel";
import { connect } from "react-redux";
import { OrderHelpLandingPage as Component } from "../../components/pages/order/OrderHelpLandingPage"
import { fetchRedMartOrder } from "../../store/package/actions";
import { setBreadcrumbs } from "../../store/breadcrumb/actions";
import { ApplicationState } from "../../store";
import { isLoggedIn } from '../../utils/session'
import { Spinner } from "../../components/icons/Spinner"
import { ProtectedPage } from "../../components/wrappers/AuthWrapper"
import { isEmpty, get } from 'lodash';
import { BreadcrumbEntry } from "../../store/breadcrumb/types";
import { RedMartOrder } from "../../store/package/types";
import { NotFound } from "../../components/pages/notFound/NotFound";
import { trackPageView, trackEvent } from "../../utils/tracker";

export class OrderHelpLandingPage extends React.Component<OrderHelpPageProps, OrderHelpPageState> {

    constructor(props: OrderHelpPageProps) {
        super(props);
    }

    componentWillMount() {
        log.info('Order details page countainer will mount for order 🧾', this.props.match.params.tradeOrderId);
        this.props.setBreadcrumbs([
            { text: 'My RedMart Orders', url: '/orders', needLogin: true },
            { text: 'Order Help', url: location.href, needLogin: true }
        ]);

        if (isLoggedIn() && this.props.order === null && !this.props.fetching) {
            log.info('Fetching order details');
            this.props.fetchRedMartOrder(this.props.match.params.tradeOrderId);
        }

        trackPageView(`Order Help Page`)
    }

    UNSAFE_componentWillReceiveProps(nextProps: OrderHelpPageProps) {
        if (this.props.order === null && nextProps.order !== null) {
            trackEvent('Order Help', 'View', 'landing', nextProps.order.status);
        }
    }

    render() {
        if (this.props.notFound) {
            return <NotFound message="Sorry, the order you are looking for could not be found."/>;
        }
        else if (this.props.fetching || this.props.order === null) {
            return <ProtectedPage><Spinner /></ProtectedPage>
        }
        else {
            return <Component {...this.props.order} />
        }
    }
}

interface OrderHelpPageState {

}

interface PropsFromDispatch {
    fetchRedMartOrder: (tradeOrderId: string) => void,
    setBreadcrumbs: (breadcrumbs: BreadcrumbEntry[]) => void
}

interface PropsFromState {
    fetching: boolean,
    order: RedMartOrder,
    notFound: boolean
}

interface PropsFromRoute {
    match: { params: { tradeOrderId: string } }
}

type OrderHelpPageProps = PropsFromDispatch & PropsFromState & PropsFromRoute;

const mapDispatchToProps = {
    fetchRedMartOrder: fetchRedMartOrder,
    setBreadcrumbs: setBreadcrumbs
}

const maptStateToProps = ({ redmartOrders }: ApplicationState, ownProps: OrderHelpPageProps) => {
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

export default connect(maptStateToProps, mapDispatchToProps)(OrderHelpLandingPage);