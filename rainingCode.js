// Paramètres configurables
let charDelay = 40; // Délai avant d'écrire ou d'effacer le caractère suivant
let newColDelay = 40; // Délai avant de créer une nouvelle colonne
let maxColDuration = 3000; // Durée entre la complétion d'une colonne et le début de l'effacement
// Liste des caractères affichables (en l'occurrence l'ensemble des symboles unicode)
let allChars = [];
for (let i=0; i<143859; i++) {
    allChars.push(String.fromCharCode(i));
}
// Variables de gestion des événements souris
let drawing = false;
let lastX, lastY;
// Fonction d'initialisation
window.onload = init;
function init() {
    // Événements souris pour ajouter manuellement des colonnes
    window.addEventListener("mousedown", () => drawing = true);
    window.addEventListener("mousemove", drawCols);
    window.addEventListener("mouseup", (event) => {
        drawCols(event);
        drawing = false;
    });
    // Intervalle de création automatique des colonnes
    setInterval(function () {
        let col = new Column();
        col.start();
    }, Math.floor(newColDelay));
}
// Fonction timeout dans une Promise
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
// Callback des événements souris
function drawCols(event) {
    if (drawing && lastX !== event.clientX && lastY !== event.clientY) {
        lastX = event.clientX;
        lastY = event.clientY;
        let col = new Column(lastX-13, lastY);
        col.start();
    }
}
// Classe colonne
class Column {
    duration;
    charNbr;
    element;
    // Constructeur
    constructor(x, y) {
        // Récupération des dimensions courantes de la fenêtre
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        // Position de la colonne (fournie par un évènement souris ou tirée aléatoirement)
        let xPos = x || Math.floor((Math.random()*windowWidth));
        let yPos = y || Math.floor((Math.random()*windowHeight));
        // Nombre de caractères total de la colonne
        this.charNbr = 1 + Math.floor(Math.random()*((windowHeight-yPos)/15));
        this.duration = maxColDuration;
        // Élément html racine de la colonne
        this.element = document.createElement("p");
        this.element.style.left = Math.floor(xPos/13)*13 + "px";
        this.element.style.top = Math.floor(yPos/13)*13 + "px";
        // Éléments html de chaque caractère de la colonne
        for (let i = 0; i < this.charNbr; i++) {
            let newEl = document.createElement("span");
            newEl.innerText = allChars[Math.floor(Math.random()*allChars.length)];
            newEl.style.visibility = "hidden";
            this.element.appendChild(newEl);
        }
        document.body.appendChild(this.element);
    }
    // Fonction principale de la colonne
    start() {
        this.newChars()
            .then(() => sleep(this.duration)
                .then(() => this.hideChars()
                    .then(() => this.element.remove())
                )
            );
    }
    // Affichage des caractères
    async newChars() {
        for (let i = 0; i < this.charNbr; i++) {
            await sleep(charDelay).then(() => {
                this.element.childNodes[i].className = "lastVisible";
                this.element.childNodes[i].style.visibility = "visible";
            });
        }
    }
    // Masquage des caractères
    async hideChars() {
        for (let i = 0; i < this.charNbr; i++) {
            this.element.childNodes[i].className = "ended";
            await sleep(charDelay);
        }
    }
}