gsap.registerPlugin(ScrollTrigger);
// Initialize Lenis
window.lenis = new Lenis({
  smooth: true,
  duration: 1,
  wheelMultiplier: 1,
  smoothTouch: true,
  touchMultiplier: 1,
});

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  if (window.lenis) {
    window.lenis.raf(time);
  }
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

//for intro text
gsap.from(".beyond", {
  scale: 5,
  duration: 1.5,
  y: -300,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".background-text",
    scroller: "[data-container-scroll]",
    // markers: true,
    start: "top 50%",
    end: "top 0%",
    toggleActions: "play none none reverse",
  },
});
gsap.from(".horizon", {
  x: 300,
  scale: 5,
  duration: 1.5,
  opacity: 0,
  //   scale: 0.5,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".background-text",
    scroller: "[data-container-scroll]",
    // markers: true,
    start: "top 50%",
    end: "top 0%",
    toggleActions: "play none none reverse",
  },
});
// intro image animation
gsap.from(".intro-img", {
  y : -300,
  scale: 5,
  opacity: 0,
  duration:1,
  ease: "power2.out",
  smoothTouch: true,
   scrollTrigger: {
    trigger: ".background-text",
    scroller: "[data-container-scroll]",
    // markers: true,
    start: "top 50%",
    end: "top 0%",
    toggleActions: "play none none reverse",
  }
});
// scroll animation for home page
// let el = document.querySelector(".wrapper");
// if (!el) {
//   console.log("wrapper not found !!");
// } else {
//   gsap.to(".wrapper", {
//     y: "-40vh", // better responsive movement
//     ease: "none",
//     scrollTrigger: {
//       trigger: ".wrapper",
//       scroller: "[data-container-scroll]",
//       start: "top 90%",
//       end: "top 20%",
//       scrub: 0.2, // <-- key for natural load/unload effect
//       // markers: true,
//       toggleActions: "play none none reverse",
//       onUpdate: (self) => {
//         // reduce the gap behind the element
//         el.style.marginBottom = `-${self.progress * 20}vh`;
//       },
//     },
//   });
// }
// // drag anywhere the object and laod container
// ScrollTrigger.matchMedia({
//   "(min-width : 769px)": function () {
//     Draggable.create(".wrapper, .intro-img", {
//       type: "x,y",
//       bounds: window,
//       inertia: true,
//     });
//   },
// });
// // mobile scroll animation for home page
// 
//     // drag anywhere the object and laod container
//     Draggable.create(".intro-img", {
//       type: "x,y",
//       bounds: window,
//       inertia: true,
//     });
//     if (!el) {
//       console.log("wrapper not found !!");
//     } else {
//       gsap.to(".wrapper", {
//       marginTop: "-20vh", // move element up
//         ease: "none",
//         scrollTrigger: {
//           trigger: ".wrapper",
//           scroller: "[data-container-scroll]",
//           start: "top 90%",
//           end: "top top",
//           // markers : true ,
//           scrub: 0.5  ,
//           toggleActions: "play none none reverse",
//           // onUpdate: (self) => {
//           //   // reduce the gap behind the element
//           //   el.style.marginBottom = `-${self.progress * 20}vh`;
//           // },
//         },
//       });
//     }
//   },
// });

// PARA 1 animation
// gsap.from(".para-1 p", {
//   y: "50px",
//   opacity: 0,
//   duration: 1.5,
//   smoothTouch: true,
//   ease: "power2.out",
//   scrollTrigger: {
//     trigger: ".para-1",
//     scroller: "[data-container-scroll]",
//     markers: true,
//     start: "top bottom",
//     end: "top 30%",
//     toggleActions: "play none none reverse",
//   },
// });

// PARA 2 animation
// gsap.from(".para-2 p", {
//   y: "50px",
//   opacity: 0,
//   duration: 1.5,
//   smoothTouch: true,
//   ease: "power2.out",
//   scrollTrigger: {
//     trigger: ".para-2",
//     scroller: "[data-container-scroll]",
//     // markers: true,
//     start: "top bottom%",
//     end: "top 30%",
//     toggleActions: "play none none reverse",
//   },
// });

// redirect-para animation
// gsap.from(".redirect-para span", {
//   y: "50px",
//   opacity: 0,
//   duration: 1.5,
//   smoothTouch: true,
//   ease: "power2.out",
//   scrollTrigger: {
//     trigger: ".redirect-para",
//     scroller: "[data-container-scroll]",
//     // markers: true,
//     start: "top bottom",
//     end: "top 30%",
//     toggleActions: "play none none reverse",
//   },
// });

// ****************CONTACT FORM ANIMATION***************************
gsap.from(".left-content", {
  //   x: -500,
  scale: 0,
  opacity: 0,
  duration: 1.5,
  ease: "power2.out",
});
gsap.from(".divider", {
  opacity: 0,
  duration: 2,
});
gsap.from(".contact-form", {
  scale: 0,
  opacity: 0,
  duration: 1.5,
  ease: "power2.out",
});
// tl.from(".box2" , {
//     x : 100 ,
//     opacity : 0 ,
//     duration : 0.5 ,

// })
// tl.from(".box3" , {
//     x : 100 ,
//     opacity : 0 ,
//     duration : 0.5 ,

// })
// tl.from(".box4" , {
//     x : 100 ,
//     opacity : 0 ,
//     duration : 0.5 ,

// })
// tl.from(".box5" , {
//     x : 100 ,
//     opacity : 0 ,
//     duration : 0.5 ,

// })
const ele = document.querySelectorAll(".project");
console.log(ele);

// animation after clicking
ele.forEach((item) => {
  item.addEventListener("click", () => {
    if (item == ele[0]) {
      gsap.from(".project1 img", {
        scale: 1.5,
        duration: 0.5,
        ease: "power2.in",
      });
      setTimeout(() => {
        window.location.href = "Product_details.html?id=product_1";
      }, 500);
    } else {
      gsap.from(".project2 img", {
        scale: 1.5,
        duration: 0.5,
        ease: "power2.in",
      });
      setTimeout(() => {
        window.location.href = "Product_details.html?id=product_2";
      }, 500);
    }
  });
});

// animation after loading
gsap.from(".project1", {
  x: -1250,
  duration: 1.5,
  ease: "power2.out",
   scrollTrigger :{
    trigger : ".project1" ,
    scroller: "[data-container-scroll]",
    toggleActions: "play none none reverse",
    // markers : true,
    // start : "top 10%"
  }
});
gsap.from(".project2", {
  x: 1250,
  duration: 1.5,
  ease: "power2.out",
   scrollTrigger :{
    trigger : ".project2" ,
    scroller: "[data-container-scroll]",
    toggleActions: "play none none reverse",
    // markers : true,
    // start : "top 10%"
  }
});

// mobile menu
// Ensure menu button and mobile menu are never affected by GSAP
if (window.gsap) {
  gsap.set("#menuBtn, .mobile-menu, .body-menu-overlay", {
    clearProps: "all",
  });
}

// Integrate Lenis with ScrollTrigger
if (window.lenis && window.ScrollTrigger) {
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// home page nav items
gsap.to(".list_item a" , {
    color : "black" , 
  scrollTrigger :{
    trigger : ".home-para" ,
    scroller: "[data-container-scroll]",
    toggleActions: "play none none reverse",
    // markers : true,
    start : "top 10%"
  }
  
});

