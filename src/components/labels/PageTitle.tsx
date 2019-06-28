import * as React from "react";
import { setTitle } from '../../utils/container'

export const PageTitle: React.StatelessComponent<PageTitleProps> = (props: PageTitleProps) => {

    if (props.title) {
        setTitle(props.title)
    }

    return <React.Fragment>{props.children}</React.Fragment>;
};


export interface PageTitleProps {
    title?: string,
    children: any
}