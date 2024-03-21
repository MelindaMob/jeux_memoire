const gridContainer = document.querySelector(".grid-container");
let cards = []; // création d'un tableau pour stocker les cartes
let firstCard, secondCard; // des ariables pour stocker les cartes retournées
let lockBoard = false; 
let score = 0; // Score du joueur qui commencera à 0 à chaque partie

// affichage initial du score à zéro
document.querySelector(".score").textContent = score;

// je récupère les données des cartes depuis un fichier JSON
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    // on double les cartes pour former les paires
    cards = [...data, ...data];
    // je crée une fonction qui servira à les mélanger et pour les rendre aléatoires
    shuffleCards();
    // fonction pour générer des éléments HTML pour chaque carte
    generateCards();
  });

// fonction shuffleCards qui sera utilisée pour mélanger les cartes
function shuffleCards() {
  let currentIndex = cards.length, 
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // pr échanger des positions des cartes pour les mélanger
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// function pour générer les éléments HTML des cartes
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    // création du contenu HTML de la carte avc une face avant et une face arrière
    cardElement.innerHTML = `
      <div class="front"> 
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    // je mets un gest d'évén pour retourner la carte en cliquant dessus
    cardElement.addEventListener("click", flipCard);
  }
}

// function pour retourner une carte
function flipCard() {
  if (lockBoard) return; // Si le verrou est activé, ne pas retourner la carte
  if (this === firstCard) return; // Si la carte cliquée est la même que la première carte déjà retournée, ne faites rien

  this.classList.add("flipped"); // Ajout de la classe 'flipped' pour montrer la face avant de la carte

  if (!firstCard) {
    firstCard = this; // Stockage de la première carte retournée si c'est la première carte
    return;
  }

  secondCard = this; // Stockage de la deuxième carte retournée si c'est la deuxième carte
  score++; // Incrément du score à chaque paire de cartes retournées
  document.querySelector(".score").textContent = score; // Mettre à jour l'affichage du score
  lockBoard = true; // Activer le verrou pour éviter de retourner plus de deux cartes à la fois

  checkForMatch(); // Vérifier si les deux cartes retournées sont identiques
}

// Fonction pour vérifier si les deux cartes retournées sont identiques
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

// Fonction pour désactiver les cartes si elles sont identiques
function disableCards() {
  firstCard.removeEventListener("click", flipCard); // Désactivation du gestionnaire d'événements pour la première carte
  secondCard.removeEventListener("click", flipCard); // Désactivation du gestionnaire d'événements pour la deuxième carte

  resetBoard(); // Réinitialisation des cartes retournées
}

// Fonction pour retourner les cartes si elles ne sont pas identiques
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped"); // Retourner la première carte
    secondCard.classList.remove("flipped"); // Retourner la deuxième carte
    resetBoard(); // Réinitialisation des cartes retournées
  }, 1000); // Attendre 1 seconde avant de retourner les cartes
}

// Fonction pour réinitialiser les cartes retournées
function resetBoard() {
  firstCard = null; // Réinitialisation de la première carte
  secondCard = null; // Réinitialisation de la deuxième carte
  lockBoard = false; // Désactiver le verrouillage du tableau
}

// Fonction pour redémarrer le jeu
function restart() {
  resetBoard(); // Réinitialisation du tableau
  shuffleCards(); // Mélange des cartes
  score = 0; // Réinitialisation du score à zéro
  document.querySelector(".score").textContent = score; // Mise à jour de l'affichage du score
  gridContainer.innerHTML = ""; // Effacement du contenu de la grille
  generateCards(); // Génération à nouveau des cartes
}
