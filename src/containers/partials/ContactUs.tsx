import * as log from 'loglevel';
import * as React from "react";
import { connect } from "react-redux";
import { ChatState } from '../../store/chat/types';
import { ApplicationState } from '../../store';
import { ContactUs as Component, PopupText } from "../../components/card/ContactUs";
import { isEmpty } from 'lodash';
import { showMessage } from "../../store/alert/actions";
import { isLoggedIn } from '../../utils/session';
import { getBasePath } from '../../config/environment';
import { fetchRedMartOrders } from '../../store/package/actions';
import { trackEvent } from '../../utils/tracker';

class ContactUs extends React.Component<ContactUsProps, {}> {
    constructor(props: ContactUsProps) {
        super(props);
    }

    componentDidMount() {
        log.info('Contact us container will mount');

        if (this.props.shouldFetchOrders) {
            this.props.fetchRedMartOrders();
        }
    }

    onChatClick = () => {
        this.onChat();
    }

    getGaLabel = () => {
        const path = location.href;
        if (path.indexOf('category') >= 0 && path.indexOf('faq') >= 0) {
            return 'Category > FAQ';
        } else if (path.indexOf('category') >= 0) {
            return 'Category';
        } else if (path.indexOf('faq') >= 0) {
            return 'FAQ';
        } else if (path.indexOf('orders') >= 0) {
            return 'Order';
        }
        return undefined;
    }

    onChat = () => {
        if (this.props.chat.loaded) {
            const match = location.pathname.match(/^\/support\/orders\/(\d+)\/faq/);

            if (!isEmpty(match) && match.length >= 2) {
                this.props.chat.snapEngageInstance.setCustomField('OrderNumber', `${match[1]}`);
            } else if (!isEmpty(this.props.recentOrder)) {
                this.props.chat.snapEngageInstance.setCustomField('OrderNumber', `${this.props.recentOrder}`);
            }
            
            this.props.chat.snapEngageInstance.startLink();
            trackEvent('Chat', 'click', this.getGaLabel());
        }
    }

    onLeaveMessage = () => {
        // @ts-ignore
        window.location = `${getBasePath()}query`;
    }

    onMore = () => {
        this.props.showMessage('Contact Us', PopupText(), 'Close');
        trackEvent('Phone', 'click', this.getGaLabel());
    }

    render() {
        return (
            <Component onChatClick={this.onChatClick} chatMessage={this.props.chat.isOffline ? 'Chat with us' : 'Chat with us'} onMoreClick={this.onMore}/>
        );
    }
}

interface PropsFromDispatch {
    showMessage: (title: string, message: any, btnText: string) => void,
    fetchRedMartOrders: () => void
}

interface PropsFromState {
    chat: ChatState,
    shouldFetchOrders: boolean,
    recentOrder?: string
}


type ContactUsProps = PropsFromDispatch & PropsFromState;

const mapDispatchToProps = {
    showMessage: showMessage,
    fetchRedMartOrders: fetchRedMartOrders
}

const maptStateToProps = ({ chat, redmartOrders }: ApplicationState) => {
    const shouldFetchOrders = isLoggedIn() && !redmartOrders.fetching && isEmpty(redmartOrders.orders);
    const orders = isEmpty(redmartOrders.orders) ? [] : redmartOrders.orders;

    return {
        chat: chat,
        shouldFetchOrders: shouldFetchOrders,
        recentOrder: isEmpty(orders) ? undefined : '' + orders[0].tradeOrderId
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(ContactUs);
