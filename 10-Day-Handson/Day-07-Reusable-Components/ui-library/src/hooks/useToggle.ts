import { useState } from "react";

function useToggle(initialValue: boolean = false) {
  const [isOn, setIsOn] = useState(initialValue);

  const open = () => setIsOn(true);
  const close = () => setIsOn(false);
  const toggle = () => setIsOn((prev) => !prev);

  return { isOn, open, close, toggle };
}

export default useToggle;
