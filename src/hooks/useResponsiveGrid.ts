"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

export const useResponsiveGrid = (totalItems: number) => {
    const [dimensions, setDimensions] = useState({ width: 1024, height: 768 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateDimensions = useCallback(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        setDimensions(prev => {
            const widthDiff = Math.abs(prev.width - newWidth);
            const heightDiff = Math.abs(prev.height - newHeight);

            if (widthDiff > 50 || heightDiff > 100) {
                return { width: newWidth, height: newHeight };
            }
            return prev;
        });
    }, []);

    useEffect(() => {
        updateDimensions();

        const handleResize = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(updateDimensions, 200);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [updateDimensions]);

    const { itemsPerPage, totalPages } = useMemo(() => {
        if (dimensions.width === 0) return { itemsPerPage: 8, totalPages: 1 };

        const width = dimensions.width;
        let cols: number;

        if (width < 640) cols = 2;
        else if (width < 768) cols = 3;
        else if (width < 1024) cols = 4;
        else if (width < 1280) cols = 5;
        else if (width < 1536) cols = 6;
        else cols = 7;

        const containerHeight = dimensions.height - 300;
        const itemHeight = 220;
        const rows = Math.max(2, Math.floor(containerHeight / itemHeight));
        const items = cols * rows;
        const pages = totalItems > 0 ? Math.ceil(totalItems / items) : 1;

        return {
            itemsPerPage: items,
            totalPages: pages,
        };
    }, [dimensions.width, dimensions.height, totalItems]);

    return { itemsPerPage, totalPages };
};