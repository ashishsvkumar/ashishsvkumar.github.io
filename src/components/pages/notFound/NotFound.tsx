import * as React from "react";
import * as styles from "./NotFound.scss";
import { setTitle } from "../../../utils/container";

export class NotFound extends React.Component<NotFoundProps, {}> {
    
    constructor(props: NotFoundProps) {
        super(props);
    }

    render() {
        setTitle(this.props.title || 'Not Found');

        return (
            <div className={styles.content}>
                <div>&#9888;</div>
                <div>{this.props.message || 'Sorry, the page you are looking for could not be found.'}</div>
            </div>
        );
    }
}

export interface NotFoundProps {
    title?: string,
    message?: string
}
