// Configuración de EmailJS
// IMPORTANTE: Reemplaza estos valores con los tuyos reales de EmailJS

const EMAILJS_CONFIG = {
  // Tu Public Key de EmailJS (obtenido de tu dashboard)
  PUBLIC_KEY: "TU_PUBLIC_KEY_AQUI",

  // Tu Service ID (configurado en EmailJS)
  SERVICE_ID: "TU_SERVICE_ID_AQUI",

  // Tu Template ID (creado en EmailJS)
  TEMPLATE_ID: "TU_TEMPLATE_ID_AQUI",
}

// Declaración de la variable emailjs
let emailjs

// Función para inicializar EmailJS
function initEmailJS() {
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    console.log("EmailJS inicializado correctamente")
  } else {
    console.error("EmailJS no está cargado")
  }
}

// Función para enviar email
function sendEmail(templateParams) {
  return emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initEmailJS)
