document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm")
  const subjectInput = document.getElementById("subject")
  const inputs = document.querySelectorAll(".form-input, .form-textarea")
  const userName = document.getElementById("name")

  // Add focus effects to form inputs
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.style.transform = "scale(1.02)"
    })

    input.addEventListener("blur", function () {
      this.style.transform = "scale(1)"
    })
  })

  // Phone number validation: allow only numbers
  const phoneInput = document.querySelector('input[name="tel"]')
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, '')
    })
  }

  // Handle form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = userName.value.trim() || ""
    const email = contactForm.querySelector('input[name="email"]').value.trim() || ""
    subjectInput.value = `New message from ${name}`
    const formData = new FormData(contactForm)

    // Basic validation
    if (!name || !email) {
      alert("Please fill in all required fields (Name and Email)")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address")
      return
    }

    const sendButton = contactForm.querySelector(".send-button")
    const originalText = sendButton.innerHTML
    sendButton.innerHTML = "Sending..."
    sendButton.disabled = true

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
      const result = await response.json().catch(() => ({}))

      if (response.ok && result.success !== false) {
        alert("Thank you for your message! We will get back to you soon.")
        contactForm.reset()
      } else {
        alert(result.message || "Something went wrong. Please try again later.")
      }
    } catch (err) {
      alert("Network error — please check your connection and try again.")
      console.error("Contact form submission failed:", err)
    } finally {
      sendButton.innerHTML = originalText
      sendButton.disabled = false
    }
  })

  // Add smooth hover effects to navigation links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateY(-2px)"
      }
    })

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Add click effect to send button
  const sendButton = document.querySelector(".send-button")
  sendButton.addEventListener("mousedown", function () {
    this.style.transform = "scale(0.98)"
  })

  sendButton.addEventListener("mouseup", function () {
    this.style.transform = "scale(1)"
  })
})