document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nav").classList.add("scrolled");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // 1. Detect device to set specific parameters
    const isMobile = window.innerWidth <= 768;

    // 2. SINGLE Swiper Initialization
    const swiper = new Swiper(".mySwiper", {
        direction: "vertical",
        effect: isMobile ? "slide" : "fade", // Use slide for mobile performance
        speed: isMobile ? 400 : 200,
        mousewheel: isMobile ? false : {
            releaseOnEdges: true,
            sensitivity: 1,
            thresholdDelta: 20,
        },
        // Enable touch features specifically for mobile
        touchReleaseOnEdges: true,
        simulateTouch: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    // 3. COMMON HEADER LOGIC
    const resetHeader = () => {
        const nav = document.getElementById("nav");
        const links = document.querySelectorAll(".list_item a");
        const backImg = document.querySelector(".list_item a img");
        const menuImg = document.getElementById("menu-img");

        gsap.to(nav, { backgroundColor: "rgba(17, 17, 17, 0.3)", duration: 0.3, overwrite: "auto" });
        gsap.to(links, { color: "black", duration: 0.3 });
        if (backImg) gsap.to(backImg, { filter: "brightness(0) invert(0)", duration: 0.3 });
        if (menuImg) {
            menuImg.src = "src/assets/menu.png";
            gsap.to(menuImg, { filter: "brightness(0) invert(0)", duration: 0.3 });
        }
    };

    const setHeaderDark = () => {
        const nav = document.getElementById("nav");
        const links = document.querySelectorAll(".list_item a");
        const backImg = document.querySelector(".list_item a img");
        const menuImg = document.getElementById("menu-img");

        gsap.to(nav, { backgroundColor: "white", duration: 0.3, overwrite: "auto" });
        gsap.to(links, { color: "black", duration: 0.3 });
        if (backImg) gsap.to(backImg, { filter: "brightness(0) invert(1)", duration: 0.3 });
        if (menuImg) {
            menuImg.src = "src/assets/menu2.png";
            gsap.to(menuImg, { filter: "brightness(0) invert(1)", duration: 0.3 });
        }
    };

    // 4. UNIFIED SCROLL TRAP (WHEEL + TOUCH)
    const page2 = document.querySelector(".page2");
    let touchStartY = 0;

    // Desktop Wheel
    window.addEventListener("wheel", (e) => {
        if (isMobile) return;
        const rect = page2.getBoundingClientRect();
        if (Math.abs(rect.top) < 15) {
            if (swiper.isEnd && e.deltaY > 0) return;
            if (swiper.isBeginning && e.deltaY < 0) return;
            if (e.cancelable) e.preventDefault();
        }
    }, { passive: false });

    // Mobile Touch
    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: false });

    window.addEventListener("touchmove", (e) => {
        if (!isMobile) return;
        const touchMoveY = e.touches[0].clientY;
        const rect = page2.getBoundingClientRect();

        if (Math.abs(rect.top) < 50) {
            const deltaY = touchStartY - touchMoveY;
            if (swiper.isEnd && deltaY > 5) return;
            if (swiper.isBeginning && deltaY < -5) return;
            if (e.cancelable) e.preventDefault();
        }
    }, { passive: false });

    // 5. SHARED SCROLL TRIGGERS
    ScrollTrigger.create({
        trigger: ".page2",
        start: "top 50%",
        end: "bottom 50%",
        onEnter: setHeaderDark,
        onLeave: resetHeader,
        onEnterBack: setHeaderDark,
        onLeaveBack: resetHeader,
    });

    // Return to top arrow
    ScrollTrigger.create({
        trigger: ".page2",
        start: "top 50%",
        onEnter: () => gsap.to("#top-arr", { display: "flex", opacity: 1, duration: 0.3 }),
        onLeaveBack: () => gsap.to("#top-arr", { opacity: 0, display: "none", duration: 0.3 }),
    });

    document.getElementById("top-arr").addEventListener("click", () => {
        gsap.to(window, {
            duration: 0.2,
            scrollTo: 0,
            ease: "expo.out",
            onComplete: () => {
                swiper.slideTo(0, 0);
                resetHeader();
                gsap.to("#top-arr", { opacity: 0, display: "none", duration: 0.3 });
            },
        });
    });
});