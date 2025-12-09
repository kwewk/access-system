import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';

export const useDebounce = (value, delayMs = 500) => {
    const [debouncedVal, setDebouncedVal] = useState(value);
    const debouncedSetter = useMemo(
        () => _.debounce((newValue) => {
            setDebouncedVal(newValue);
        }, delayMs),
        [delayMs]
    );

    useEffect(() => {
        debouncedSetter(value);
        return () => {
            debouncedSetter.cancel();
        };
    }, [value, debouncedSetter]);

    return debouncedVal;
};