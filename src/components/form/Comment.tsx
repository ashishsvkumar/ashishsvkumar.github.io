import * as React from "react";
import * as styles from "./Comment.scss";
import cx from "classnames";
import { isEmptyString } from "../../utils/extras";
import { WarningIcon } from "../icons/WarningIcon";
import { trackEvent } from "../../utils/tracker";

export class Comment extends React.Component<CommentProps, CommentState> {

    commentRef: any;

    static defaultProps = {
        onChange: () => { },
        showWarning: false,
        checkBoxTitle: undefined,
        subtitle: undefined
    }

    constructor(props: CommentProps) {
        super(props);
        this.commentRef = React.createRef();
        this.state = { hideCommentBox: !isEmptyString(props.checkBoxTitle), savedComment: null }
    }

    handleToggleCheckbox = () => {
        if (this.state.hideCommentBox) {
            const text = this.state.savedComment;
            this.setState({ hideCommentBox: false, savedComment: null }, () => {
                this.commentRef.current.value = text;
                if (this.props.onChange) {
                    this.props.onChange(text);
                }
            });

            trackEvent('Comment', 'enable');
        } else {
            this.setState({ hideCommentBox: true, savedComment: this.commentRef.current.value }, () => {
                if (this.props.onChange) {
                    this.props.onChange(null);
                }
            });

            trackEvent('Comment', 'enable');
        }
    }

    checkbox = () => {
        const checkboxClass = cx({ [styles.icon]: true, [styles.empty]: this.state.hideCommentBox })

        return (
            <div className={styles.checkbox} onClick={this.handleToggleCheckbox}>
                <div className={checkboxClass} />
                <div className={styles.checkbox_text}>{this.props.checkBoxTitle}</div>
                <div className={styles.clear}></div>
            </div>
        )
    }

    handleChange = (e: any) => {
        const value = e.target.value;
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        const { title, showWarning, checkBoxTitle, subtitle } = this.props;
        const className = cx({ [styles.textarea]: true, [styles.warn]: showWarning === true })
        const show = !this.state.hideCommentBox;
        
        return (
            <div className={styles.content}>
                {title && <div className={styles.title}>{title}</div>}
                {checkBoxTitle && this.checkbox()}
                <div className={styles.box}>
                    {show && subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                    { show && <textarea className={className} onChange={this.handleChange} ref={this.commentRef}></textarea> }
                    { show && showWarning && <WarningIcon text="Please don't leave this empty"/>}
                </div>
            </div>
        );
    }
}

interface CommentState {
    hideCommentBox: boolean,
    savedComment: string
}

export interface CommentProps {
    onChange?: (comment: string) => void,
    title?: string,
    showWarning?: boolean,
    checkBoxTitle?: string,
    subtitle?: string
}
