// Gestor de Portfolio dinámico
class PortfolioManager {
  constructor() {
    this.projects = []
    this.categories = []
    this.settings = {}
    this.currentFilter = "all"
    this.currentPage = 1
    this.isLoading = false
  }

  // Cargar datos del JSON
  async loadData() {
    try {
      this.showLoading(true)
      const response = await fetch("data/portfolio.json")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      this.projects = data.projects || []
      this.categories = data.categories || []
      this.settings = data.settings || {}

      console.log(`Cargados ${this.projects.length} proyectos`)

      this.initializePortfolio()
      this.showLoading(false)
    } catch (error) {
      console.error("Error cargando portfolio:", error)
      this.showError("Error al cargar los proyectos. Por favor, recarga la página.")
      this.showLoading(false)
    }
  }

  // Inicializar el portfolio
  initializePortfolio() {
    this.renderCategories()
    this.renderProjects()
    this.setupEventListeners()
  }

  // Renderizar categorías de filtro
  renderCategories() {
    const filterContainer = document.querySelector(".filter-buttons")
    if (!filterContainer) return

    filterContainer.innerHTML = ""

    this.categories.forEach((category) => {
      const button = document.createElement("button")
      button.className = `filter-btn ${category.id === this.currentFilter ? "active" : ""}`
      button.setAttribute("data-filter", category.id)
      button.textContent = category.name
      button.title = category.description

      filterContainer.appendChild(button)
    })
  }

  // Renderizar proyectos
  renderProjects() {
    const portfolioGrid = document.querySelector(".portfolio-grid")
    if (!portfolioGrid) return

    // Filtrar proyectos
    const filteredProjects = this.filterProjects(this.currentFilter)

    // Ordenar proyectos (destacados primero si está habilitado)
    if (this.settings.showFeaturedFirst) {
      filteredProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
    }

    // Limpiar grid
    portfolioGrid.innerHTML = ""

    // Renderizar cada proyecto
    filteredProjects.forEach((project) => {
      const projectElement = this.createProjectElement(project)
      portfolioGrid.appendChild(projectElement)
    })

    // Aplicar animaciones
    this.applyAnimations()
  }

  // Filtrar proyectos por categoría
  filterProjects(category) {
    if (category === "all") {
      return this.projects
    }

    return this.projects.filter((project) => project.categories.includes(category))
  }

  // Crear elemento HTML para un proyecto
  createProjectElement(project) {
    const projectDiv = document.createElement("div")
    projectDiv.className = "portfolio-item"
    projectDiv.setAttribute("data-category", project.categories.join(" "))

    // Agregar badge si es destacado
    const featuredBadge = project.featured ? '<div class="featured-badge">Destacado</div>' : ""

    // Agregar badge de estado
    const statusBadge = project.status === "ongoing" ? '<div class="status-badge ongoing">En Progreso</div>' : ""

    projectDiv.innerHTML = `
      <div class="portfolio-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        ${featuredBadge}
        ${statusBadge}
        <div class="portfolio-overlay">
          <div class="portfolio-info">
            <h4>${project.title}</h4>
            <p>${project.category}</p>
            <div class="project-meta">
              <span class="project-year">${project.year}</span>
              <span class="project-client">${project.client}</span>
            </div>
            <button class="view-project" onclick="portfolioManager.openModal('${project.id}')">
              Ver Proyecto
            </button>
            ${project.url ? `<a href="${project.url}" target="_blank" class="visit-site">Visitar Sitio</a>` : ""}
          </div>
        </div>
      </div>
    `

    return projectDiv
  }

  // Configurar event listeners
  setupEventListeners() {
    // Filtros
    document.querySelectorAll(".filter-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const filter = e.target.getAttribute("data-filter")
        this.setFilter(filter)
      })
    })

    // Búsqueda (si existe)
    const searchInput = document.querySelector("#portfolio-search")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchProjects(e.target.value)
      })
    }
  }

  // Cambiar filtro activo
  setFilter(filter) {
    this.currentFilter = filter

    // Actualizar botones activos
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active")

    // Re-renderizar proyectos
    this.renderProjects()
  }

  // Buscar proyectos
  searchProjects(query) {
    const portfolioGrid = document.querySelector(".portfolio-grid")
    const items = portfolioGrid.querySelectorAll(".portfolio-item")

    items.forEach((item) => {
      const title = item.querySelector("h4").textContent.toLowerCase()
      const category = item.querySelector("p").textContent.toLowerCase()

      if (title.includes(query.toLowerCase()) || category.includes(query.toLowerCase())) {
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
    })
  }

  // Abrir modal con detalles del proyecto
  openModal(projectId) {
    const project = this.projects.find((p) => p.id === projectId)
    if (!project) return

    const modal = document.getElementById("projectModal")
    const modalContent = document.getElementById("modalContent")

    if (!modal || !modalContent) return

    // Crear galería de imágenes
    const galleryHtml = project.gallery
      ? `<div class="project-gallery">
        ${project.gallery
          .map(
            (img, index) =>
              `<img src="${img}" alt="${project.title} - Imagen ${index + 1}" 
               onclick="portfolioManager.openImageViewer('${img}')">`,
          )
          .join("")}
      </div>`
      : ""

    // Crear enlaces
    const linksHtml = project.url
      ? `<div class="project-links">
        <a href="${project.url}" target="_blank" class="project-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
          </svg>
          Visitar Sitio Web
        </a>
      </div>`
      : ""

    modalContent.innerHTML = `
      <div class="project-header">
        <h2>${project.title}</h2>
        <div class="project-meta-detailed">
          <span class="project-category">${project.category}</span>
          <span class="project-year">${project.year}</span>
          <span class="project-duration">${project.duration}</span>
          <span class="project-client">${project.client}</span>
        </div>
      </div>
      
      ${galleryHtml}
      
      <div class="project-description">
        <p>${project.description}</p>
      </div>
      
      <div class="project-technologies">
        <h4>Tecnologías Utilizadas:</h4>
        <div class="tech-tags">
          ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
        </div>
      </div>
      
      <div class="project-results">
        <h4>Resultados Obtenidos:</h4>
        <ul class="results-list">
          ${project.results.map((result) => `<li><span class="result-icon">✓</span>${result}</li>`).join("")}
        </ul>
      </div>
      
      ${linksHtml}
    `

    modal.style.display = "block"
    document.body.style.overflow = "hidden"
  }

  // Cerrar modal
  closeModal() {
    const modal = document.getElementById("projectModal")
    if (modal) {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  }

  // Visor de imágenes
  openImageViewer(imageSrc) {
    const viewer = document.createElement("div")
    viewer.className = "image-viewer"
    viewer.innerHTML = `
      <div class="image-viewer-overlay" onclick="this.parentElement.remove()">
        <img src="${imageSrc}" alt="Vista ampliada">
        <button class="close-viewer" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `
    document.body.appendChild(viewer)
  }

  // Mostrar/ocultar loading
  showLoading(show) {
    let loader = document.querySelector(".portfolio-loader")

    if (show && !loader) {
      loader = document.createElement("div")
      loader.className = "portfolio-loader"
      loader.innerHTML = `
        <div class="loader-content">
          <div class="loader-spinner"></div>
          <p>Cargando proyectos...</p>
        </div>
      `
      document.querySelector(".portfolio-gallery").appendChild(loader)
    } else if (!show && loader) {
      loader.remove()
    }
  }

  // Mostrar error
  showError(message) {
    const errorDiv = document.createElement("div")
    errorDiv.className = "portfolio-error"
    errorDiv.innerHTML = `
      <div class="error-content">
        <h3>Error al cargar portfolio</h3>
        <p>${message}</p>
        <button onclick="portfolioManager.loadData()" class="retry-btn">Reintentar</button>
      </div>
    `
    document.querySelector(".portfolio-gallery").appendChild(errorDiv)
  }

  // Aplicar animaciones
  applyAnimations() {
    const items = document.querySelectorAll(".portfolio-item")
    items.forEach((item, index) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(30px)"

      setTimeout(() => {
        item.style.transition = "opacity 0.6s ease, transform 0.6s ease"
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
      }, index * 100)
    })
  }

  // Métodos para agregar/editar proyectos (para uso administrativo)
  addProject(projectData) {
    const newProject = {
      id: `project${this.projects.length + 1}`,
      ...projectData,
      featured: projectData.featured || false,
      status: projectData.status || "completed",
    }

    this.projects.push(newProject)
    this.renderProjects()

    console.log("Proyecto agregado:", newProject.title)
  }

  updateProject(projectId, updates) {
    const projectIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projectIndex !== -1) {
      this.projects[projectIndex] = { ...this.projects[projectIndex], ...updates }
      this.renderProjects()
      console.log("Proyecto actualizado:", projectId)
    }
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter((p) => p.id !== projectId)
    this.renderProjects()
    console.log("Proyecto eliminado:", projectId)
  }

  // Exportar datos actuales (para backup)
  exportData() {
    const data = {
      projects: this.projects,
      categories: this.categories,
      settings: this.settings,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()

    URL.revokeObjectURL(url)
  }
}

// Instancia global del gestor
const portfolioManager = new PortfolioManager()

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  portfolioManager.loadData()
})

// Funciones globales para compatibilidad
function openModal(projectId) {
  portfolioManager.openModal(projectId)
}

function closeModal() {
  portfolioManager.closeModal()
}
