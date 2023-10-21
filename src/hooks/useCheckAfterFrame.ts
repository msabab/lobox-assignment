import { useCallback } from "react";

export const useCheckAfterFrame = (callbackFn: Function) => {
    // using requestAnimationFrame instead of useTimout is more efficient to check for blur events
    return useCallback(() => requestAnimationFrame(() => {
        callbackFn()
    }), []);
}