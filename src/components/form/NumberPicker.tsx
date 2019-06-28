import * as React from "react";
import * as styles from "./NumberPicker.scss";
import cx from "classnames";

export class NumberPicker extends React.Component<NumberPickerProps, NumberPickerState> {

    static defaultProps = {
        min: 1,
        max: 1000,
        value: 1
    }

    constructor(props: NumberPickerProps) {
        super(props);
        this.state = {
            value: props.value
        }
    }

    componentDidUpdate(prevProps: NumberPickerProps, prevState: NumberPickerState) {
        if (this.props.valueChanged) {
            this.props.valueChanged(prevState.value, this.state.value)
        }
    }

    onIncrement = () => {
        const value = this.state.value;
        if (value < this.props.max) {
            this.setState( { value: value + 1 },  )
        }
    }

    onDecrement = () => {
        const value = this.state.value;
        if (value > this.props.min) {
            this.setState( { value: value - 1 } )
        }
    }

    picker = () => {
        const minClassNames = cx({ [styles.btn]: true, [styles.decr]: true, [styles.disabled]: this.state.value <= this.props.min })
        const maxClassNames = cx({ [styles.btn]: true, [styles.disabled]: this.state.value >= this.props.max })
    
        return (
            <React.Fragment>
                <div className={minClassNames} onClick={this.onDecrement}/>
                <div className={styles.value}><div>{this.state.value}</div></div>
                <div className={maxClassNames} onClick={this.onIncrement}/>
            </React.Fragment>
        );
    }

    render() {
        const { label } = this.props;

        const classNames = cx({
            [styles.content]: true
        })
    
        return (
            <div className={classNames}>
                <div className={styles.label}>{label}</div>
                <div className={styles.picker}>
                    {this.picker()}
                </div>
                <div className={styles.clear} />
            </div>
        )
    }
}

export interface NumberPickerProps {
    label: string,
    min: number,
    max: number,
    value: number,
    valueChanged?: (oldValue: number, newValue: number) => void
}

interface NumberPickerState {
    value: number
}
