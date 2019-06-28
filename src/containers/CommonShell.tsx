import * as React from "react";
import { connect } from "react-redux";
import { Alert } from "../store/alert/types";
import { ApplicationState } from "../store";
import { PopupPage, Style } from "../components/pages/PopupPage";
import { NotificationCard } from "../components/card/NotificationCard";

class CommonShell extends React.Component<CommonShellProps, {}> {
    render() {
        return (
            <div>
                {this.props.children}
                <PopupPage popupStyle={Style.OVERLAY} show={this.props.show}>
                    <NotificationCard {...this.props}/>
                </PopupPage>
            </div>
        )
    }
}

type PropsFromState = Alert

type CommonShellProps = PropsFromState;

const maptStateToProps = ({ alert }: ApplicationState) => {
    return alert;
}

export default connect(maptStateToProps, null)(CommonShell);