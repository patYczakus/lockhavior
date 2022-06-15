import { app } from "./database/database.config.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js"
var body = document.body
let auth = getAuth()

window.onload = () => {
    // Tworzenie zawartości nagłówka
    body.innerHTML = `<div id="header"><div style="display: inline-block; float: left;">C0nn3cted!</div></div>
    `

    // Tworzenie formularza logowania oraz rejestru
    body.innerHTML += `
    <div class="forms">
        <div class="form login">
            <h2>Logowanie</h2>
            Posiadasz już konto w C0nn3cted? Ta forma pozwoli Ci powrócić bezpośrednio do konta, nie tracąc przy tym niczego!
            <br /><br /><br />
            <input id="log-email" type="email" placeholder="Email" /><br />
            <input id="log-haslo" type="password" placeholder="Hasło" /><br />
            <button id="submit-login" type="button">Potwierdź</button>
            <div class="error"></div>
        </div>
        <div class="form register">
            <h2>Rejestrowanie</h2>
            Jesteś nowy? Ten formularz pozwoli Ci utworzyć konto do portalu!
            <br /><br /><br />
            <input id="reg-email" type="email" placeholder="Email" /><br />
            <input id="reg-haslo1" type="password" placeholder="Hasło" /><br />
            <input id="reg-haslo2" type="password" placeholder="Powtórz hasło" /><br />
            <button id="submit-register" type="button">Potwierdź</button>
            <div class="error"></div>
        </div>
    </div>
    `

    document.getElementById("submit-login").addEventListener("click", () => {
        if (!document.getElementById("email").value || !document.getElementById("haslo").value) return alert("Brak emaila/hasła!")

        signInWithEmailAndPassword(auth, document.getElementById("email").value, document.getElementById("haslo").value)
            .then((response) => {
                console.log(response.user)
            })
            .catch((err) => {
                alert(err.message)
            })
    })
}

// function lightdarkTheme() {
//     body.classList.toggle("dark")
// }
