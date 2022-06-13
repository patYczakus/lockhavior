import { app } from "./database/database.config.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js"
var body = document.body
let auth = getAuth()

window.onload = () => {
    body.innerHTML = `<input id="email" type="email" placeholder="email" /><input id="haslo" type="password" placeholder="hasło" /><br />
    <button id="submit">Potwierdź</button>`

    document.getElementById("submit").addEventListener("click", () => {
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
