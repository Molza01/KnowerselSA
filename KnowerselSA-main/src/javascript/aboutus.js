document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar")
    if (navbar && window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else if (navbar) {
      navbar.classList.remove("scrolled")
    }
  })

  // Contact form handling
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const message = document.getElementById("message").value

      // Simple form validation
      if (!name || !email) {
        alert("Please fill in all required fields.")
        return
      }

      // Here you would typically send the form data to a server
      alert("Thank you for your message! We will get back to you soon.")

      // Reset form
      this.reset()
    })
  }
})

// Page navigation
function showPage(pageId) {
  // Hide all sections
  const sections = document.querySelectorAll(".page-section")
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  // Show selected section
  const targetSection = document.getElementById(pageId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Scroll to top
  window.scrollTo(0, 0)
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
  const navLinks = document.querySelector(".nav-links")
  if (navLinks) {
    navLinks.classList.toggle("active")
  }
}
// AFTER ARROW CLICKING EFFECT 
document.addEventListener("DOMContentLoaded", () => {
    const arrow = document.getElementById("arrow");
    const main = document.querySelector(".main-content");
    const footer = document.querySelector(".footer");

    if (main) {
        main.classList.remove("show");
        main.style.display = "none";
        footer.style.display = "none"
    }

    if (!arrow || !main) return;

    arrow.addEventListener("click", () => {
        footer.style.display = "grid"
        main.style.display = "block";
        requestAnimationFrame(() => {
            main.classList.add("show");
        });
        setTimeout(() => {
            main.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);

        arrow.style.display = "none";
    });
});


