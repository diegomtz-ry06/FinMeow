# FinMeow
-----
# Asistente Crediticio FinMeow

**Proyecto para el Hackathon "Hack Mty" (Octubre 2025).**
**Reto:** Fintech by Capital One.

> ~ De la deuda a la meta. Del gato al pago.
>  Una app que ayuda de forma intuitiva, dinámica y "divertida" a administrar tu cuenta, créditos y gastos en Capital One, enfocada 100% en la educación financiera.

-----

## El Problema

La gestión financiera, especialmente el crédito, es estresante y confusa. Los usuarios ven sus gastos al final del mes, no tienen un plan de pago claro y no entienden cómo mejorar su salud financiera. La mayoría de las apps bancarias solo *muestran* datos, no ayudan a *mejorar* hábitos.

-----

## Nuestra Solución

Construimos un **"coach" financiero proactivo** que se alimenta de la información de la API de Capital One y se interpreta con la API de Gemini. Nuestra app transforma el manejo de deudas y gastos en una experiencia gamificada y también de simulaciones, motivando al usuario con metas claras y recompensas visuales por sus buenos hábitos.

-----

## Características Principales
  * **ChatBot Gurú (con Google Gemini):** Un chatbot inteligente que analiza tus patrones de gasto y te da recomendaciones proactivas y planes de acción.
  * **Gamificación ("Score de Racha")**: Un sistema de "palomitas" (pagos a tiempo) y "tachitas" (pagos atrasados) que crea un *score* de responsabilidad financiera, guardado en nuestra propia base de datos.
  * **Gestión de Metas claras y objetivos**: Permite al usuario crear objetivos de pago (para préstamos, facturas) o de ahorro (para "caprichos"), que se almacenan en nuestra BD.
  * **Auditoría de Gastos**: Analiza compras por mes (obtenidas de la API de Nessie) para que el usuario entienda en qué gasta su dinero.
  * **Simulador Financiero**: Una herramienta 100% frontend para explorar escenarios hipotéticos como "¿Qué pasa si pago tarde este mes?" y ver el costo real en intereses.
  * **Conexión Total con la API**: Se integra con la API de Capital One (Nessie) para obtener perfiles de clientes, cuentas, saldos y transacciones en tiempo real.

-----

## Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** PHP 8
* **Servidor:** Apache (vía XAMPP)
* **Base de Datos:** MySQL (vía XAMPP/MariaDB)
* **APIs Externas:**
    * **Capital One (Nessie) API:** Para todos los datos de cuentas, clientes y transacciones.
    * **Google Gemini API:** Para el chatbot de recomendaciones.
* **Herramientas:** Postman (Para Pruebas de API)

-----

## Cómo Ejecutar (Instalación Local)

**Requisitos Previos:**

  * **XAMPP** instalado ([Descargar aquí](https://www.apachefriends.org/es/index.html)).
  * Un navegador web (Chrome, Firefox).
  * Una clave de API de **Google Gemini**.

**Pasos de Instalación:**

1.  **Clonar el Repositorio:**

    ```bash
    git clone [URL_DE_TU_REPOSITORIO]
    ```

2.  **Mover Archivos:**

      * Mueve la carpeta completa del proyecto (ej. `APP/` y todos los archivos `.php`) a la carpeta `htdocs` de tu instalación de XAMPP.
      * *Ubicación típica: `C:\xampp\htdocs\`*

3.  **Iniciar Servidores:**

      * Abre el **Panel de Control de XAMPP**.
      * Inicia los servicios de **Apache** y **MySQL**.

4.  **Crear la Base de Datos:**

      * Abre tu navegador y ve a `http://localhost/phpmyadmin`.
      * Haz clic en la pestaña "Bases de datos", escribe el nombre `app_crediticia` y haz clic en "Crear".
      * Haz clic en la base de datos `app_crediticia` que acabas de crear (en la lista de la izquierda).
      * Ve a la pestaña **"SQL"**.
      * Copia y pega el siguiente script completo y haz clic en "Continuar":

    <!-- end list -->

    ```sql
    CREATE TABLE Usuarios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        nombre VARCHAR(100),
        customer_id_banco VARCHAR(255) NULL,
        score_racha INT DEFAULT 100,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Metas_Financieras (
        id INT PRIMARY KEY AUTO_INCREMENT,
        usuario_id INT,
        nombre_meta VARCHAR(255) NOT NULL,
        tipo_meta VARCHAR(50),
        objeto_id_banco VARCHAR(255) NULL,
        monto_objetivo DECIMAL(18, 2) NOT NULL,
        monto_actual DECIMAL(18, 2) DEFAULT 0,
        fecha_limite DATE,
        estado VARCHAR(50) DEFAULT 'Activo',
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
    );

    CREATE TABLE Historial_Racha (
        id INT PRIMARY KEY AUTO_INCREMENT,
        usuario_id INT,
        evento_tipo VARCHAR(100) NOT NULL,
        descripcion VARCHAR(500),
        fecha_evento DATETIME DEFAULT CURRENT_TIMESTAMP,
        impacto_score INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
    );

    CREATE TABLE Recordatorios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        usuario_id INT,
        bill_id_banco VARCHAR(255) NOT NULL,
        fecha_recordatorio DATE NOT NULL,
        mensaje VARCHAR(500) NOT NULL,
        enviado BIT DEFAULT 0,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
    );
    ```

5.  **Configurar PHP**

      * En el Panel de XAMPP, haz clic en "Config" (de Apache) -\> `PHP (php.ini)`.
      * Busca (Ctrl+B) y quita el punto y coma (`;`) de las siguientes dos líneas:
        ```ini
        extension=curl
        extension=openssl
        ```
      * Guarda el archivo y **Reinicia Apache** (Stop -\> Start).

6.  **¡Listo\!**

      * Abre `http://localhost/APP/InicioSesion.html` en tu navegador.
      * Puedes crear un usuario nuevo o usar uno existente.

-----

## Datos de Prueba

  * La API Key de Nessie (`f091eb...`) ya está configurada en los archivos `.php` para la demo.
  * La aplicación está diseñada para **vincular automáticamente** cualquier usuario nuevo con un perfil de cliente de demostración (`customer_id: 68fcf1b1...`) que ya hemos poblado con datos (cuentas, compras) usando Postman.
  * Para probar la página de "Retos", puedes insertar datos de prueba en la tabla `Historial_Racha` desde `phpMyAdmin`.

-----

## El Equipo

  * **Diego Martinez** - Backend Lead & API Integration (`@diegomtz-ry06`)
  * **Ana Martinez** - Frontend Lead & AI Integration (`@AnaLucia-cs`)
  * **Ana Palacios** - UI/UX Design & JavaScript (`@anaslzr`)
  * **Alberto Lucio** - Database Admin & Php Logic (`@LicFressa`)
