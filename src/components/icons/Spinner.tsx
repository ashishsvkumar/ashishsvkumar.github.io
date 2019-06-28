import * as React from "react";
import * as styles from "./Spinner.scss";

export class Spinner extends React.Component<{}, {}> {

    componentWillMount() {
        document.body.classList.add('modal-open');
    }

    componentWillUnmount() {
        document.body.classList.remove('modal-open');
    }

    render() {
        return (
            <div className={styles.overlay}>
                <div className={styles.lds_ring}>
                    <div/><div/><div/><div/>
                </div>
            </div>
        )
    }
}