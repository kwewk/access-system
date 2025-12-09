import { useEffect, useRef, useMemo } from 'react';
import _ from 'lodash';

export const useThrottle = (fn, delayMs = 1000) => {
    const fnRef = useRef(fn);
    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    const throttledFn = useMemo(
        () => _.throttle((...args) => {
            fnRef.current(...args);
        }, delayMs, {
            leading: true,
            trailing: true
        }),
        [delayMs]
    );

    useEffect(() => {
        return () => {
            throttledFn.cancel();
        };
    }, [throttledFn]);

    return throttledFn;
};