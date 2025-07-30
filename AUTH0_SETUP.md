# Configuración de Auth0 y Brevo para Reset de Contraseña

## Variables de Entorno Requeridas

Para que la funcionalidad de cambio de contraseña funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

```env
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN'
AUTH0_CLIENT_ID='your_auth0_client_id'
AUTH0_CLIENT_SECRET='your_auth0_client_secret'
AUTH0_DOMAIN='your_auth0_domain.auth0.com'

# Contentful Configuration
CONTENTFUL_SPACE_ID='your_contentful_space_id'
CONTENTFUL_API_TOKEN='your_contentful_api_token'

# Brevo (Email Service) Configuration
BREVO_API_KEY='your_brevo_api_key'
```

## Pasos para Configurar Auth0

### 1. Crear una aplicación en Auth0
1. Ve a tu dashboard de Auth0
2. Crea una nueva aplicación o usa una existente
3. Configura la aplicación como "Single Page Application" o "Regular Web Application"

### 2. Configurar las URLs permitidas
- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
- **Allowed Logout URLs**: `http://localhost:3000`
- **Allowed Web Origins**: `http://localhost:3000`

### 3. Obtener las credenciales
- **Domain**: Se encuentra en la configuración de tu aplicación
- **Client ID**: Se encuentra en la configuración de tu aplicación
- **Client Secret**: Se encuentra en la configuración de tu aplicación

### 4. Configurar la API de Management
1. Ve a "APIs" en tu dashboard de Auth0
2. Busca "Auth0 Management API"
3. Asegúrate de que tu aplicación tenga los siguientes scopes:
   - `read:users`
   - `update:users`
   - `create:user_tickets`

### 5. Configurar el template de email
1. Ve a "Email Templates" en tu dashboard de Auth0
2. Configura el template "Password Reset"
3. Asegúrate de que el template esté habilitado

## Configuración de Brevo (Email Service)

### 1. Crear cuenta en Brevo
1. Ve a [Brevo](https://www.brevo.com/) y crea una cuenta
2. Verifica tu dominio de email
3. Crea una API key con permisos de envío de emails

### 2. Configurar template de email
1. Ve a "Templates" en tu dashboard de Brevo
2. Crea un nuevo template para reset de contraseña
3. Usa la variable `{{ params.reset_password_url }}` para el enlace de reset
4. Anota el ID del template (se usará como `templateId: 1`)

### 3. Configurar variables de entorno
Asegúrate de que `BREVO_API_KEY` esté configurada en tu archivo `.env.local`:

```env
BREVO_API_KEY='your_brevo_api_key_here'
```

## Solución de Problemas

### Error 500 en Reset Password
Si obtienes un error 500 al intentar cambiar la contraseña, verifica:

1. **Variables de entorno**: Asegúrate de que todas las variables de Auth0 y Brevo estén configuradas
2. **Permisos de la API**: Verifica que tu aplicación tenga los scopes necesarios
3. **Configuración de la aplicación**: Asegúrate de que las URLs estén configuradas correctamente
4. **Logs del servidor**: Revisa los logs para ver errores específicos

### Error 500 en SendEmailTemplate
Si obtienes un error 500 en la API de envío de emails:

1. **Verifica BREVO_API_KEY**: Asegúrate de que la variable esté configurada correctamente
2. **Verifica el template**: Asegúrate de que el template con ID 1 exista en Brevo
3. **Verifica el dominio**: Asegúrate de que tu dominio esté verificado en Brevo
4. **Verifica las IPs autorizadas**: Si el error es 401 con mensaje sobre IP no reconocida:
   - Ve a https://app.brevo.com/security/authorised_ips
   - Agrega tu IP actual a la lista de IPs autorizadas
   - O deshabilita temporalmente la restricción de IP para desarrollo
5. **Revisa los logs**: Los logs ahora mostrarán información detallada sobre el error

### Error 401 - IP no autorizada
Si ves este error específico:
```
Error de Brevo: {
  message: 'We have detected you are using an unrecognised IP address...',
  code: 'unauthorized'
}
```

**Solución rápida**:
1. Ve a https://app.brevo.com/security/authorised_ips
2. Agrega tu IP actual (`186.155.14.139` en tu caso) a la lista
3. O deshabilita temporalmente "Restrict API access to specific IP addresses"

### Verificar la configuración
Puedes verificar si la configuración está correcta haciendo una petición a la API:

```bash
curl -X POST "http://localhost:3000/api/reset-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"tu-email@ejemplo.com"}'
```

Si la configuración está correcta, deberías recibir una respuesta con un URL de reset. 