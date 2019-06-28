import * as log from 'loglevel';
import * as React from "react";
import { connect } from "react-redux";
import { ChatState } from '../../store/chat/types';
import { setup } from "../../store/chat/actions";
import { ApplicationState } from '../../store';
import { UserInfoState } from '../../store/user/types';
import { isEmpty } from 'lodash';

class SnapEngageWrapper extends React.Component<ChatProps, {}> {
    constructor(props: ChatProps) {
        super(props);
    }

    componentDidMount() {
        log.info('SnapEngage container will mount');
        if (!this.props.chat.loading && !this.props.chat.loaded) {
            this.props.setup();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: ChatProps) {
        if (nextProps.chat.loaded) {

            const se = nextProps.chat.snapEngageInstance;

            if (!isEmpty(nextProps.user.user)) {
                se.setUserName(nextProps.user.user.name);
                se.setUserEmail(nextProps.user.user.email, false);
                se.setCustomField('phone', nextProps.user.user.phone || '');
            }
        }
    }

    render() {
        return (
            <React.Fragment>{this.props.children}</React.Fragment>
        );
    }
}

interface PropsFromDispatch {
    setup: () => void
}

interface PropsFromState {
    chat: ChatState,
    user: UserInfoState
}

type ChatProps = PropsFromDispatch & PropsFromState;

const mapDispatchToProps = {
    setup: setup
}

const maptStateToProps = ({ chat, user }: ApplicationState) => {
    return {
        chat,
        user
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(SnapEngageWrapper);
