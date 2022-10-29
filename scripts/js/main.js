import { app } from "./database.js"
import { getDatabase, ref, set, onValue, push, child } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js"
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, getAuth } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js"

var img, color, name
let arrayNumber = 0

function createDiv(dKey, dColor, dImg, dName, dText, opacity) {
    dText = dText
        .replace(/</g, "&lt;")
        .replace(/\n/g, "<br />")

    return `<div id="${dKey}" class="boxA${opacity ? " send" : ""}" style="border-left-color: ${dColor};">
    <div class="image"><img src="${dImg}" width="45px" height="45px" class="image" /></div>
    <div class="boxB">
        <div class="user">${dName}</div>
        <div class="text">${dText}</div>
    </div>
    </div>`
}

function writeUserData(text = String()) {
    const db = getDatabase()

    const newPostKey = push(child(ref(db), 'messages/')).key

    set(ref(db, 'messages/' + newPostKey), {
        username: name,
        profile_picture : img,
        text: text,
        color: color,
    })
}

window.onload = () => {
    document.querySelector("button#google").addEventListener("click", () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                
                img = user.photoURL
                color = "#d95333"
                name = user.displayName
                start()
            }).catch((error) => {         
                console.error(error)
            });
    })
    document.querySelector("button#fb").addEventListener("click", () => {
        const provider = new FacebookAuthProvider();
        const auth = getAuth(app);
        
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                
                img = user.photoURL
                color = "#1877f2"
                name = user.displayName
                start()
            }).catch((error) => {         
                console.error(error)
            });
    })
}

function start() {
    document.body.innerHTML = `<div id="chat"></div>
    <div>
        <textarea id="send" placeholder="Aa"></textarea><button id="sendBtn"><img src="src/svg-s/send_FILL0_wght400_GRAD-25_opsz24.svg" style="margin-top: 4.3px" /></button>
        <button style="display: flex; align-items: center; font-size: 0px; background: linear-gradient(90deg, ${color} 15px, #d4d4d4 45px)">
            <div class="image"><img src="${img}" width="45px" height="45px" class="image" /></div>
            <div class="user" style="display: inline-block; font-size: 26px; height: auto;">${name}</div>
            <span type="link" onclick="location.reload();">Logout</span>
        </button>
    </div>`

    document.querySelector("button#sendBtn").addEventListener("click", () => {
        if (!document.querySelector("textarea#send").value.trim().length) return;
        writeUserData(document.querySelector("textarea#send").value)
        document.querySelector("textarea#send").value = ""
    })
    document.querySelector("textarea#send").addEventListener("keydown", (btn) => { 
        if (btn.ctrlKey && btn.code == "Enter") {
            if (!document.querySelector("textarea#send").value.trim().length) return;
            writeUserData(document.querySelector("textarea#send").value)
            setTimeout(document.querySelector("textarea#send").value = "", 1000)
        }
    })

    const db = getDatabase();
    const msg = ref(db, 'messages');
    onValue(msg, (snapshot) => {
        var data = snapshot.val();
        if (data == null) return document.getElementById("chat").innerText = "Nic tu nie ma, jak narazie..."

        setTimeout(() => {data = Object.entries(data)
        
        console.log(data)
        
        let text = ""
        for (let i = arrayNumber; i < data.length; i++) {
            text += createDiv(data[i][0], data[i][1].color, data[i][1].profile_picture, data[i][1].username, data[i][1].text, false) + "\n\n"
        }
        document.getElementById("chat").innerHTML = text}, 1)
    });
    
}