import { useState, useEffect } from 'react';

interface UseDebounceParams<T> {
    value: T;
    delay: number;
}

export const useDebounce = <T,>({ value, delay }: UseDebounceParams<T>): T => {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set a timeout to update the debounced value after the specified delay
        const handler: NodeJS.Timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: Cancel the timeout if value or delay changes before the timeout fires
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run the effect if value or delay changes

    // Return the debounced value
    return debouncedValue;
};

// Usage example:
// const [searchTerm, setSearchTerm] = useState('');
// const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });


