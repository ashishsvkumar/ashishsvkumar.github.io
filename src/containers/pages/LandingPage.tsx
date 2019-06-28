import * as React from "react";
import * as log from "loglevel";
import { connect } from "react-redux";
import { LandingPage as Component } from "../../components/pages/landing/LandingPage"
import { fetchRedMartOrders } from "../../store/package/actions";
import { clearBreadcrumbs } from "../../store/breadcrumb/actions";
import { ApplicationState } from "../../store";
import { isLoggedIn } from '../../utils/session';
import { isEmpty } from 'lodash';
import { RedMartOrder } from "../../store/package/types";
import { trackPageView } from "../../utils/tracker";

export class LandingPage extends React.Component<LandingPageProps, LandingPageState> {

    constructor(props: LandingPageProps) {
        super(props);
    }

    componentWillMount() {
        log.info('Landing page countainer will mount');
        this.props.clearBreadcrumbs();
        if (isLoggedIn() && !this.props.fetching && isEmpty(this.props.recentOrder) && !this.props.noOrders) {
            log.info('Will fetch recent orders');
            this.props.fetchRedMartOrders();
        }

        trackPageView('Homepage')
    }

    render() {
        if (isEmpty(this.props.recentOrder) || this.props.fetching) {
            return <Component isLoggedIn={false} userName={null}/>;
        } else {
            return <Component isLoggedIn={isLoggedIn()} recentOrder={this.props.recentOrder} userName={this.props.userName}/>
        }
    }
}

interface LandingPageState {

}

interface PropsFromDispatch {
    fetchRedMartOrders: () => void,
    clearBreadcrumbs: () => void
}

interface PropsFromState {
    fetching: boolean,
    noOrders: boolean,
    recentOrder?: RedMartOrder,
    userName: string
}

type LandingPageProps = PropsFromDispatch & PropsFromState;

const mapDispatchToProps = {
    fetchRedMartOrders: fetchRedMartOrders,
    clearBreadcrumbs: clearBreadcrumbs
}

const maptStateToProps = ({ redmartOrders, user }: ApplicationState) => {
    const fetching = redmartOrders.fetching;
    const recentOrder = isEmpty(redmartOrders.orders) ? null : redmartOrders.orders[0];
    return {
        fetching,
        recentOrder,
        noOrders: redmartOrders.noOrders,
        userName: !user.fetching && !isEmpty(user.user) ? user.user.name : null
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(LandingPage);