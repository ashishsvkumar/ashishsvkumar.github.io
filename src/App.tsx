import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { basePath } from "./config/environment";
import CommonShell from "./containers/CommonShell";
import MainContentHolder from "./components/wrappers/MainContentHolder";
import { connect } from "react-redux";
import { UserInfoState } from "./store/user/types";
import { fetchUserInfo } from "./store/user/actions";
import { ApplicationState } from "./store";
import * as log from 'loglevel';
import { isEmptyObject } from "./utils/extras";
const supportsHistory = "pushState" in window.history;

class App extends React.Component<AppProps, {}> {

    constructor(props: AppProps) {
        super(props);
    }

    componentWillMount() {
        log.info('App mounted 🚀');
        if (!this.props.user.fetching && isEmptyObject(this.props.user.user)) {
            this.props.fetchUserInfo();
        }
    }

    render() {    
        return (
            <CommonShell>
                <Router basename={basePath} forceRefresh={!supportsHistory}>
                    <MainContentHolder/>
                </Router>
            </CommonShell>
        );
    }
}

interface PropsFromState {
    user: UserInfoState
}

interface PropsFromDispatch {
    fetchUserInfo: () => void
}

type AppProps = PropsFromState & PropsFromDispatch;

const mapDispatchToProps = {
    fetchUserInfo: fetchUserInfo
}

const maptStateToProps = ({ user }: ApplicationState) => {
    return {
        user
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(App);