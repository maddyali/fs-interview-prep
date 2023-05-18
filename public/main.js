// BUTTONS

const xmarkBtns = document.querySelectorAll(".btn-xmark");
const deleteBtns = document.querySelectorAll(".btn-delete");
const updateBtns = document.querySelectorAll(".btn-update");
const submitUpdateBtn = document.getElementById("btn-submit-update");
const createBtn = document.getElementById("btn-create");

const actionBtns = [
  ...xmarkBtns,
  ...deleteBtns,
  ...updateBtns,
  submitUpdateBtn,
  createBtn,
];

// MODALS

const modalContainer = document.querySelector(".modal-container");
const updateModal = document.querySelector(".update-modal");
const createModal = document.querySelector(".create-modal");

// CURRENT QUESTION ID

let currentId = "";

// EVENT LISTENERS

actionBtns.forEach((btn) => {
  if (btn.classList.contains("btn-xmark")) {
    btn.addEventListener("click", closeModals);
  }
  if (btn.classList.contains("btn-delete")) {
    btn.addEventListener("click", deleteQuestion);
  }
  if (btn.classList.contains("btn-update")) {
    btn.addEventListener("click", openUpdateModal);
  }
  if (btn.id === "btn-submit-update") {
    btn.addEventListener("click", updateQuestion);
  }
  if (btn.id === "btn-create") {
    btn.addEventListener("click", openCreateModal);
  }
});

modalContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-container")) closeModals();
});

function openCreateModal() {
  modalContainer.classList.add("active");
  createModal.classList.add("active");
}

function openUpdateModal() {
  modalContainer.classList.add("active");
  updateModal.classList.add("active");

  autoFill(this);
  setCurrentId(this.parentElement.parentElement.id);
}

function closeModals() {
  modalContainer.classList.remove("active");
  createModal.classList.remove("active");
  updateModal.classList.remove("active");
}

function autoFill(btn) {
  const qText = btn.parentElement.parentElement.children[0].textContent;
  const tText = btn.parentElement.parentElement.children[1].textContent;

  document.getElementById("input-update-question").value = qText;
  document.getElementById("input-update-type").value = tText;
}

function setCurrentId(id) {
  currentId = id;
}

// UPDATE QUESTION
const updateForm = document.getElementById("update-form");
updateForm.addEventListener("keydown", handleEnter);

function handleEnter(e) {
  if (e.key == "Enter") return;
}

async function updateQuestion() {
  const updateQ = this.parentElement.parentElement.children[0].value;
  const updateT = this.parentElement.parentElement.children[1].value;

  try {
    const response = await fetch("/updateQuestion", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: currentId,
        question: updateQ,
        type: updateT,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// DELETE QUESTION

async function deleteQuestion() {
  setCurrentId(this.parentElement.parentElement.id);

  try {
    const response = await fetch("/deleteQuestion", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: currentId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
