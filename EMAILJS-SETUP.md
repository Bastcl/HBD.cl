# Configuración de EmailJS para el Formulario de Contacto

## 📧 Pasos para Configurar EmailJS

### 1. Crear Cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate con tu email
3. Verifica tu cuenta

### 2. Configurar Servicio de Email
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. **Guarda el Service ID** que se genera

### 3. Crear Template de Email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa este template como base:

\`\`\`html
Asunto: Nuevo mensaje de contacto - {{from_name}}

Hola {{to_name}},

Has recibido un nuevo mensaje de contacto desde tu sitio web:

👤 Nombre: {{from_name}}
📧 Email: {{from_email}}
📱 Teléfono: {{phone}}
🏢 Empresa: {{company}}
🛠️ Servicio: {{service}}
💰 Presupuesto: {{budget}}

📝 Mensaje:
{{message}}

---
Este mensaje fue enviado desde el formulario de contacto de tu sitio web.
\`\`\`

4. **Guarda el Template ID** que se genera

### 4. Obtener Public Key
1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key**

### 5. Configurar el Código
Reemplaza los valores en `emailjs-config.js`:

\`\`\`javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "tu_public_key_real",
    SERVICE_ID: "tu_service_id_real", 
    TEMPLATE_ID: "tu_template_id_real"
}
\`\`\`

### 6. Actualizar HTML
Agrega la referencia al archivo de configuración en `contacto.html`:

\`\`\`html
<script src="emailjs-config.js"></script>
\`\`\`

## 🔧 Variables del Template

Las siguientes variables están disponibles en tu template:

- `{{from_name}}` - Nombre del contacto
- `{{from_email}}` - Email del contacto  
- `{{phone}}` - Teléfono (opcional)
- `{{company}}` - Empresa (opcional)
- `{{service}}` - Servicio de interés
- `{{budget}}` - Presupuesto estimado
- `{{message}}` - Mensaje del contacto
- `{{to_name}}` - Nombre de tu agencia

## 📊 Límites del Plan Gratuito

- **200 emails/mes** en el plan gratuito
- Para más emails, considera upgrading a un plan pago
- Monitorea tu uso en el dashboard de EmailJS

## 🛠️ Personalización Adicional

### Respuesta Automática
Puedes crear un segundo template para enviar una respuesta automática al cliente:

1. Crea un nuevo template con el cliente como destinatario
2. Modifica el JavaScript para enviar dos emails (uno a ti, otro al cliente)

### Validaciones Adicionales
Puedes agregar más validaciones en el JavaScript:

\`\`\`javascript
// Validar teléfono
if (data.telefono && !/^\+?[\d\s\-$$$$]+$/.test(data.telefono)) {
    showNotification("Por favor, ingresa un teléfono válido.", "error")
    return
}

// Validar longitud del mensaje
if (data.mensaje.length < 10) {
    showNotification("El mensaje debe tener al menos 10 caracteres.", "error")
    return
}
\`\`\`

## 🚨 Seguridad

- Tu Public Key es seguro para usar en el frontend
- Nunca expongas tu Private Key
- Configura las restricciones de dominio en EmailJS para mayor seguridad

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador para errores
2. Verifica que todos los IDs sean correctos
3. Consulta la documentación de EmailJS: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
