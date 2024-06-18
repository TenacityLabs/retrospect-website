import { useRef, useEffect } from "react";

export default function useScrollObserver(addClass: string, childSelector: string) {
    const targetRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const child = entry.target.querySelector(childSelector);
                if (child) {
                    if (entry.isIntersecting) {
                        child.classList.add(addClass);
                    } else {
                        child.classList.remove(addClass);
                    }
                }
            },
            {
                threshold: 0,
            }
        );

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (targetRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(targetRef.current);
            }
        };
    }, [addClass, childSelector]);

    return { targetRef };
}
