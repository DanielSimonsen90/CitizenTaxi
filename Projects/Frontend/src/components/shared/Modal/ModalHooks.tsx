import { Component } from "danholibraryrjs";
import { useState } from "react";
import { Nullable } from "types";

export function useModalContentState(defaultValue: Nullable<Component> = null) {
  const [component, setComponent] = useState(defaultValue);

  const setModalContent = (component: Component) => {
    setComponent(component);
  };

  return [() => component, setModalContent] as const;
}