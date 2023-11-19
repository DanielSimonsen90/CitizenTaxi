import { Component } from "danholibraryrjs";
import { useState } from "react";
import { Nullable } from "types";

/**
 * React.useState specialized for modal children
 * @param defaultValue The default value of the state, if any
 * @returns A tuple with the state and a function to set the state, just like React.useState
 */
export function useModalContentState(defaultValue: Nullable<Component> = null) {
  const [component, setComponent] = useState(defaultValue);

  const setModalContent = (component: Component) => {
    setComponent(component);
  };

  return [() => component, setModalContent] as const;
}