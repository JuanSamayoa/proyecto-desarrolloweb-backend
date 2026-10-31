# API de Desarrollo Web

Backend REST para una plataforma de actividades educativas. El proyecto permite consultar actividades, registrar estudiantes y almacenar el progreso obtenido por cada estudiante en una actividad.

## Descripción

La aplicación ofrece una API desarrollada con Node.js y Express. Su información se almacena en una base de datos MySQL y se consulta mediante endpoints HTTP.

El progreso se identifica mediante la combinación de `estudiante_id` y `actividad_id`. Esta relación permite registrar el puntaje de un estudiante y actualizarlo posteriormente sin crear registros duplicados, siempre que la tabla `progresos` tenga una restricción única para ambas columnas.

## Funcionalidades principales

- Consulta de actividades educativas disponibles.
- Registro de nuevos estudiantes.
- Registro o actualización del puntaje de un estudiante en una actividad.
- Consulta general de progresos.
- Consulta de progresos filtrada por estudiante.
- Relaciones entre estudiantes, actividades y progresos mediante claves foráneas.

## Tecnologías

- Node.js
- Express 5
- MySQL
- MySQL2 para la conexión con la base de datos
- CORS para el acceso desde aplicaciones cliente
- dotenv para la configuración mediante variables de entorno

## Estructura principal

- `server.js`: configura el servidor Express, los middlewares y las rutas de la API.
- `db.js`: crea y exporta el pool de conexiones hacia MySQL.
- `package.json`: define la información del proyecto y sus dependencias.

## Rutas de la API

### Actividades

`GET /api/actividades`

Devuelve todas las actividades educativas registradas, incluyendo la información disponible en la tabla `actividades`.

### Estudiantes

`POST /api/estudiantes`

Registra un estudiante utilizando su nombre y edad. La respuesta incluye el identificador generado para el nuevo estudiante.

### Progresos

`PUT /api/progresos`

Registra o actualiza el puntaje de un estudiante en una actividad. Recibe `estudiante_id`, `actividad_id` y `puntaje`. Si ya existe un registro para esa combinación, actualiza el puntaje; de lo contrario, crea un nuevo progreso.

`GET /api/progresos`

Devuelve un reporte de progresos con información del estudiante, la actividad, el nivel, el puntaje y la fecha de ejecución.

También permite filtrar los resultados mediante el parámetro `estudiante_id`.

## Modelo de datos

### Estudiantes

Contiene la información básica de cada estudiante, como su identificador, nombre y edad.

### Actividades

Contiene las actividades educativas disponibles, incluyendo su título y nivel.

### Progresos

Contiene el puntaje obtenido por cada estudiante en una actividad. Sus relaciones principales son:

- `estudiante_id` referencia a `estudiantes.id`.
- `actividad_id` referencia a `actividades.id`.
- La combinación `estudiante_id` y `actividad_id` debe ser única para evitar duplicados.
- La fecha de ejecución se genera automáticamente al crear el registro.

Las relaciones utilizan eliminación en cascada, por lo que los progresos asociados se eliminan cuando se elimina el estudiante o la actividad correspondiente.

## Configuración

La conexión con MySQL utiliza las siguientes variables de entorno:

- `DB_HOST`: servidor de la base de datos.
- `DB_USER`: usuario de la base de datos.
- `DB_PASSWORD`: contraseña de la base de datos.
- `DB_NAME`: nombre de la base de datos.
- `PORT`: puerto del servidor API. Si no se especifica, utiliza el puerto `10001`.

## Respuestas y validaciones

La API devuelve respuestas JSON y valida la presencia de los datos obligatorios antes de ejecutar las operaciones. Los errores de validación devuelven un estado `400`, mientras que los errores de conexión o de base de datos devuelven un estado `500`.

Las operaciones exitosas utilizan códigos HTTP apropiados para indicar la consulta, creación o actualización realizada.

## Estado actual

El proyecto contiene la estructura base funcional del backend y está preparado para integrarse con una aplicación frontend educativa que consuma sus endpoints REST.
