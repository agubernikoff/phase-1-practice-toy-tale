let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyColection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  function fetchCharacters() {
    fetch("http://localhost:3000/toys")
      .then((resp) => resp.json())
      .then((data) => data.forEach((toy) => renderToyCard(toy)));
  }
  fetchCharacters();

  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card${toy.id}`;
    const toyName = document.createElement("h2");
    toyName.innerText = toy.name;
    const toyImg = document.createElement("img");
    toyImg.src = toy.image;
    toyImg.className = "toy-avatar";
    const toyP = document.createElement("p");
    toyP.innerText = `${toy.likes} likes`;
    const toyBttn = document.createElement("button");
    toyBttn.className = "toy-btn";
    toyBttn.id = toy.id;
    toyBttn.innerText = "Like ❤️";
    card.append(toyName, toyImg, toyP, toyBttn);
    toyColection.append(card);
    toyBttn.addEventListener("click", () => updateLikes(toy));
  }

  function addNewToy() {
    toyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = toyForm.firstElementChild.nextElementSibling;
      const imageInput =
        toyForm.firstElementChild.nextElementSibling.nextElementSibling
          .nextElementSibling;
      const newToyObj = {
        name: nameInput.value,
        image: imageInput.value,
        likes: 0,
      };
      fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newToyObj),
      })
        .then((resp) => resp.json())
        .then((data) => renderToyCard(data));
    });
  }
  addNewToy();

  function updateLikes(toy) {
    const newNumberOfLikes = ++toy.likes;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({ likes: newNumberOfLikes }),
    })
      .then((resp) => resp.json())
      .then((data) => updateToyCard(data));
  }
  function updateToyCard(toy) {
    const toyCard = document.querySelector(`#card${toy.id}`);
    const toyP =
      toyCard.firstElementChild.nextElementSibling.nextElementSibling;
    toyP.innerText = `${toy.likes} likes`;
  }
});
