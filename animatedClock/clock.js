
class Clock {

  /* 
     CONSTRUCTOR
     Se ejecuta automáticamente cuando hacemos
     "new Clock()". Aquí preparamos todo lo necesario
     antes de que el reloj empiece a funcionar.
   */
  constructor() {

    /* Guardamos una referencia al contenedor principal
       del reloj para usarlo después */
    this.container = document.querySelector(".container");

    /* --- Referencias a las secciones de cada grupo --- */
    /* Cada grupo (horas, minutos, segundos) tiene
       dos columnas: decenas y unidades */
    this.secondDigits = this.container.querySelector(".digits--seconds");
    this.secondDigitsUnits = this.secondDigits.querySelector(".digit--units");
    this.secondDigitsTens  = this.secondDigits.querySelector(".digit--tens");

    this.minuteDigits = this.container.querySelector(".digits--minutes");
    this.minuteDigitsUnits = this.minuteDigits.querySelector(".digit--units");
    this.minuteDigitsTens  = this.minuteDigits.querySelector(".digit--tens");

    this.hourDigits = this.container.querySelector(".digits--hours");
    this.hourDigitsUnits = this.hourDigits.querySelector(".digit--units");
    this.hourDigitsTens  = this.hourDigits.querySelector(".digit--tens");

    /* --- Configuración de cada columna ---
       Indicamos cuántos números tiene cada columna.
       Ejemplos:
       - Segundos unidades: 0,1,2,3,4,5,6,7,8,9 → 10 números
       - Segundos decenas:  0,1,2,3,4,5          → 6 números (máx 59s)
       - Horas decenas:     0,1,2                → 3 números (máx 23h) */
    this.digitColumns = [
      { el: this.secondDigitsUnits, totalNumbers: 10 },
      { el: this.secondDigitsTens,  totalNumbers: 6  },
      { el: this.minuteDigitsUnits, totalNumbers: 10 },
      { el: this.minuteDigitsTens,  totalNumbers: 6  },
      { el: this.hourDigitsUnits,   totalNumbers: 10 },
      { el: this.hourDigitsTens,    totalNumbers: 3  }
    ];

    /* intervalId guarda el ID del temporizador.
       Cuando es null, el reloj está detenido.
       Cuando tiene un número, está corriendo. */
    this.intervalId = null;

    /* Altura en píxeles de cada número.
       IMPORTANTE: debe coincidir con el height
       del .num en el CSS (también 40px). */
    this.numHeight = 40;

    /* Llamamos a las dos funciones de arranque */
    this.init();        /* Crea los números en el HTML */
    this.bindEvents();  /* Conecta los botones */
  }

  /* 
     INIT
     Crea todos los números dentro de cada columna
     y los agrega al HTML dinámicamente.
     Esto se hace una sola vez al cargar la página.

     Ejemplo: la columna de segundos-unidades
     recibe divs con los textos: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
   */
  init() {
    this.digitColumns.forEach((column) => {
      const { el, totalNumbers } = column;

      /* Creamos un div por cada número y lo agregamos
         dentro de la columna en el HTML */
      [...Array(totalNumbers).keys()].forEach((num) => {
        const element = document.createElement("div");
        element.textContent = num;
        element.classList.add("num");
        el.appendChild(element);
      });
    });
  }

  /* 
     BINDEVENTS
     Aquí conectamos los botones del HTML con
     las acciones que deben realizar.
   */
  bindEvents() {

    /* Botón START: inicia el reloj */
    const startButton = document.querySelector(".buttons .start");
    startButton.addEventListener("click", () => {
      /* Solo inicia si el reloj no está corriendo ya
         (evita crear múltiples intervalos al hacer clic varias veces) */
      if (!this.intervalId) {
        /* setInterval llama a la función update()
           cada 1000 milisegundos = cada 1 segundo */
        this.intervalId = setInterval(this.update.bind(this), 1000);
      }
    });

    /* Botón STOP: detiene el reloj */
    const stopButton = document.querySelector(".buttons .stop");
    stopButton.addEventListener("click", () => {
      /* clearInterval cancela el temporizador usando su ID */
      clearInterval(this.intervalId);
      /* Reseteamos a null para indicar que está detenido */
      this.intervalId = null;
    });
  }

  /* 
     UPDATE
     Se ejecuta automáticamente cada segundo.
     Lee la hora actual del sistema y mueve cada
     columna de dígitos para mostrar el número correcto.
   */
  update() {

    /* Obtenemos la hora actual del sistema */
    const now = new Date();

    /* Convertimos cada valor a texto de 2 dígitos.
       Ejemplo: si son 5 segundos → "05"
                si son 23 horas   → "23" */
    const nowSeconds = `${now.getSeconds() < 10 ? "0" : ""}${now.getSeconds().toString()}`;
    const nowMinutes = `${now.getMinutes() < 10 ? "0" : ""}${now.getMinutes().toString()}`;
    const nowHours   = `${now.getHours()   < 10 ? "0" : ""}${now.getHours().toString()}`;

    /* Agrupamos horas, minutos y segundos para
       procesarlos todos con el mismo código en un bucle */
    const itemsToUpdate = [
      { time: nowSeconds, columns: [this.secondDigitsUnits, this.secondDigitsTens] },
      { time: nowMinutes, columns: [this.minuteDigitsUnits, this.minuteDigitsTens] },
      { time: nowHours,   columns: [this.hourDigitsUnits,   this.hourDigitsTens]   }
    ];

    /* Procesamos cada grupo (segundos, minutos, horas) */
    itemsToUpdate.forEach((item) => {
      const { time, columns } = item;
      const [unitsColumn, tensColumn] = columns;

      /* Separamos el número en sus dos dígitos.
         Ejemplo: time = "47"
         → charAt(1) = "7" → unitsNum = 7 (unidades)
         → charAt(0) = "4" → tensNum  = 4 (decenas) */
      const unitsNum = parseInt(time.charAt(1), 10);
      const tensNum  = parseInt(time.charAt(0), 10);

      /* Calculamos cuántos píxeles hay que desplazar
         la columna hacia arriba para mostrar el número.
         Si el número es 7 y cada número mide 40px:
         7 × 40 = 280px hacia arriba */
      const unitsOffset = this.numHeight * unitsNum;
      const tensOffset  = this.numHeight * tensNum;

      /* Obtenemos el marcador circular de cada columna */
      const unitsMarkerEl = unitsColumn.querySelector(".marker");
      const tensMarkerEl  = tensColumn.querySelector(".marker");

      /* Movemos la columna hacia ARRIBA para mostrar el número.
         El marcador se mueve hacia ABAJO la misma cantidad
         para que visualmente se quede fijo en su lugar. */

      // Columna de unidades
      unitsColumn.style.transform = `translateY(-${unitsOffset}px)`;
      unitsMarkerEl.style.transform = `translateY(${unitsOffset}px)`;

      // Columna de decenas
      tensColumn.style.transform = `translateY(-${tensOffset}px)`;
      tensMarkerEl.style.transform = `translateY(${tensOffset}px)`;
    });
  }
}

new Clock();
