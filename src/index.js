const API_URL = "https://randomuser.me/api/" //https://randomuser.me/documentation
const $userForm = document.querySelector("#userForm")
const $gender = document.querySelector("#gender")
const $nationality = document.querySelector("#nationality")
const $cardContainer = document.querySelector("#cardContainer")
const $cardTemplate = document.querySelector("#card")

const genders = [
  ["male", "Masculino"],
  ["female", "Femenino"],
]
const nationalities = [
  ["es", "España"],
  ["gb", "Reino Unido"],
  ["nz", "Nueva Zelanda"],
  ["rs", "Serbia"],
  ["ch", "Suiza"],
]

function setSelectOptions($select, options) {
  options.forEach(([value, text]) =>
    $select.appendChild(new Option(text, value))
  )
}

function buildQueryString(query) {
  const queryString = Object.entries(query)
    .filter(([, value]) => value !== "")
    .map(([param, value]) => `${param}=${value}`)
    .join("&")

  return queryString !== "" ? `?${queryString}` : ""
}

function createCard(user) {
  const {
    name: { first, last },
    picture: { large },
    email,
    location: { country },
  } = user

  const card = $cardTemplate.content.cloneNode(true)
  card.querySelector("[data-profile]").src = large
  card.querySelector("[data-full-name]").innerText = `${first} ${last}`
  card.querySelector("[data-country-name]").innerText = country
  card.querySelector("[data-email]").href = `mailto:${email}`

  return card
}

async function fetchUsers(query = {}) {
  const queryString = buildQueryString(query)
  try {
    const respuesta = await fetch(`${API_URL}${queryString}`)
    const { results: users } = await respuesta.json()
    const $fragment = new DocumentFragment()
    users.forEach((user) => $fragment.appendChild(createCard(user)))
    $cardContainer.appendChild($fragment)
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

addEventListener("load", () => {
  setSelectOptions($gender, genders)
  setSelectOptions($nationality, nationalities)
})

$userForm.addEventListener("submit", (event) => {
  event.preventDefault()
  const query = Object.fromEntries(new FormData(event.target))
  fetchUsers(query)
})

$userForm.addEventListener("reset", () => $cardContainer.innerHTML = "")
