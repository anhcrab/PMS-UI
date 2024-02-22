import { Popover } from "bootstrap";
import { Children, useEffect } from "react";

export const Show = (props) => {
  let when = null;
  let otherwise = null;

  Children.forEach(props.children, (children) => {
    if (children.props.isTrue === undefined) {
      otherwise = children;
    } else if (!when && children.props.isTrue === true) {
      when = children;
    }
  });

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    [...popoverTriggerList].map(
      (popoverTriggerEl) => new Popover(popoverTriggerEl)
    );
    document.querySelectorAll(".popover").forEach((popover) => {
      popover.setAttribute("data-bs-theme", "dark");
    });
    return () => {
      document.querySelectorAll(".popover").forEach((popover) => {
        popover.remove();
      });
    };
  }, []);

  return when || otherwise;
};

Show.When = ({ isTrue, children }) => isTrue && children;
Show.Else = ({ render, children }) => render || children;
