
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("nav");
  const right_section = document.getElementById("nav-right")
  const scrollPosition = window.scrollY;

  // Define the scroll threshold (e.g., 50 pixels)
  if (scrollPosition > 50) {
    // Add the 'scrolled' class if the user has scrolled past the threshold
    navbar.classList.add("scrolled");
  } else {
    // Remove the 'scrolled' class if the user scrolls back to the top
    navbar.classList.remove("scrolled");
  }
});
// *****************end ******************************


// ****************MOBILE MENU ***********************
(function () {
  // IDs/classes used in your HTML
  const MENU_ID = "mobileMenu";
  const MENU_BTN_ID = "menuBtn";

  // find elements
  const menu = document.getElementById(MENU_ID);
  const menuBtn = document.getElementById(MENU_BTN_ID);

  if (!menu || !menuBtn) {
    console.warn("Mobile menu or button not found. Make sure #mobileMenu and #menuBtn exist.");
    return;
  }

  // 1) Move menu element to document.body so it's outside stacked/pinned containers
  if (menu.parentElement !== document.body) {
    document.body.appendChild(menu);
  }

  // ensure dialog wrapper in menu for centered modal style
  let menuDialog = menu.querySelector(".mobile-menu-dialog");
  if (!menuDialog) {
    menuDialog = document.createElement("div");
    menuDialog.className = "mobile-menu-dialog";
    while (menu.firstChild) {
      menuDialog.appendChild(menu.firstChild);
    }
    menu.appendChild(menuDialog);
  }

  // create a close button in the dialog if not present
  let closeButton = menuDialog.querySelector(".mobile-menu-close-btn");
  if (!closeButton) {
    closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "mobile-menu-close-btn";
    closeButton.setAttribute("aria-label", "Close menu");
    closeButton.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    menuDialog.appendChild(closeButton);
  }

  // 2) create (or reuse) overlay for dimming and outside-click
  let overlay = document.querySelector(".body-menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "body-menu-overlay";
    document.body.appendChild(overlay);
  }

  // helper state
  let isOpen = false;

  function openMenu() {
    const rect = menuBtn.getBoundingClientRect();
    const topOffset = rect.bottom + 8;
    const rightOffset = window.innerWidth - rect.right + 8;

    menuDialog.style.position = "absolute";
    menuDialog.style.top = `${topOffset}px`;
    menuDialog.style.right = `${rightOffset}px`;

    menu.classList.add("open");
    overlay.classList.add("visible");
    menuBtn.style.visibility = "hidden";
    // lock body scroll
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    isOpen = true;
  }

  function closeMenu() {
    menu.classList.remove("open");
    overlay.classList.remove("visible");
    menuBtn.style.visibility = "visible";
    // restore scroll
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    isOpen = false;
  }

  // toggle on button click (stopPropagation so doc click doesn't close instantly)
  menuBtn.addEventListener("click", function (ev) {
    ev.stopPropagation();
    if (isOpen) closeMenu();
    else openMenu();
  }, { passive: true });

  // close when clicking overlay
  overlay.addEventListener("click", () => closeMenu(), { passive: true });

  // close when clicking outside the dialog (on the menu container)
  menu.addEventListener("click", function (e) {
    if (!menuDialog.contains(e.target)) {
      closeMenu();
    }
  }, { passive: true });

  // close when clicking outside the menu (anywhere in document) - but since menu is full screen, this won't trigger, so remove it
  // document.addEventListener("click", function (e) {
  //   if (!isOpen) return;
  //   if (menu.contains(e.target) || menuBtn.contains(e.target)) return;
  //   closeMenu();
  // }, { passive: true });

  // close on Esc key
  document.addEventListener("keydown", function (e) {
    if (isOpen && e.key === "Escape") closeMenu();
  });

  // close when clicking the close button or any link inside menu
  closeButton.addEventListener("click", () => closeMenu());
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeMenu());
  });

  // On SPA navigation or page updates you might re-attach menu to body again:
  // (Optional) observe DOM mutations if menu gets re-inserted somewhere else
})();

// hover effect for mobile
document.querySelectorAll(".socials-items").forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

// Dynamic header/footer logo selection by theme (black/white backgrounds)
function setLogoImagesByTheme() {
  const logoBase = "src/assets/logos/";
  const headerLogo = document.querySelector(".nav-left-section img");
  const footerLogo = document.querySelector("footer .logo img");
  const nav = document.getElementById("nav");
  const footer = document.querySelector("footer");

  if (!headerLogo || !footerLogo || !nav || !footer) return;

  function parseRgb(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
  }

  function isDarkColor(color) {
    const rgb = parseRgb(color);
    if (!rgb) return false;
    const [r, g, b] = rgb.map(c => c / 255);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum < 0.5;
  }

  function getBackgroundColor(element) {
    const style = window.getComputedStyle(element);
    if (!style) return "rgba(0,0,0,0)";
    const bg = style.backgroundColor;
    if (bg && bg !== "transparent" && !bg.startsWith("rgba(0, 0, 0, 0)")) {
      return bg;
    }
    if (element.parentElement) {
      return getBackgroundColor(element.parentElement);
    }
    return "rgba(0, 0, 0, 0)";
  }

  // header uses TL icons (aboutus white, contact black, product black with white footer, others switch on scroll)
  const currentPath = window.location.pathname.toLowerCase();
  const productMode = currentPath.includes("product.html") || currentPath.includes("product_details.html") || currentPath.includes("product_details") || currentPath.includes("product-");
  const isHeaderBlur = nav.classList.contains("scrolled");
  const isAboutOrContent = currentPath.includes("aboutus.html") || currentPath.includes("content.html");

  if (currentPath.includes("aboutus.html")) {
    headerLogo.src = logoBase + "TL1.2.png"; // white logo
  } else if (currentPath.includes("contact.html")) {
    headerLogo.src = logoBase + "TL2.1.png"; // black logo
  } else if (currentPath.includes("content.html")) {
    headerLogo.src = logoBase + "TL1.2.png"; // content page header white
  } else if (productMode) {
    headerLogo.src = logoBase + "TL2.1.png"; // product page header black
  } else {
    headerLogo.src = isHeaderBlur ? logoBase + "TL2.1.png" : logoBase + "TL1.2.png";
  }

  const menuImage = document.getElementById("menu-img") || document.querySelector("#menuBtn img");
  if (menuImage) {
    if (isAboutOrContent) {
      if (isHeaderBlur) {
        menuImage.classList.add("menu-icon-black");
      } else {
        menuImage.classList.remove("menu-icon-black");
      }
    } else {
      menuImage.classList.remove("menu-icon-black");
    }
  }

  // footer uses BL icons
  if (currentPath.includes("aboutus.html")) {
    footerLogo.src = logoBase + "BL2.png"; // aboutus footer black
  } else if (currentPath.includes("content.html")) {
    footerLogo.src = logoBase + "BL2.png"; // content page footer black
  } else if (productMode) {
    footerLogo.src = logoBase + "BL1.1.png"; // product footer white
  } else {
    const footerBg = getBackgroundColor(footer);
    const footerIsDark = isDarkColor(footerBg);
    footerLogo.src = footerIsDark ? logoBase + "BL1.1.png" : logoBase + "BL2.png";
  }
}

// Set on load and whenever nav class changes (as in scroll transitions)
window.addEventListener("load", setLogoImagesByTheme);
window.addEventListener("scroll", () => {
  setLogoImagesByTheme();
});

// Re-run after 300ms to handle dynamic class toggles
setInterval(setLogoImagesByTheme, 300);

