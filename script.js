// Variables globales
let currentSlide = 0
const slides = document.querySelectorAll(".carousel-slide")
const totalSlides = slides.length

// Función para cambiar slides del carrusel
function changeSlide(direction) {
  if (slides.length === 0) return

  slides[currentSlide].classList.remove("active")

  currentSlide += direction

  if (currentSlide >= totalSlides) {
    currentSlide = 0
  } else if (currentSlide < 0) {
    currentSlide = totalSlides - 1
  }

  slides[currentSlide].classList.add("active")
}

// Auto-play del carrusel
function autoSlide() {
  if (slides.length > 0) {
    changeSlide(1)
  }
}

// Iniciar auto-play cada 5 segundos
let slideInterval
if (slides.length > 0) {
  slideInterval = setInterval(autoSlide, 5000)
}

// Pausar auto-play cuando el usuario interactúa
function pauseAutoSlide() {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = setInterval(autoSlide, 5000)
  }
}

// Event listeners para los botones del carrusel
const prevBtn = document.querySelector(".carousel-btn.prev")
const nextBtn = document.querySelector(".carousel-btn.next")

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    changeSlide(-1)
    pauseAutoSlide()
  })
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    changeSlide(1)
    pauseAutoSlide()
  })
}

// Navegación móvil
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })
}

// Cerrar menú móvil al hacer click en un enlace
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    if (hamburger && navMenu) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }
  }),
)

// Smooth scrolling para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Formulario de contacto
const contactForm = document.getElementById("contactForm")
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Obtener datos del formulario
    const formData = new FormData(this)
    const data = Object.fromEntries(formData)

    // Validación básica
    if (!data.nombre || !data.email || !data.mensaje) {
      alert("Por favor, completa todos los campos obligatorios.")
      return
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      alert("Por favor, ingresa un email válido.")
      return
    }

    // Simular envío del formulario
    const submitBtn = this.querySelector(".submit-btn")
    const originalText = submitBtn.textContent

    submitBtn.textContent = "Enviando..."
    submitBtn.disabled = true

    // Simular delay de envío
    setTimeout(() => {
      alert("¡Gracias por tu mensaje! Te contactaremos pronto.")
      this.reset()
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }, 2000)
  })
}

// Animación del carrusel de logos
function duplicateLogos() {
  const logosTrack = document.querySelector(".logos-track")
  if (logosTrack) {
    const logos = logosTrack.innerHTML
    logosTrack.innerHTML = logos + logos // Duplicar para efecto infinito
  }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  duplicateLogos()

  // Intersection Observer para animaciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observar elementos para animación
  document.querySelectorAll(".split-content, .text-content, .cta-content").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})

// Manejo del scroll para navbar
let lastScrollTop = 0
const navbar = document.querySelector(".navbar")

if (navbar) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      navbar.style.transform = "translateY(-100%)"
    } else {
      // Scrolling up
      navbar.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })

  // Añadir transición al navbar
  navbar.style.transition = "transform 0.3s ease"
}

// Control de teclado para el carrusel
document.addEventListener("keydown", (e) => {
  if (slides.length > 0) {
    if (e.key === "ArrowLeft") {
      changeSlide(-1)
      pauseAutoSlide()
    } else if (e.key === "ArrowRight") {
      changeSlide(1)
      pauseAutoSlide()
    }
  }
})

// Pausar carrusel cuando no está visible
document.addEventListener("visibilitychange", () => {
  if (slides.length > 0) {
    if (document.hidden) {
      clearInterval(slideInterval)
    } else {
      slideInterval = setInterval(autoSlide, 5000)
    }
  }
})

// Funcionalidad para filtros del portafolio
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remover clase active de todos los botones
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        // Agregar clase active al botón clickeado
        button.classList.add("active")

        const filterValue = button.getAttribute("data-filter")

        portfolioItems.forEach((item) => {
          if (filterValue === "all") {
            item.style.display = "block"
            setTimeout(() => {
              item.style.opacity = "1"
              item.style.transform = "scale(1)"
            }, 100)
          } else {
            const itemCategories = item.getAttribute("data-category")
            if (itemCategories && itemCategories.includes(filterValue)) {
              item.style.display = "block"
              setTimeout(() => {
                item.style.opacity = "1"
                item.style.transform = "scale(1)"
              }, 100)
            } else {
              item.style.opacity = "0"
              item.style.transform = "scale(0.8)"
              setTimeout(() => {
                item.style.display = "none"
              }, 300)
            }
          }
        })
      })
    })

    // Inicializar estilos de transición
    portfolioItems.forEach((item) => {
      item.style.transition = "opacity 0.3s ease, transform 0.3s ease"
    })
  }
})

// Funcionalidad para modal de proyectos
function openModal(projectId) {
  const modal = document.getElementById("projectModal")
  const modalContent = document.getElementById("modalContent")

  if (!modal || !modalContent) return

  // Contenido específico para cada proyecto
  const projectData = {
    project1: {
      title: "TechStore Online",
      category: "E-commerce • Branding",
      description:
        "Desarrollo completo de una tienda online moderna con sistema de gestión de inventario, carrito de compras y pasarela de pagos integrada.",
      image: "/placeholder.svg?height=400&width=600&text=TechStore+Online",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      results: [
        "Aumento del 150% en ventas online",
        "Reducción del 40% en tiempo de carga",
        "Mejora del 60% en conversión",
      ],
    },
    project2: {
      title: "Restaurante Sabores",
      category: "Identidad de Marca",
      description:
        "Creación de identidad visual completa para restaurante, incluyendo logotipo, menús, señalética y material promocional.",
      image: "/placeholder.svg?height=400&width=600&text=Restaurante+Sabores",
      technologies: ["Adobe Illustrator", "Photoshop", "InDesign"],
      results: [
        "Incremento del 80% en reconocimiento de marca",
        "Aumento del 45% en reservas",
        "Mejora en percepción de calidad",
      ],
    },
    project3: {
      title: "Corporativo Innovar",
      category: "Sitio Web Corporativo",
      description:
        "Diseño y desarrollo de sitio web corporativo con enfoque en generación de leads y presentación de servicios profesionales.",
      image: "/placeholder.svg?height=400&width=600&text=Corporativo+Innovar",
      technologies: ["WordPress", "PHP", "MySQL", "SEO"],
      results: [
        "Aumento del 200% en leads calificados",
        "Mejora del 70% en tiempo de permanencia",
        "Posicionamiento en top 3 de Google",
      ],
    },
    project4: {
      title: "Campaña Verano 2024",
      category: "Marketing Digital • Gráfico",
      description:
        "Campaña integral de marketing digital para temporada de verano, incluyendo redes sociales, email marketing y publicidad online.",
      image: "/placeholder.svg?height=400&width=600&text=Campaña+Verano+2024",
      technologies: ["Facebook Ads", "Instagram", "Mailchimp", "Analytics"],
      results: ["Alcance de 500K personas", "Engagement rate del 8.5%", "ROI del 320%"],
    },
    project5: {
      title: "Startup EcoTech",
      category: "Branding • Packaging",
      description:
        "Desarrollo de marca para startup de tecnología ecológica, incluyendo naming, identidad visual y diseño de packaging sostenible.",
      image: "/placeholder.svg?height=400&width=600&text=Startup+EcoTech",
      technologies: ["Branding", "Packaging Design", "Sustainability"],
      results: [
        "Lanzamiento exitoso en 3 países",
        "Reconocimiento en premios de diseño",
        "Inversión de $2M conseguida",
      ],
    },
    project6: {
      title: "Portfolio Artista",
      category: "Sitio Web Personal",
      description:
        "Sitio web portfolio para artista visual con galería interactiva, blog y tienda online para venta de obras.",
      image: "/placeholder.svg?height=400&width=600&text=Portfolio+Artista",
      technologies: ["HTML5", "CSS3", "JavaScript", "Lightbox"],
      results: [
        "Aumento del 300% en ventas online",
        "Exposiciones internacionales",
        "Crecimiento de seguidores del 250%",
      ],
    },
    project7: {
      title: "Conferencia Tech 2024",
      category: "Branding de Evento",
      description:
        "Identidad visual completa para conferencia de tecnología, incluyendo branding, señalética, merchandising y material digital.",
      image: "/placeholder.svg?height=400&width=600&text=Conferencia+Tech+2024",
      technologies: ["Event Branding", "Print Design", "Digital Assets"],
      results: ["1,500 asistentes", "95% satisfacción del evento", "Cobertura mediática nacional"],
    },
    project8: {
      title: "FitLife App",
      category: "App Design • Branding",
      description:
        "Diseño UX/UI para aplicación móvil de fitness con seguimiento de entrenamientos, nutrición y comunidad social.",
      image: "/placeholder.svg?height=400&width=600&text=FitLife+App",
      technologies: ["Figma", "Sketch", "Principle", "User Testing"],
      results: ["50K descargas en primer mes", "4.8 estrellas en App Store", "Retención del 75% a 30 días"],
    },
    project9: {
      title: "Revista Lifestyle",
      category: "Diseño Editorial",
      description:
        "Diseño editorial para revista mensual de estilo de vida, incluyendo layout, tipografía y dirección de arte fotográfica.",
      image: "/placeholder.svg?height=400&width=600&text=Revista+Lifestyle",
      technologies: ["InDesign", "Photoshop", "Typography", "Print Production"],
      results: ["Aumento del 40% en circulación", "Premio de diseño editorial", "Expansión a formato digital"],
    },
  }

  const project = projectData[projectId]

  if (project) {
    modalContent.innerHTML = `
            <h2>${project.title}</h2>
            <p class="project-category">${project.category}</p>
            <img src="${project.image}" alt="${project.title}" style="width: 100%; margin: 20px 0; border-radius: 10px;">
            <p style="margin: 20px 0; line-height: 1.6; color: #666;">${project.description}</p>
            
            <div style="margin: 30px 0;">
                <h4 style="margin-bottom: 15px; color: #333;">Tecnologías Utilizadas:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${project.technologies.map((tech) => `<span style="background: #f8f9fa; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem; color: #666;">${tech}</span>`).join("")}
                </div>
            </div>
            
            <div style="margin: 30px 0;">
                <h4 style="margin-bottom: 15px; color: #333;">Resultados Obtenidos:</h4>
                <ul style="list-style: none; padding: 0;">
                    ${project.results.map((result) => `<li style="padding: 8px 0; color: #666; position: relative; padding-left: 25px;"><span style="position: absolute; left: 0; color: #333; font-weight: bold;">✓</span>${result}</li>`).join("")}
                </ul>
            </div>
        `

    modal.style.display = "block"
    document.body.style.overflow = "hidden"
  }
}

function closeModal() {
  const modal = document.getElementById("projectModal")
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// Cerrar modal al hacer click fuera de él
window.addEventListener("click", (event) => {
  const modal = document.getElementById("projectModal")
  if (event.target === modal) {
    closeModal()
  }
})

// Cerrar modal con tecla Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal()
  }
})
