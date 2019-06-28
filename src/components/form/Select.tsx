import * as React from "react";
import cx from "classnames";
import * as selectStyles from "./Select.scss";
import * as textboxStyles from "./Textbox.scss";
import { ArrowIcon, Direction } from "../icons/ArrowIcon";

const enum KEY_CODES {
    TAB = 9,
    ENTER = 13,
    ESC = 27,
    UP = 38,
    DOWN = 40,
    BACKSPACE = 8
}

export interface SelectOption {
    value: string,
    displayText: string
};

export interface SelectProps {
    options: SelectOption[],
    onChange?: (value: string) => void,
    value?: string,
    inputOptions?: any,
    maxHeight: string,
    isDropup: boolean,
    isStriped: boolean
};

interface SelectState {
    value: string,
    isInputInFocus: boolean,
    isDropdownInFocus: boolean,
    highlightedOptionIndex: number
};

export class Select extends React.Component<SelectProps, SelectState> {
    inputBox: HTMLInputElement;
    optionsRefs: Array<any>;
    menuRef: any;

    static defaultProps = {
        maxHeight: "160px",
        isDropup: false,
        isStriped: false
    };

    constructor(props: SelectProps) {
        super(props);
        this.state = {
            value: this.sanitizeValue(props.options, props.value),
            isInputInFocus: false,
            isDropdownInFocus: false,
            highlightedOptionIndex: -1
        };

        this.optionsRefs = [];
    }

    componentWillReceiveProps(newProps: SelectProps) {
        this.setState({
            value: this.sanitizeValue(newProps.options, newProps.value),
            highlightedOptionIndex: -1
        });
        this.optionsRefs.length = 0;
    }

    /* Handles for dropdown display state */

    handleInputFocusToggle = () => {
        this.setState(prevState => {
            return {
                isInputInFocus: !prevState.isInputInFocus,
                highlightedOptionIndex: -1
            };
        });
    }

    handleInputFocusOut = () => {
        this.setState({ isInputInFocus: false });
    }

    handleDropdownFocusIn = () => {
        this.setState({ isDropdownInFocus: true });
    }

    handleDropdownFocusOut = () => {
        this.setState({ isDropdownInFocus: false });
    }

    /* Handles for options highlight */

    handleOptionMouseEnter = (index: number) => {
        this.setState({ highlightedOptionIndex: index });
    }

    handleOptionMouseLeave = () => {
        this.setState({ highlightedOptionIndex: -1 });
    }

    /* Handles for keyboard navigation */

    handleKeyboardEvents = (event: KeyboardEvent) => {
        const keyCode = event.which;
        switch (keyCode) {
            case KEY_CODES.UP: {
                event.preventDefault();
                this.moveHighlightUp();
                break;
            }
            case KEY_CODES.DOWN: {
                event.preventDefault();
                this.moveHighlightDown();
                break;
            }
            case KEY_CODES.ENTER: {
                event.preventDefault();
                this.handleEnterKeyOnInput();
                break;
            }
            case KEY_CODES.ESC: {
                event.preventDefault();
                this.inputBox.blur();
                this.handleDropdownFocusOut();
                break;
            }
            case KEY_CODES.BACKSPACE: {
                event.preventDefault();
                this.handleClear();
                break;
            }
        }
    }

    handleEnterKeyOnInput = () => {
        if (this.shouldShowDropdownOpen()) {
            this.handleSelect(this.state.highlightedOptionIndex);
        } else {
            this.handleDropdownFocusIn();
        }
    }

    /* Handles for value update */

    handleSelect = (selectedOptionIndex: number) => {
        if (selectedOptionIndex < 0) {
            return;
        }

        const option = this.props.options[selectedOptionIndex];
        this.setState({
            value: option.value,
            isDropdownInFocus: false,
            isInputInFocus: false
        });
        if (typeof this.props.onChange === "function") {
            this.props.onChange(option.value);
        }
        this.inputBox.focus();
    }

    handleClear = () => {
        this.setState({
            value: "",
            isDropdownInFocus: false,
            isInputInFocus: false
        });
        if (typeof this.props.onChange === "function") {
            this.props.onChange("");
        }
    }

    /* Handles mouse scroll event */

    handleDropdownMouseWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        const menuRect = this.menuRef.getBoundingClientRect();

        const isDownwards = event.deltaY > 0;
        const scrollTop = this.menuRef.scrollTop;
        const scrollHeight = this.menuRef.scrollHeight;
        const height = menuRect.height;

        const hasScrolledToBottom = scrollTop >= scrollHeight - height;
        const hasScrolledToTop = scrollTop === 0;

        if (isDownwards && hasScrolledToBottom) {
            this.menuRef.scrollTop = scrollHeight;
            event.preventDefault();
        } else if (!isDownwards && hasScrolledToTop) {
            this.menuRef.scrollTop = 0;
            event.preventDefault();
        }
    }

    handleScrollOnInput = (event: WheelEvent) => {
        event.preventDefault();
    }

    /* Function to render options in dropdown */

    getOptionsElements = () => {
        return this.props.options.map((option, index) => {
            const optionStyle = cx({
                [selectStyles.option]: true,
                [selectStyles.highlighted]: index === this.state.highlightedOptionIndex
            });

            return (
                <div
                    ref={ref => this.saveOptionsRefs(ref, index)}
                    key={option.value}
                    onClick={() => this.handleSelect(index)}
                    className={optionStyle}
                    onMouseEnter={() => this.handleOptionMouseEnter(index)}
                    onMouseLeave={this.handleOptionMouseLeave}
                >
                    {option.displayText}
                </div>
            );
        });
    }

    saveOptionsRefs = (ref: any, index: number) => {
        this.optionsRefs[index] = ref;
    }

    /* Function to get displayText when value is given */

    getDisplayTextFromValue = (value: string) => {
        const option = this.props.options.filter(option => option.value === value);
        return option && option.length > 0 ? option[0].displayText : "";
    }

    sanitizeValue = (options: SelectOption[], value?: string): string => {
        if (typeof value === "string") {
            return options.some(option => option.value === value) ? value : "";
        }
        return "";
    }

    shouldShowDropdownOpen = () => {
        return (
            this.props.options.length > 0 &&
            (this.state.isInputInFocus || this.state.isDropdownInFocus)
        );
    }

    /* Helper functions for keyboard navigation */

    scrollToHighlightedElement = (index: number) => {
        const focusedRect = this.optionsRefs[index].getBoundingClientRect();
        const menuRect = this.menuRef.getBoundingClientRect();

        const offset = menuRect.top;
        const from = this.menuRef.scrollTop;
        const to = from + menuRect.height;
        const top = focusedRect.top - offset;
        const bottom = focusedRect.bottom - offset;

        if (bottom > to - from) {
            this.menuRef.scrollTop = bottom - menuRect.height + from;
        } else if (top < 0) {
            this.menuRef.scrollTop = top + from;
        }
    }

    moveHighlightUp = () => {
        let currentIndex = this.state.highlightedOptionIndex;
        if (currentIndex > 0) {
            this.setState({ highlightedOptionIndex: --currentIndex }, () =>
                this.scrollToHighlightedElement(currentIndex)
            );
        }
    }

    moveHighlightDown = () => {
        let currentIndex = this.state.highlightedOptionIndex;
        const lastIndex = this.props.options.length - 1;

        if (currentIndex < lastIndex) {
            this.setState({ highlightedOptionIndex: ++currentIndex }, () =>
                this.scrollToHighlightedElement(currentIndex)
            );
        }
    }

    /* Render function */

    render() {
        const showMenu = this.shouldShowDropdownOpen();

        const inputClassNames = cx({
            [textboxStyles.textbox]: true,
            [selectStyles.readonly]: true,
            [selectStyles.dropdown_open]: showMenu && !this.props.isDropup,
            [selectStyles.dropup_open]: showMenu && this.props.isDropup
        });

        const dropdownMenuClassNames = cx({
            [selectStyles.dropdown_menu]: true,
            [selectStyles.open]: showMenu,
            [selectStyles.dropup]: this.props.isDropup,
            [selectStyles.striped]: this.props.isStriped
        });

        const caretClassNames = cx({
            [selectStyles.caret_icon]: true,
            [selectStyles.flip]: showMenu
        });

        const dropdownStyle = {
            maxHeight: this.props.maxHeight
        };

        let clearIcon;
        if (this.state.value) {
            clearIcon = (
                <span className={selectStyles.clear} onClick={this.handleClear}>&times;</span>
            );
        }

        return (
            <div className={selectStyles.container}>
                <input
                    ref={input => (this.inputBox = input)}
                    type="text"
                    readOnly={true}
                    className={inputClassNames}
                    onClick={this.handleInputFocusToggle}
                    onBlur={this.handleInputFocusOut}
                    value={this.getDisplayTextFromValue(this.state.value)}
                    onKeyDown={this.handleKeyboardEvents}
                    onWheel={this.handleScrollOnInput}
                    {...this.props.inputOptions}
                />
                {clearIcon}
                <span className={caretClassNames}>
                    <span className={selectStyles.caret}><ArrowIcon direction={Direction.DOWN} size={4}/></span>
                </span>
                <div
                    ref={ref => (this.menuRef = ref)}
                    className={dropdownMenuClassNames}
                    onMouseEnter={this.handleDropdownFocusIn}
                    onMouseLeave={this.handleDropdownFocusOut}
                    onWheel={this.handleDropdownMouseWheel}
                    style={dropdownStyle}
                >
                    {this.getOptionsElements()}
                </div>
            </div>
        );
    }
}