const year = document.querySelector("#year");
const pendingButtons = document.querySelectorAll("[data-note]");

if (year) {
  year.textContent = new Date().getFullYear();
}

pendingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const existing = button.parentElement.querySelector(".project-note");

    if (existing) {
      existing.remove();
      return;
    }

    const note = document.createElement("p");
    note.className = "project-note";
    note.textContent = button.dataset.note;
    button.parentElement.append(note);
  });
});
