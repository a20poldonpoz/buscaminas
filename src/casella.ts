// casella.ts
class Casella {
  teMina: boolean; // Indica si la casella conté una mina
  esMostrada: boolean; // Indica si la casella ha estat revelada
  esMarcada: boolean; // Indica si la casella ha estat marcada com a possible mina
  fila: number; // Número de fila de la casella
  columna: number; // Número de columna de la casella

  constructor(fila: number, columna: number) {
    this.teMina = false; // Inicialment, la casella no té una mina
    this.esMostrada = false; // Inicialment, la casella no ha estat revelada
    this.esMarcada = false; // Inicialment, la casella no ha estat marcada com a possible mina
    this.fila = fila; // Assigna el número de fila rebut com a paràmetre
    this.columna = columna; // Assigna el número de columna rebut com a paràmetre
  }
}
