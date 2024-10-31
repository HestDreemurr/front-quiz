let checkBox = document.querySelector("#alterar-tema input")

checkBox.addEventListener("change", (event) => {
  if (event.target.checked) {
    document.body.setAttribute("data-theme", "dark")
  } else {
    document.body.setAttribute("data-theme", "light")
  }
})