# Documentacion de la API

API REST para la plataforma de actividades educativas.

## Informacion general

- **Base URL local:** `http://localhost:10001`
- **Formato:** JSON
- **Content-Type para solicitudes con cuerpo:** `application/json`
- **CORS:** habilitado

El puerto puede cambiar si se define la variable de entorno `PORT`.

## Resumen de endpoints

| Metodo | Endpoint           | Descripcion                                           |
| ------ | ------------------ | ----------------------------------------------------- |
| `GET`  | `/api/actividades` | Obtiene todas las actividades educativas.             |
| `POST` | `/api/estudiantes` | Registra un estudiante nuevo.                         |
| `PUT`  | `/api/progresos`   | Registra o actualiza el progreso de un estudiante.    |
| `GET`  | `/api/progresos`   | Obtiene el reporte de progresos, con filtro opcional. |

## Convenciones de respuesta

Las respuestas exitosas se devuelven en formato JSON. Los errores siguen esta estructura:

```json
{
  "error": "Descripcion del error"
}
```

| Codigo                      | Significado                                                 |
| --------------------------- | ----------------------------------------------------------- |
| `200 OK`                    | Solicitud procesada correctamente.                          |
| `201 Created`               | Recurso creado correctamente.                               |
| `400 Bad Request`           | Faltan datos obligatorios o la solicitud no es valida.      |
| `500 Internal Server Error` | Ocurrio un error al consultar o modificar la base de datos. |

## 1. Obtener actividades

### `GET /api/actividades`

Devuelve todas las actividades registradas en la tabla `actividades`.

### Solicitud

No requiere parametros, cuerpo ni autenticacion.

```bash
curl http://localhost:10001/api/actividades
```

### Respuesta exitosa: `200 OK`

La respuesta es un arreglo con las columnas disponibles de la tabla `actividades`. Un ejemplo posible es:

```json
[
  {
    "id": 1,
    "titulo": "Suma de numeros naturales",
    "nivel": "basico"
  },
  {
    "id": 2,
    "titulo": "Fracciones equivalentes",
    "nivel": "intermedio"
  }
]
```

### Posible respuesta de error: `500 Internal Server Error`

```json
{
  "error": "Error al consultar la base de datos"
}
```

El texto exacto de `error` depende del error informado por MySQL.

## 2. Registrar un estudiante

### `POST /api/estudiantes`

Crea un estudiante nuevo en la tabla `estudiantes`.

### Encabezados

```http
Content-Type: application/json
```

### Cuerpo de la solicitud

| Campo    | Tipo     | Obligatorio | Descripcion            |
| -------- | -------- | ----------- | ---------------------- |
| `nombre` | `string` | Si          | Nombre del estudiante. |
| `edad`   | `number` | Si          | Edad del estudiante.   |

### Ejemplo de solicitud

```bash
curl -X POST http://localhost:10001/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana Garcia","edad":10}'
```

### Respuesta exitosa: `201 Created`

```json
{
  "id": 7,
  "nombre": "Ana Garcia",
  "edad": 10
}
```

`id` es el identificador generado por la base de datos.

### Respuesta de validacion: `400 Bad Request`

Se devuelve cuando falta `nombre` o `edad`.

```json
{
  "error": "El nombre y la edad son obligatorios."
}
```

### Posible respuesta de error: `500 Internal Server Error`

```json
{
  "error": "Error al registrar el estudiante"
}
```

## 3. Registrar o actualizar un progreso

### `PUT /api/progresos`

Registra el puntaje de un estudiante en una actividad. Si ya existe un progreso para la combinacion de `estudiante_id` y `actividad_id`, actualiza el puntaje en lugar de crear otro registro.

### Encabezados

```http
Content-Type: application/json
```

### Cuerpo de la solicitud

| Campo           | Tipo     | Obligatorio | Descripcion                                                                     |
| --------------- | -------- | ----------- | ------------------------------------------------------------------------------- |
| `estudiante_id` | `number` | Si          | Identificador del estudiante.                                                   |
| `actividad_id`  | `number` | Si          | Identificador de la actividad.                                                  |
| `puntaje`       | `number` | Si          | Puntaje obtenido. El valor `0` no se considera valido por la validacion actual. |

### Ejemplo de solicitud

```bash
curl -X PUT http://localhost:10001/api/progresos \
  -H "Content-Type: application/json" \
  -d '{"estudiante_id":7,"actividad_id":2,"puntaje":85}'
```

### Respuesta exitosa: `200 OK`

```json
{
  "id": 12,
  "estudiante_id": 7,
  "actividad_id": 2,
  "puntaje": 85
}
```

Cuando se actualiza un registro existente, el valor de `id` depende de la respuesta devuelta por MySQL y puede no representar un nuevo identificador.

### Respuesta de validacion: `400 Bad Request`

Se devuelve cuando falta alguno de los campos obligatorios.

```json
{
  "error": "Faltan datos obligatorios para registrar el progreso."
}
```

### Posible respuesta de error: `500 Internal Server Error`

```json
{
  "error": "Error al registrar el progreso"
}
```

## 4. Consultar el reporte de progresos

### `GET /api/progresos`

Devuelve los progresos registrados junto con los datos relacionados del estudiante y de la actividad. Los resultados se ordenan por `fecha_ejecucion` de forma descendente.

### Solicitud sin filtro

```bash
curl http://localhost:10001/api/progresos
```

### Solicitud filtrada por estudiante

El parametro opcional `estudiante_id` limita el resultado a un estudiante especifico.

```bash
curl "http://localhost:10001/api/progresos?estudiante_id=7"
```

### Parametros de consulta

| Parametro       | Tipo     | Obligatorio | Descripcion                                                       |
| --------------- | -------- | ----------- | ----------------------------------------------------------------- |
| `estudiante_id` | `number` | No          | Identificador del estudiante cuyos progresos se desean consultar. |

### Respuesta exitosa: `200 OK`

```json
[
  {
    "id": 12,
    "estudiante": "Ana Garcia",
    "edad": 10,
    "actividad": "Fracciones equivalentes",
    "nivel": "intermedio",
    "puntaje": 85,
    "fecha_ejecucion": "2026-10-31T14:30:00.000Z"
  }
]
```

Si no existen progresos que coincidan con el filtro, la respuesta es un arreglo vacio:

```json
[]
```

### Posible respuesta de error: `500 Internal Server Error`

```json
{
  "error": "Error al consultar el reporte de progresos"
}
```

## Ejemplo de consumo con JavaScript

```js
const respuesta = await fetch("http://localhost:10001/api/estudiantes", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nombre: "Ana Garcia",
    edad: 10,
  }),
});

const datos = await respuesta.json();

if (!respuesta.ok) {
  throw new Error(datos.error);
}

console.log(datos);
```

## Notas de integracion

- Todas las rutas comienzan con el prefijo `/api`.
- Las solicitudes `POST` y `PUT` deben enviar un cuerpo JSON valido.
- El servidor debe tener configuradas las variables de conexion a MySQL antes de iniciar la API.
- La API no implementa autenticacion en su estado actual.
- Los nombres y tipos exactos de las columnas devueltas por `GET /api/actividades` dependen del esquema de la tabla `actividades`.
