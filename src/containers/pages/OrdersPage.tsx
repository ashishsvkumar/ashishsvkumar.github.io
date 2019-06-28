import * as React from "react";
import * as log from "loglevel";
import { connect } from "react-redux";
import { OrdersPage as Component } from "../../components/pages/orders/OrdersPage"
import { Spinner } from "../../components/icons/Spinner"
import { fetchRedMartOrders } from "../../store/package/actions";
import { setBreadcrumbs } from "../../store/breadcrumb/actions";
import { ApplicationState } from "../../store";
import { isLoggedIn } from '../../utils/session'
import { ProtectedPage } from "../../components/wrappers/AuthWrapper"
import { BreadcrumbEntry } from "../../store/breadcrumb/types";
import { isEmpty } from 'lodash';
import { RedMartOrder } from "../../store/package/types";
import { trackPageView } from "../../utils/tracker";

export class OrdersPage extends React.Component<OrdersPageProps, OrdersPageState> {

    constructor(props: OrdersPageProps) {
        super(props);
    }

    componentWillMount() {
        log.info('Orders page countainer will mount 📖');
        this.props.setBreadcrumbs([ { text: 'My RedMart Orders', url: location.href, needLogin: true } ]);

        if (isLoggedIn() && isEmpty(this.props.orders) && !this.props.fetching && !this.props.noOrders) {
            log.info('Will fetch recent orders');
            this.props.fetchRedMartOrders();
        }

        trackPageView("Orders List Page")
    }

    render() {
        if (this.props.fetching || this.props.orders === null) {
            return <ProtectedPage><Spinner /></ProtectedPage>
        } else {
            return <Component orders={this.props.orders} />
        }
    }
}

interface OrdersPageState {

}

interface PropsFromDispatch {
    fetchRedMartOrders: () => void,
    setBreadcrumbs: (breadcrumbs: BreadcrumbEntry[]) => void
}

interface PropsFromState {
    fetching: boolean,
    noOrders: boolean,
    orders: RedMartOrder[]
}

type OrdersPageProps = PropsFromDispatch & PropsFromState;

const mapDispatchToProps = {
    fetchRedMartOrders: fetchRedMartOrders,
    setBreadcrumbs: setBreadcrumbs
}

const maptStateToProps = ({ redmartOrders }: ApplicationState) => {
    return {
        fetching: redmartOrders.fetching,
        noOrders: redmartOrders.noOrders,
        orders: redmartOrders.noOrders ? [] : isEmpty(redmartOrders.orders) ? null : redmartOrders.orders
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(OrdersPage);