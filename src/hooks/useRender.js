import { useState } from "react";

export default function useRender() {
    const [count, setCount] = useState(0);

    return () => {
        setCount((count) => count + 1);
    }
}