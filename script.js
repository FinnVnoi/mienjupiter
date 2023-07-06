// Mảng chứa các lá bài đã chọn
let selectedCards = [];
// Số lượng lá bài đã chọn
let selectedCount = 0;

// Mảng chứa các lá bài ẩn
let hiddenCards = [];
// Mảng chứa các lá bài đã biến mất
let removedCards = [];

// Số lượng lá bài ẩn
const hiddenCardCount = 3;

// Tạo các lá bài trên trang chủ
document.getElementById("startButton").disabled = true;
const cardContainer = document.getElementById("cardContainer");
for (let i = 1; i <= 50; i++) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.backgroundImage = `url(images/card${i}.jpg)`;
  card.addEventListener("click", function() {
    selectCard(card, i);
  });
  cardContainer.appendChild(card);
}

// Chọn lá bài
function selectCard(card, cardIndex) {
  if (selectedCount < 10) {
    if (!selectedCards.includes(cardIndex)) {
      selectedCards.push(cardIndex);
      selectedCount++;
      card.style.border = "3px solid yellow";
    } else {
      selectedCards = selectedCards.filter(item => item !== cardIndex);
      selectedCount--;
      card.style.border = "none";
    }
  }
  if (selectedCount === 10) {
    document.getElementById("startButton").disabled = false;
  } else {
    document.getElementById("startButton").disabled = true;
  }
}

// Bắt đầu trò chơi
function startGame() {
  document.getElementById("cardContainer").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  document.getElementById("startButton").style.display = "none"

  // Gán số biến cho từng lá bài đã chọn
  const cardVariables = {};
  for (let i = 0; i < selectedCards.length; i++) {
    cardVariables[selectedCards[i]] = i + 1;
  }

  // Lưu số biến của lá bài vào mảng
  const cardVariableArray = selectedCards.map(card => cardVariables[card]);

  // Chọn ngẫu nhiên 3 lá bài từ các lá đã chọn
  hiddenCards = getRandomCards(selectedCards, hiddenCardCount, cardVariableArray);

  renderHiddenCards();

  // Hiển thị lá bài ẩn
  const hiddenCardsContainer = document.getElementById("hiddenCards");
  hiddenCardsContainer.innerHTML = "";
  hiddenCards.forEach(function(cardIndex) {
    const cardElement = document.createElement("div");
    cardElement.className = "card large";
    cardElement.style.backgroundImage = `url(images/card${cardIndex}.jpg)`;
    cardElement.addEventListener("click", function() {
      toggleHiddenCard(cardElement, cardIndex);
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.addEventListener("click", function(event) {
      event.stopPropagation();
      removeHiddenCard(cardIndex);
    });

    const starButton = document.createElement("button");
    starButton.textContent = "+";
    starButton.addEventListener("click", function(event) {
      event.stopPropagation();
      addStar(cardIndex);
    });

    const unstarButton = document.createElement("button");
    unstarButton.textContent = "-";
    unstarButton.addEventListener("click", function(event) {
      event.stopPropagation();
      removeStar(cardIndex);
    });

    const buttonsContainer = document.createElement("div");
    buttonsContainer.appendChild(removeButton);
    buttonsContainer.appendChild(starButton);
    buttonsContainer.appendChild(unstarButton);

    const cardContainer = document.createElement("div");
    cardContainer.appendChild(cardElement);
    cardContainer.appendChild(buttonsContainer);

    hiddenCardsContainer.appendChild(cardContainer);
  });

  updateAddCardButtonVisibility();
}
// Lấy một số ngẫu nhiên không trùng lặp từ mảng
function getRandomNumberArray(array, count) {
  const randomArray = [];
  while (randomArray.length < count) {
    const randomIndex = Math.floor(Math.random() * array.length);
    const randomNumber = array[randomIndex];
    if (!randomArray.includes(randomNumber)) {
      randomArray.push(randomNumber);
    }
  }
  return randomArray;
}

// Chọn ngẫu nhiên các lá bài ẩn từ danh sách lá bài đã chọn
function getRandomCards(cards, count, cardVariables) {
  const cardCount = cards.length;
  const randomIndices = getRandomNumberArray([...Array(cardCount).keys()], count);
  const randomCards = randomIndices.map(index => cards[index]);
  const randomCardVariables = randomCards.map(card => cardVariables[card]);
  return randomCards.sort((a, b) => cardVariables[a] - cardVariables[b]);
}

// Render các lá bài ẩn
function renderHiddenCards() {
  const hiddenCardsContainer = document.getElementById("hiddenCards");
  hiddenCardsContainer.innerHTML = "";

  hiddenCards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.className = "card large";
    cardElement.style.backgroundImage = `url(images/card${card}.jpg)`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.addEventListener("click", function(event) {
      event.stopPropagation();
      removeHiddenCard(card);
    });

    const starButton = document.createElement("button");
    starButton.textContent = "+";
    starButton.addEventListener("click", function(event) {
      event.stopPropagation();
      addStar(card);
    });

    const unstarButton = document.createElement("button");
    unstarButton.textContent = "-";
    unstarButton.addEventListener("click", function(event) {
      event.stopPropagation();
      removeStar(card);
    });

    const buttonsContainer = document.createElement("div");
    buttonsContainer.appendChild(removeButton);
    buttonsContainer.appendChild(starButton);
    buttonsContainer.appendChild(unstarButton);

    const cardContainer = document.createElement("div");
    cardContainer.appendChild(cardElement);
    cardContainer.appendChild(buttonsContainer);

    cardContainer.addEventListener("click", function() {
      toggleHiddenCard(cardContainer, card);
    });

    hiddenCardsContainer.appendChild(cardContainer);
  });

  updateAddCardButtonVisibility();
}

// Cập nhật hiển thị nút "Thêm lá bài"
function updateAddCardButtonVisibility() {
  const addCardButton = document.getElementById("addCardButton");
  if (hiddenCards.length === hiddenCardCount) {
    addCardButton.style.display = "none";
  } else {
    addCardButton.style.display = "block";
  }
}
// Xóa lá bài ẩn
function removeHiddenCard(card) {
  hiddenCards = hiddenCards.filter(item => item !== card);
  removedCards.push(card);
  renderHiddenCards();
  const hiddenCardsContainer = document.getElementById("hiddenCards");
  const cards = hiddenCardsContainer.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    const cardElement = cards[i];
    if (cardElement.style.backgroundImage.includes(`card${card}.jpg`)) {
      hiddenCardsContainer.removeChild(cardElement.parentNode);
      break;
    }
  }
}

// Đánh dấu ngôi sao trên lá bài
function addStar(card) {
  const hiddenCardsContainer = document.getElementById("hiddenCards");
  const cards = hiddenCardsContainer.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    const cardElement = cards[i];
    if (cardElement.style.backgroundImage.includes(`card${card}.jpg`)) {
      const star = document.createElement("span");
      star.className = "star";
      star.textContent = "*";
      cardElement.appendChild(star);
      break;
    }
  }
}

// Hủy đánh dấu ngôi sao trên lá bài
function removeStar(card) {
  const hiddenCardsContainer = document.getElementById("hiddenCards");
  const cards = hiddenCardsContainer.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    const cardElement = cards[i];
    if (cardElement.style.backgroundImage.includes(`card${card}.jpg`)) {
      const star = cardElement.getElementsByClassName("star")[0];
      if (star) {
        cardElement.removeChild(star);
      }
      break;
    }
  }
}

// Thêm lá bài
function addCard() {
  if (selectedCount === 10) {
    const availableCards = selectedCards.filter(card => !hiddenCards.includes(card) && !removedCards.includes(card));
    if (availableCards.length === 0) {
      alert("Thẻ bài của bạn đã hết");
    } else {
      let randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      while (hiddenCards.includes(randomCard)) {
        randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      }

      hiddenCards.push(randomCard);
      renderHiddenCards();
      if (hiddenCards.length === hiddenCardCount) {
        addCardButton.style.display = "none";
      } else {
        addCardButton.style.display = "block";
      }
      const removeButton = document.createElement("button");
      removeButton.textContent = "X";
      removeButton.addEventListener("click", function(event) {
        event.stopPropagation();
        removeHiddenCard(randomCard);
      });

      const starButton = document.createElement("button");
      starButton.textContent = "+";
      starButton.addEventListener("click", function(event) {
        event.stopPropagation();
        addStar(randomCard);
      });

      const unstarButton = document.createElement("button");
      unstarButton.textContent = "-";
      unstarButton.addEventListener("click", function(event) {
        event.stopPropagation();
        removeStar(randomCard);
      });

      const buttonsContainer = document.createElement("div");
      buttonsContainer.appendChild(removeButton);
      buttonsContainer.appendChild(starButton);
      buttonsContainer.appendChild(unstarButton);

      const cardContainer = document.createElement("div");
      cardContainer.appendChild(cardElement);
      cardContainer.appendChild(buttonsContainer);
      hiddenCardsContainer.appendChild(cardContainer);
    }
  }
}
