/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";

export function useInViewport(name: string): {
  isInViewport: boolean;
  ref: React.RefCallback<HTMLElement>;
} {
  const [isInViewport, setIsInViewport] = useState(false);
  const [refElement, setRefElement] = useState<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setRefElement(node);
    }
  }, []);

  useEffect(() => {
    if (refElement) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // console.log(entry.intersectionRatio, name);
          if (entry.intersectionRatio >= 0.5) {
            // console.log("inside ", name);
            setIsInViewport(true);
          } else {
            setIsInViewport(false);
          }
          // if (entry.intersectionRatio === 0) {
          //   console.log("outside ", name);
          //   setIsInViewport(false);
          // } else {
          //   console.log("inside ", name);
          //   setIsInViewport(true);
          // }
        },
        { threshold: 0.5 }
      );
      observer.observe(refElement);

      return () => {
        observer.disconnect();
      };
    }
  }, [isInViewport, refElement]);

  return { isInViewport, ref: setRef };
}
