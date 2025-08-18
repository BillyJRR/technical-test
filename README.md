Technical Test - Appointments API
Descripción

Aplicación serverless para gestionar appointments de asegurados.
Tecnologías usadas: Node.js 20.x, Serverless Framework, AWS Lambda, DynamoDB, SNS, SQS, RDS (MySQL), EventBridge.

Permite crear appointments, listar appointments por insuredId y gestionar el flujo de estado PENDING → COMPLETED usando mensajería entre Lambdas y colas/EventBridge.

Flujo de Datos

1. Crear Appointment
  . Lambda appointment recibe petición HTTP.
  . Guarda la información en DynamoDB con estado PENDING.
  . Publica evento en SNS según countryISO (SNS_PE o SNS_CL).

2. Procesar Appointment por país
  . SNS envía mensaje a la SQS correspondiente (SQS_PE o SQS_CL).
  . Lambda appointment_pe o appointment_cl lee la SQS.
  . Guarda información en RDS MySQL.
  . Publica conformidad en EventBridge.

3. Actualizar estado en DynamoDB
  . Los lambdas appointment_pe y appointment_cl envían la conformidad del agendamiento a través de EventBridge.
  . El EventBridge publica el evento AppointmentCompleted en el SQS llamado UpdateAppointmentQueue.
  . El lambda appointment (el mismo que crea los appointments) está suscrito a esta cola SQS.
  . Cuando recibe un mensaje de SQS, el lambda actualiza el estado del appointment a "COMPLETED" en DynamoDB.

4. Endpoints
   
    4.1 Crear Appointment
        . Método: POST
        . Ruta: /appointments
        . Request Body:

      ```
      {
        "email": "el_correo",
        "password": "la_contraseña"
      }
      ```

    . Response:

        {
          "message": "Successful login",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "user": {
            "userId": "1",
            "email": "juan.perez@test.com"
          },
          "insured": {
            "insuredId": "00123",
            "fullName": "Juan Pérez García"
          }
        }
  
    . Copiar el valor de token y usarlo en el header Authorization: Bearer <token> para llamar a los endpoints de appointments.

    4.2 Crear Appointment
      . Método: POST
      . Ruta: /appointments
      . Request Body:

        {
          "insuredId": "00123",
          "scheduleId": "102",
          "countryISO": "PE"
        }

    . Response:
    
        {
          "message": "Appointment created",
          "appointment": {
            "appointmentId": "68c2bd53-64d5-433e-82f0-32984c291729",
            "insuredId": "00123",
            "scheduleId": "102",
            "countryISO": "PE",
            "status": "PENDING",
            "createdAt": "2025-08-17T17:50:44.913Z"
          }
        }

    4.3 Listar Appointments por insuredId
      . Método: GET
      . Ruta: /appointments/{insuredId}
      . Response:

        [
          {
            "appointmentId": "68c2bd53-64d5-433e-82f0-32984c291729",
            "insuredId": "00123",
            "scheduleId": "102",
            "countryISO": "PE",
            "status": "COMPLETED",
            "createdAt": "2025-08-17T17:50:44.913Z"
          },
          ...
        ]

6. Variables de Entorno (.env)
     ```htm
     . Variable              . Descripción
      USERS_TABLE         = Nombre de la tabla DynamoDB que almacena los usuarios registrados.
      APPOINTMENTS_TABLE  = Nombre de la tabla DynamoDB donde se guardan los appointments, incluyendo su estado (PENDING o COMPLETED).
      SCHEDULES_TABLE     = Nombre de la tabla DynamoDB que contiene los horarios disponibles para citas.
      CENTERS_TABLE       = Nombre de la tabla DynamoDB que guarda los centros médicos o clínicas y el país (PE o CL).
      SPECIALTIES_TABLE   = Nombre de la tabla DynamoDB que contiene las especialidades médicas disponibles.
      MEDICS_TABLE        = Nombre de la tabla DynamoDB con los datos de los médicos.
      INSUREDS_TABLE      = Nombre de la tabla DynamoDB que guarda información de los asegurados.
      USER_AWS_REGION     = Región de AWS donde se desplegarán los recursos (ej. us-east-1).
      JWT_SECRET          = Clave secreta utilizada para validar y firmar los tokens JWT en la autenticación.
      MYSQL_HOST_PE       = Host del RDS MySQL para la base de datos de Perú.
      MYSQL_USER_PE       = Usuario de acceso al RDS MySQL de Perú.
      MYSQL_PASSWORD_PE   = Contraseña del usuario para el RDS MySQL de Perú.
      MYSQL_DB_PE         = Nombre de la base de datos en MySQL para Perú.
      MYSQL_HOST_CL       = Host del RDS MySQL para la base de datos de Chile.
      MYSQL_USER_CL       = Usuario de acceso al RDS MySQL de Chile.
      MYSQL_PASSWORD_CL   = Contraseña del usuario para el RDS MySQL de Chile.
      MYSQL_DB_CL         = Nombre de la base de datos en MySQL para Chile.
    ```
. Las demás variables (SNS, SQS, EventBridge) se generan automáticamente al desplegar el stack con Serverless, por eso no necesitas agregarlas manualmente en el .env.

6. Instalación y Despliegue
  . Clonar repositorio:

          git clone <REPO_URL>

          cd technical-test
          
    . Instalar dependencias:
          
          npm install

    . Configurar variables de entorno en .env según tabla anterior.
    
    . Desplegar en AWS:
  
          npx serverless deploy

    . Ejecutar localmente (opcional):
          
          npx serverless offline

7. Pruebas Unitarias
  . Se incluyen pruebas unitarias para las funcionalidades principales: Login, Crear Appointment y Listar Appointments por insuredId.

          npx jest

  . Las pruebas usan Jest con TypeScript (ts-jest).
  . Se incluyen mocks para bcryptjs, repositorios y servicios externos.

8. Nota sobre RDS MySQL

La función que procesa los appointments desde SQS y guarda en RDS MySQL está comentada por defecto para evitar costos durante las pruebas.
**El flujo general sigue funcionando correctamente incluso con esta línea comentada.**

Para habilitarla:

  . Crear la base de datos en MySQL tanto para PE y CL según la configuración de .env.
  
  . Crear la tabla correspondiente (appointments o como esté definida).
  
  . La estructura de la tabla appointments:

  ```php
  CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    appointmentId VARCHAR(50), 
    insuredId VARCHAR(50),
    scheduleId VARCHAR(50),
    countryISO CHAR(2),
    status VARCHAR(20),
    createdAt DATETIME
  );
  ```

  . Descomentar la línea await repo.createFromSqs(appointment); en el código.
