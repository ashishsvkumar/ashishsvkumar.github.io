import * as React from "react";
import { connect } from "react-redux";
import { QueryFormPage as Component } from "../../components/pages/query/QueryFormPage"
import { createTicket } from "../../store/ticket/actions";
import { setBreadcrumbs } from "../../store/breadcrumb/actions";
import { ApplicationState } from "../../store";
import { Ticket } from "../../store/ticket/types";
import { BreadcrumbEntry } from "../../store/breadcrumb/types";
import { isEmpty } from 'lodash';
import * as log from 'loglevel';
import { trackPageView } from "../../utils/tracker";

export class QueryFormPage extends React.Component<QueryFormPageProps, QueryFormPageState> {

    constructor(props: QueryFormPageProps) {
        super(props);
        log.info('Query form page will mount ✉️');
    }

    componentWillMount() {
        this.props.setBreadcrumbs([{ text: 'Miscellaneous', url: location.href, needLogin: false }]);
        trackPageView('Query Form Page')
    }

    render() {
        return <Component createTicket={this.props.createTicket} inProgress={this.props.ticketInProgress} userEmail={this.props.userEmail}/>
    }
}

interface QueryFormPageState {

}

interface PropsFromDispatch {
    createTicket: (ticket: Ticket) => void,
    setBreadcrumbs: (breadcrumbs: BreadcrumbEntry[]) => void
}

interface PropsFromState {
    ticketInProgress: boolean,
    userEmail: string
}

type QueryFormPageProps = PropsFromDispatch & PropsFromState;

const mapDispatchToProps = {
    createTicket: createTicket,
    setBreadcrumbs: setBreadcrumbs
}

const maptStateToProps = ({ ticket, user }: ApplicationState) => {
    return {
        ticketInProgress: ticket.inProgress,
        userEmail: !user.fetching && !isEmpty(user.user) ? user.user.email : null
    };
}

export default connect(maptStateToProps, mapDispatchToProps)(QueryFormPage);