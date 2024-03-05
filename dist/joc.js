"use strict";
// joc.ts
// Assegura't que aquest arxiu es carrega després de casella.ts i tauler.ts en el teu HTML.
document.addEventListener('DOMContentLoaded', () => {
    iniciarJoc();
});
function iniciarJoc() {
    // Demana a l'usuari que introdueixi la mida del tauler
    const mida = prompt("Introdueix la mida del tauler, ex: 10x10");
    if (mida) {
        const [files, columnes] = mida.split('x').map(Number);
        // Verifica que els valors introduïts siguin números vàlids i crea el tauler
        if (!isNaN(files) && !isNaN(columnes)) {
            const jocTauler = new Tauler(files, columnes);
        }
        else {
            alert("Si us plau, introdueix una mida vàlida en el format filesxcolumnes, ex: 10x10");
            iniciarJoc(); // Torna a sol·licitar la mida si els valors no són vàlids
        }
    }
}
