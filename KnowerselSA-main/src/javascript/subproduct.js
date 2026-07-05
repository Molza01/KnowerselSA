document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("nav");

    const updateNavBlur = () => {
        if (window.scrollY > 10) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    };

    updateNavBlur();
    window.addEventListener("scroll", updateNavBlur);

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // =============================================
    //  1. LOAD PRODUCT FROM URL
    //  URL format: content.html?id=product_1
    // =============================================

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const product = PRODUCTS[productId];

    if (!product) {
        console.warn(`No product found for id: "${productId}". Redirecting...`);
        window.location.href = "product.html";
        return;
    }

    // Set page title
    document.title = product.pageTitle;

    // Back arrow → returns to Product_details.html with same id
    document.getElementById("back-link").href = `Product_details.html?id=${productId}`;

    // Check if slides exist
    if (!product.slides || product.slides.length === 0) {
        alert("Content is coming soon");
        window.location.href = `Product_details.html?id=${productId}`;
        return;
    }

    // =============================================
    //  2. BUILD SLIDES DYNAMICALLY
    // =============================================

    const wrapper = document.getElementById("slides-wrapper");

    product.slides.forEach((slide, index) => {
        let mediaHTML = "";
        if (slide.type === "youtube") {
            // Convert Shorts URL to embed URL if needed, and enable the YouTube JS API for keyboard control
            let videoSrc = slide.src.replace('/shorts/', '/embed/');
            videoSrc = videoSrc.replace('?&', '?');
            try {
                const url = new URL(videoSrc);
                url.searchParams.set('rel', '0');
                url.searchParams.set('modestbranding', '1');
                url.searchParams.set('controls', '1');
                url.searchParams.set('enablejsapi', '1');
                url.searchParams.set('origin', window.location.origin);
                videoSrc = url.toString();
            } catch (error) {
                if (!videoSrc.includes('?')) {
                    videoSrc += '?rel=0&modestbranding=1&controls=1&enablejsapi=1';
                } else {
                    if (!videoSrc.includes('rel=')) videoSrc += '&rel=0';
                    if (!videoSrc.includes('modestbranding=')) videoSrc += '&modestbranding=1';
                    if (!videoSrc.includes('controls=')) videoSrc += '&controls=1';
                    if (!videoSrc.includes('enablejsapi=')) videoSrc += '&enablejsapi=1';
                }
            }
            mediaHTML = `
                <iframe
                    src="${videoSrc}"
                    title="${slide.title}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>`;
        } else {
            mediaHTML = `<video src="${slide.src}" controls></video>`;
        }

        // Only first slide gets the section heading
        const headingHTML = index === 0
            ? `<div class="heading-1"><h1>${product.sectionHeading}</h1></div>`
            : "";

        wrapper.innerHTML += `
            <div class="video-slide swiper-slide" style="margin-top: 0;">
                ${headingHTML}
                <div class="video">${mediaHTML}</div>
                <div class="video-descr">
                    <h1 class="video-title">${slide.title}</h1>
                    <hr>
                    <p>${slide.description}</p>
                </div>
            </div>`;
    });

    // =============================================
    //  3. ALLOW IFRAME INTERACTIONS & OVERLAYS
    // =============================================

    // Add a click-overlay for iframes to reliably capture play/pause clicks
    document.querySelectorAll('.video').forEach(container => {
        const iframe = container.querySelector('iframe');
        if (!iframe) return;
        // ensure container is positioned so overlay can cover it
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.position === 'static') container.style.position = 'relative';

        const overlay = document.createElement('div');
        overlay.className = 'yt-click-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        // capture clicks and toggle YouTube playback via postMessage
        overlay.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const state = iframePlayerStates.get(iframe);
            if (state === 1) {
                postYoutubeCommand(iframe, 'pauseVideo');
            } else {
                postYoutubeCommand(iframe, 'playVideo');
            }
        });

        // also allow double-click to toggle as a fallback
        overlay.addEventListener('dblclick', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const state = iframePlayerStates.get(iframe);
            if (state === 1) postYoutubeCommand(iframe, 'pauseVideo');
            else postYoutubeCommand(iframe, 'playVideo');
        });

        // insert overlay on top of iframe
        container.appendChild(overlay);
    });

    // =============================================
    //  4. NATURAL SCROLL & PLAYBACK MANAGEMENT
    // =============================================

    const slides = document.querySelectorAll(".video-slide");
    let currentActiveIndex = -1;

    const updateActiveMedia = () => {
        let minDiff = Infinity;
        let activeIdx = 0;
        const viewportCenter = window.innerHeight / 2;

        slides.forEach((slide, idx) => {
            const rect = slide.getBoundingClientRect();
            const slideCenter = rect.top + rect.height / 2;
            const diff = Math.abs(viewportCenter - slideCenter);

            if (diff < minDiff) {
                minDiff = diff;
                activeIdx = idx;
            }
        });

        if (activeIdx !== currentActiveIndex) {
            currentActiveIndex = activeIdx;

            slides.forEach((slide, idx) => {
                const video = slide.querySelector("video");
                const iframe = slide.querySelector("iframe");

                if (idx !== activeIdx) {
                    // Pause inactive media
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                    if (iframe) {
                        postYoutubeCommand(iframe, "pauseVideo");
                    }
                }
            });

            if (typeof updateTopArrow === "function") {
                updateTopArrow(activeIdx);
            }
        }
    };

    // Listen to scroll to update media
    window.addEventListener("scroll", updateActiveMedia);
    // Also trigger on load
    setTimeout(updateActiveMedia, 150);

    // =============================================
    //  5. ACTIVE MEDIA & KEYBOARD CONTROLS
    // =============================================

    const getActiveVideoElement = () => {
        const activeSlide = slides[currentActiveIndex];
        return activeSlide?.querySelector('video');
    };

    const getActiveIframeElement = () => {
        const activeSlide = slides[currentActiveIndex];
        return activeSlide?.querySelector('iframe');
    };

    const iframePlayerStates = new WeakMap();

    const postYoutubeCommand = (iframe, command) => {
        if (!iframe?.contentWindow) return;
        let targetOrigin = '*';
        try {
            const url = new URL(iframe.src);
            targetOrigin = url.origin;
        } catch (error) {
        }
        const message = JSON.stringify({ event: 'command', func: command, args: [] });
        try {
            iframe.contentWindow.postMessage(message, targetOrigin);
        } catch (err) {
            try {
                iframe.contentWindow.postMessage(message, '*');
            } catch (err2) {
                console.warn('postYoutubeCommand failed', err2);
            }
        }
    };

    window.addEventListener('message', (event) => {
        if (!event.data) return;
        let data = event.data;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (err) {
                return;
            }
        }
        if (data.event !== 'onStateChange') return;

        const iframe = Array.from(document.querySelectorAll('iframe')).find(frame => frame.contentWindow === event.source);
        if (!iframe) return;

        iframePlayerStates.set(iframe, data.info);
    });

    const toggleActiveMediaPlayback = () => {
        const activeVideo = getActiveVideoElement();
        if (activeVideo) {
            if (activeVideo.paused) {
                activeVideo.play();
            } else {
                activeVideo.pause();
            }
            return;
        }

        const activeIframe = getActiveIframeElement();
        if (activeIframe) {
            const state = iframePlayerStates.get(activeIframe);
            if (state === 1) {
                postYoutubeCommand(activeIframe, 'pauseVideo');
            } else {
                postYoutubeCommand(activeIframe, 'playVideo');
            }
        }
    };

    const isMediaControlKey = (event) => {
        const mediaCodes = ['Space', 'MediaPlayPause', 'MediaPlay', 'MediaPause', 'MediaStop'];
        return mediaCodes.includes(event.code) || mediaCodes.includes(event.key);
    };

    document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        if (!isMediaControlKey(event)) return;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) return;

        event.preventDefault();
        toggleActiveMediaPlayback();
    });

    const updateTopArrow = (activeIndex) => {
        const threshold = window.innerWidth <= 1024 ? 1 : 2;
        if (activeIndex >= threshold) {
            gsap.to("#top-arr", { display: "flex", opacity: 1, duration: 0.3 });
        } else {
            gsap.to("#top-arr", { opacity: 0, display: "none", duration: 0.3 });
        }
    };

    // Initial arrow setup
    gsap.set("#top-arr", { opacity: 0, display: "none" });
    document.getElementById("top-arr").addEventListener("click", () => {
        if (window.lenis) {
            window.lenis.scrollTo(0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    });

    // =============================================
    //  7. HEADER LOGIC
    // =============================================

    const resetHeader = () => {
        const nav = document.getElementById("nav");
        const links = document.querySelectorAll(".list_item a");
        const menuImg = document.getElementById("menu-img");

        gsap.to(nav, { backgroundColor: "rgba(17, 17, 17, 0.3)", duration: 0.3, overwrite: "auto" });
        gsap.to(links, { color: "white", duration: 0.3 });
        if (menuImg) {
            menuImg.src = "src/assets/menu2.png";
        }
    };

    const setHeaderDark = () => {
        const nav = document.getElementById("nav");
        const links = document.querySelectorAll(".list_item a");
        const menuImg = document.getElementById("menu-img");

        gsap.to(nav, { backgroundColor: "#0a0a0a", duration: 0.3, overwrite: "auto" });
        gsap.to(links, { color: "black", duration: 0.3 });
        if (menuImg) {
            menuImg.src = "src/assets/menu2.png";
        }
    };

    // =============================================
    //  8. SCROLL TRIGGERS for header color
    // =============================================

    ScrollTrigger.create({
        trigger: ".page2",
        start: "top 50%",
        end: "bottom 50%",
        onEnter: setHeaderDark,
        onLeave: resetHeader,
        onEnterBack: setHeaderDark,
        onLeaveBack: resetHeader,
    });

    ScrollTrigger.refresh();

    // =============================================
    //  9. SCROLL PROGRESS BAR
    // =============================================
    const progressBar = document.getElementById("scroll-progress-bar");
    const progressNumber = document.getElementById("scroll-progress-number");
    
    const updateScrollProgress = () => {
        if (!progressBar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) {
            progressBar.style.height = "0%";
            if (progressNumber) {
                progressNumber.style.top = "0%";
                progressNumber.textContent = "";
            }
            return;
        }
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.height = `${Math.min(100, Math.max(0, progress))}%`;
        
        if (progressNumber && slides.length > 0) {
            progressNumber.style.top = `${Math.min(100, Math.max(0, progress))}%`;
            const currentIdx = currentActiveIndex >= 0 ? currentActiveIndex : 0;
            progressNumber.textContent = `${currentIdx + 1} / ${slides.length}`;
        }
    };

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress();
});