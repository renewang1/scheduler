import React from "react";

import "components/Button.scss";
import classNames from "classnames";

export default function Button(props) {
  const { confirm, danger } = props;
  let buttonClass = classNames("button", {
    "button--confirm": confirm,
    "button--danger": danger,
  });

  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={buttonClass}
    >
      {props.children}
    </button>
  );
}
