import * as React from "react";
import * as styles from "./ContentTitle.scss";

export interface TitleProps {
  text: string;
}

export const ContentTitle = (props: TitleProps) => <h3 className={styles.content} aria-label={props.text.toUpperCase()}>{props.text}</h3>;
