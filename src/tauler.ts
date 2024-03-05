class Tauler {
  columnes: number; // Nombre de columnes del tauler
  files: number; // Nombre de files del tauler
  tauler: Casella[][] = []; // Matriu que representa el tauler amb caselles
  mines: number; // Nombre de mines en el tauler

  constructor(f: number, c: number) {
    this.files = f;
    this.columnes = c;
    // Calcular el nombre de mines (17% del total de caselles)
    this.mines = Math.floor((f * c) * 0.17);
    this.inicialitzarTauler();
  }

  inicialitzarTauler() {
    // Inicialitzar el tauler amb caselles buides
    for (let fila = 0; fila < this.files; fila++) {
      this.tauler[fila] = [];
      for (let columna = 0; columna < this.columnes; columna++) {
        this.tauler[fila][columna] = new Casella(fila, columna);
      }
    }
    // Col·locar les mines aleatòriament
    this.colocarMines();
    this.mostrarTauler();
    console.table(this.tauler);
  }

  colocarMines() {
    let minesColocades = 0;
    while (minesColocades < this.mines) {
      const fila = Math.floor(Math.random() * this.files);
      const columna = Math.floor(Math.random() * this.columnes);
      if (!this.tauler[fila][columna].teMina) {
        this.tauler[fila][columna].teMina = true;
        minesColocades++;
      }
    }
  }

  mostrarTauler() {
    let taulaHTML = '<table style="border-collapse: collapse;">';
    for (let fila = 0; fila < this.files; fila++) {
      taulaHTML += '<tr>';
      for (let columna = 0; columna < this.columnes; columna++) {
        // Afegir un id únic a cada casella
        taulaHTML += `<td id="casella-${fila}-${columna}" style="padding: 0.5; margin: 0;"><img src="/img/square.gif" alt="casella" style="display: block; width: 25px; height: 25px;"></td>`;
      }
      taulaHTML += '</tr>';
    }
    taulaHTML += '</table>';
    document.body.innerHTML = taulaHTML;
  
    // Afegir un EventListener després que el tauler s'hagi afegit al DOM
    for (let fila = 0; fila < this.files; fila++) {
      for (let columna = 0; columna < this.columnes; columna++) {
        const casellaElement = document.getElementById(`casella-${fila}-${columna}`);
        casellaElement?.addEventListener('click', () => {
          this.revelarCasella(fila, columna);
        });
  
        // EventListener per al clic dret
        casellaElement?.addEventListener('contextmenu', (event) => {
          event.preventDefault(); // Evitar que aparegui el menú contextual
          this.marcarCasella(fila, columna); // Marcar la casella com a mina
        });
      }
    }
  }

  revelarCasella(fila: number, columna: number) {
    const casella = this.tauler[fila][columna];
    if (!casella.esMostrada && !casella.esMarcada) {
      casella.esMostrada = true;
      const casellaElement = document.getElementById(`casella-${fila}-${columna}`);
      if (casella.teMina) {
        // Mostrar totes les mines
        this.mostrarMines();
        setTimeout(() => {
          alert('Has perdut!');
          this.mostrarFotoPerduda();
          this.mostrarBotoReinici();
        }, 100); // Utilitzar setTimeout per assegurar-se que les mines es mostren abans de l'alerta
      } else {
        // Calcular les mines al voltant
        let minesAlVoltant = this.calcularMinesAlVoltant(fila, columna);
        if (minesAlVoltant > 0) {
          // Mostrar el número de mines al voltant amb una imatge
          casellaElement.innerHTML = `<img src="/img/Minesweeper_${minesAlVoltant}.gif" alt="${minesAlVoltant}" style="padding: 0.5; margin: 0; display: block; width: 25px; height: 25px;">`;
        } else {
          // Si no hi ha mines al voltant, mostrar una casella buida i després revelar automàticament les caselles adjacents
          casellaElement.innerHTML = '<img src="/img/Minesweeper_0.gif" alt="0" style="padding: 0.5; margin: 0; display: block; width: 25px; height: 25px;">';
          this.revelarCasellesAdjacents(fila, columna);
        }
      }
    }
    this.comprovarVictoria();
  }
  
  calcularMinesAlVoltant(fila: number, columna: number): number {
    let minesAlVoltant = 0;
    for (let f = fila - 1; f <= fila + 1; f++) {
      for (let c = columna - 1; c <= columna + 1; c++) {
        if (f >= 0 && f < this.files && c >= 0 && c < this.columnes) {
          if (this.tauler[f][c].teMina) {
            minesAlVoltant++;
          }
        }
      }
    }
    return minesAlVoltant;
  }  

  mostrarMines() {
    for (let fila = 0; fila < this.files; fila++) {
      for (let columna = 0; columna < this.columnes; columna++) {
        const casella = this.tauler[fila][columna];
        if (casella.teMina) {
          const casellaElement = document.getElementById(`casella-${fila}-${columna}`);
          casellaElement.innerHTML = '<img src="/img/mina.png" alt="mina" style="padding: 0.5; margin: 0; display: block; width: 25px; height: 25px;">';
        }
      }
    }
  }

  comprovarVictoria() {
    let casellesRevelades = 0;
    for (let fila = 0; fila < this.files; fila++) {
      for (let columna = 0; columna < this.columnes; columna++) {
        const casella = this.tauler[fila][columna];
        if (casella.esMostrada || casella.esMarcada) {
          casellesRevelades++;
        }
      }
    }
  
    // Si el nombre de caselles revelades més mines és igual al total de caselles, el jugador ha guanyat
    if (casellesRevelades === this.files * this.columnes) {
      setTimeout(() => {
        alert('Has guanyat!!');
        this.mostrarFotoGuanyada();
        this.mostrarBotoReinici(true); // Afegir un argument per diferenciar entre guanyar i perdre
      }, 100);
    }
  }

  mostrarFotoGuanyada() {
    const fotoGuanyada = document.createElement('img');
    fotoGuanyada.src = '/img/win.gif';
    fotoGuanyada.style.display = 'block';
    fotoGuanyada.style.width = '200px';
    fotoGuanyada.style.height = '200px';
    fotoGuanyada.style.margin = 'auto';
    document.body.appendChild(fotoGuanyada);
  }

  mostrarFotoPerduda() {
    const fotoPerduda = document.createElement('img');
    fotoPerduda.src = '/img/lost.gif';
    fotoPerduda.style.display = 'block';
    fotoPerduda.style.width = '200px';
    fotoPerduda.style.height = '200px';
    fotoPerduda.style.margin = 'auto';
    document.body.appendChild(fotoPerduda);
  }
  
  mostrarBotoReinici(guanyat = false) {
    const botoReinici = document.createElement('button');
    botoReinici.innerText = guanyat ? 'Nova Partida' : 'Torna a començar';
    botoReinici.onclick = () => {
      // Sol·licitar a l'usuari la mida del tauler per a una nova partida si ha guanyat
      if (guanyat) {
        const mida = prompt("Introdueix mida del tauler, ex: 10x10");
        if (mida) {
          const [files, columnes] = mida.split('x').map(Number);
          if (!isNaN(files) && !isNaN(columnes)) {
            new Tauler(files, columnes);
          } else {
            alert("Si us plau, introdueix una mida vàlida");
          }
        }
      } else {
        // Simplement reiniciar el joc amb la mateixa mida de tauler si el jugador ha perdut
        this.inicialitzarTauler();
      }
    };
    document.body.appendChild(botoReinici);
  }  
  
  marcarCasella(fila: number, columna: number) {
    const casella = this.tauler[fila][columna];
    if (!casella.esMostrada && !casella.esMarcada) {
      casella.esMarcada = true;
      const casellaElement = document.getElementById(`casella-${fila}-${columna}`);
      casellaElement.innerHTML = '<img src="/img/flag.png" alt="mina marcada" style="padding: 0.5; margin: 0 display: block width: 27px; height: 27px;">';
    }
  }  

  revelarCasellesAdjacents(fila: number, columna: number) {
    for (let f = fila - 1; f <= fila + 1; f++) {
      for (let c = columna - 1; c <= columna + 1; c++) {
        // Assegurar-se que la casella estigui dins del tauler
        if (f >= 0 && f < this.files && c >= 0 && c < this.columnes) {
          // Evitar la casella actual
          if (!(f === fila && c === columna)) {
            const casellaAdjacent = this.tauler[f][c];
            // Només revelar si la casella no ha estat revelada o marcada
            if (!casellaAdjacent.esMostrada && !casellaAdjacent.esMarcada) {
              // Marcar com a mostrada per prevenir la recursió infinita abans de la trucada recursiva
              casellaAdjacent.esMostrada = true;
              const casellaElement = document.getElementById(`casella-${f}-${c}`);
              let minesAlVoltant = this.calcularMinesAlVoltant(f, c);
              if (minesAlVoltant === 0) {
                casellaElement.innerHTML = '<img src="/img/Minesweeper_0.gif" alt="mina marcada" style="padding: 0.5; margin: 0 display: block width: 25px; height: 25px;">'; // mostrar una casella buida específica
                this.revelarCasellesAdjacents(f, c); // Recursivitat per caselles sense mines al voltant
              } else {
                // Mostrar el número de mines al voltant amb una imatge
                casellaElement.innerHTML = `<img src="/img/Minesweeper_${minesAlVoltant}.gif" alt="${minesAlVoltant}" style="padding: 0.5 margin: 0 display: block; width: 25px; height: 25px;">`;
              }
            }
          }
        }
      }
    }
  }
}
