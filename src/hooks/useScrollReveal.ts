import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.setAttribute("data-reveal", "complete");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);
}

export function initScrollReveal() {
  const revealElements = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.setAttribute("data-reveal", "complete");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -20% 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));
}
