const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTY1NzAzOCwiZXhwIjoxOTU1MjMzMDM4fQ.EzDm1wsIr8aC8gW7YEVWDGxXrIEZPV6R7ZyVvJ4d7Bc"

const API_URL = "https://tbzrjnqxccgkgvarbwpr.supabase.co/rest/v1/idees"

//RECUPERER LES ELEMENTS DU DOM
const propositionElement = document.getElementById("propositions")
const ideeForm = document.querySelector("form")
const inputTitre = document.querySelector("input#titre")
const inputSuggestion = document.querySelector("textarea#suggestion")


//NOS FONCTIONS
const creerUneCarte = (idee) => {
    //création de nos idee
    const idButtonValider = "btn-valider" + idee.id
    const idButtonRefuser = "btn-refuser" + idee.id
    const idCard = "numero-card" + idee.id
    
    //Insertion de la carte au niveau du DOM
    propositionElement.insertAdjacentHTML("beforebegin",`
    <div class="card m-3" style="width: 18rem;" id=${idCard}>
    <div class="card-body">
      <h5 class="card-title">${idee.titre}</h5>
      <h6 class="card-subtitle mb-2">Appouvee/Refuser</h6>
      <p class="card-text">${idee.suggestion}</p>
      <button href="#" class=" btn btn-success card-link" id=${idButtonValider}>Valider</a>
      <button href="#" class="btn btn-danger card-link" id=${idButtonRefuser}>Refuser</a>
    </div>
    </div>`)
    
    //Ajout des évenements  sur les bouttons valider et refuser
    const btnValider = document.getElementById(idButtonValider)
    const btnRefuser = document.getElementById(idButtonRefuser)
    
    //Ecouter l'évenement click sur les boutons
    btnValider.addEventListener("click", (event)=>{
        //on prend l'id de l'idée
        fetch(API_URL + "?id=eq." + idee.id,{
            method: "PATCH",
            headers: {
              apikey: API_KEY,
              "Content-Type": "application/json",
              Prefer: "return=representation"
            },
            body: JSON.stringify({statut: true}),
          }).then((response) => response.json())
              .then((data) => {
               if (data[0].statut === true) {
                    //On récupere la carde concernée
                const divColor = document.getElementById(idCard)
                divColor.style.border = "1px solid green"
                btnValider.style.visibility ="hidden"
                 btnRefuser.style.visibility ="visible"
    
                    //Chage le message au niveau du h6
    
                 const h6 = document.querySelector("#" + idCard + " h6")
                 h6.textContent = "Approuvee"
                 h6.style.color="green"
               }
              })
    })
    
    
    btnRefuser.addEventListener("click", (event)=>{
        //on prend l'id de l'idée
        fetch(API_URL + "?id=eq." + idee.id,{
            method: "PATCH",
            headers: {
              apikey: API_KEY,
              "Content-Type": "application/json",
              Prefer: "return=representation"
            },
            body: JSON.stringify({statut: false}),
          }).then((response) => response.json())
              .then((data) => {
               if (data[0].statut === false) {
                   //On récupere la carde concernée
                const divColor = document.getElementById(idCard)
                divColor.style.border = "1px solid red"
                btnRefuser.style.visibility ="hidden"
                btnValider.style.visibility ="visible"
    
                    //Chage le message au niveau du h6
                 const h6 = document.querySelector("#" + idCard + " h6")
                 h6.textContent = "Refuser"
                 h6.style.color="red"
               }
              })
    })
    
}

//VERIFICATION DES MOTS SAISIS

inputSuggestion.addEventListener("input", (event) => {
    const longueurMax = 130
    const contenuSaisi = inputSuggestion.value
    const longueurSaisi = contenuSaisi.length
    const reste = longueurMax - longueurSaisi
  
    //actualiser le dom pour afficher le nombre
    const paragraphCompteur = document.getElementById("limite-text")
    const compteurText = document.getElementById("text-progress")
    const restantText = document.getElementById("text-restant")
    const btnSuggestion = document.getElementById("btn-suggestion")
    compteurText.textContent = longueurSaisi
    restantText.textContent = " Il vous reste " + reste
  
    //changer couleur
  
    if (reste < 0) {
      paragraphCompteur.style.color = "#ce0033"
      btnSuggestion.disabled = true
    } else if (reste <= 16) {
      paragraphCompteur.style.color = "yellow"
      btnSuggestion.disabled = false
    } else {
      paragraphCompteur.style.color = "#00000"
      btnSuggestion.disabled = false
    }
})

//RECUPERATION DES INFORMATIONS DU FORMULAIRE

ideeForm.addEventListener("submit", (event) => {
    event.preventDefault()
  
    // Récupération des informations saisies
    const titreSaisi = inputTitre.value
    const suggestionSaisi = inputSuggestion.value
  
    if (titreSaisi.trim().length < 5 || suggestionSaisi.trim().length < 10) {
      alert("Merci de saisir des informations correctes")
      return
    }
  
    // mettre les informations sous forme
    const nouvelleIdee = {
      titre: titreSaisi,
      suggestion: suggestionSaisi,
      statut: false,
    }
  
    //ENVOYER LES DONNEES VERS SUPABASE
    fetch(API_URL, {
      method: "POST",
      headers: {
        apikey: API_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(nouvelleIdee),
    }).then((response) => response.json())
        .then((data) => {
            ideeCreeAuNiveauAPI = data[0]
            creerUneCarte(ideeCreeAuNiveauAPI)
        })
  
    // on vide les champs
    inputTitre.value = ""
    inputSuggestion.value = ""
  
    //AJOUT DE LA NOUVELLE IDEE AU NIVEAU DE LA PAGE
    
    console.log(creerUneCarte);
})

//AFFICHAGE DANS NOTRE BASE

window.addEventListener("DOMContentLoaded", (event) => {
    //RECUPERATION DES DONNEES VIA API
    fetch(API_URL, {
      method: "GET",
      headers: {
        apikey: API_KEY,
        "Authorization": "Bearer " +API_KEY
      }
    })
    .then((Response) => Response.json())
    .then((idees) => {
        idees.forEach((idee) => {
          creerUneCarte(idee)
        })
    })
})






