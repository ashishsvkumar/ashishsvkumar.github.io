import * as log from 'loglevel';
import * as React from "react";
import { connect } from "react-redux";
import { ChatState } from '../../store/chat/types';
import { ApplicationState } from '../../store';
import { RMHelpPage as Component } from "../../components/pages/contact/RMHelpPage";
import { fetchRedMartOrders } from "../../store/package/actions";
import { isEmpty } from 'lodash';
import { isLoggedIn } from '../../utils/session';
import { trackPageView } from '../../utils/tracker';

class RMHelpPage extends React.Component<RMHelpPageProps, {}> {
    constructor(props: RMHelpPageProps) {
        super(props);
    }

    componentDidMount() {
        log.info('RM Help container will mount');
        trackPageView('Chat or Phone Page')
    }

    onLeaveMessage = () => {
        this.props.history.push('/query');
    }

    render() {
        return (
            <Component chat={this.props.chat} recentOrder={this.props.recentOrder} />
        );
    }
}

interface PropsFromDispatch {
    fetchRedMartOrders: () => void
}

interface PropsFromState {
    chat: ChatState,
    shouldFetchOrders: boolean,
    recentOrder?: string
}

interface PropsFromRoute {
    match: { 
        params: { 
            tradeOrderId?: string
        } 
    },
    history: {
        push: (path: string) => void
    }
}

type RMHelpPageProps = PropsFromDispatch & PropsFromState & PropsFromRoute;

const mapDispatchToProps = {
    fetchRedMartOrders: fetchRedMartOrders
}

const maptStateToProps = ({ chat, redmartOrders }: ApplicationState, ownProps: RMHelpPageProps) => {
    const forOrder = ownProps.match.params.tradeOrderId;
    const shouldFetchOrders = isLoggedIn() && !redmartOrders.fetching && isEmpty(redmartOrders.orders);
    const orders = isEmpty(redmartOrders.orders) ? [] : redmartOrders.orders;

    return {
        chat: chat,
        shouldFetchOrders: shouldFetchOrders,
        recentOrder: forOrder || (isEmpty(orders) ? undefined : '' + orders[0].tradeOrderId)
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(RMHelpPage);