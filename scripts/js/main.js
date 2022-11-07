import { app } from "./database.js"
import { getDatabase, ref, set, onValue, child, get } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js"
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js"

var version = 1
var img, color, name, uid, theme

function authError(type = "log" || "reg", text = String()) {
    document.querySelector(`div#${type} span#error`).innerText = `❌ ${text}`
    setTimeout(() => {
        document.querySelector(`div#${type} span#error`).innerText = `❌`
    }, text.length * 35)
}

function writeUserData(text = String()) {
    const db = getDatabase()
    var yt_link = document.getElementById("yt-link-input").value
    var info

    if (yt_link != "" && (yt_link.startsWith("https://youtu.be/") || yt_link.startsWith("https://www.youtube.com/watch?v="))) {
        yt_link = yt_link.replace("https://youtu.be/", "").replace("https://www.youtube.com/watch?v=", "")
        if (yt_link.indexOf("t=") > -1) {
            yt_link = yt_link.split("t=")
            yt_link = {
                code: yt_link[0],
                timer: yt_link[1].slice(1)
            }
        } else {
            yt_link = {
                code: yt_link
            }
        }

        info = {
            username: name,
            profile_picture : img,
            text: text,
            border_color: color,
            user_id: uid,
            youtube_video_link: yt_link
        }
    } else {
        info = {
            username: name,
            profile_picture : img,
            text: text,
            border_color: color,
            user_id: uid 
        }
    }

    document.getElementById("yt-link-input").value = ""

    set(ref(db, 'lastmessage/'), info)
}

window.onload = () => {
    document.querySelector("button#google").addEventListener("click", () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user)

                img = user.photoURL
                color = "#d95333"
                name = user.displayName
                uid = user.uid
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
                
                console.log(user)
                img = user.photoURL
                color = "#1877f2"
                name = user.displayName
                uid = user.uid
                start()
            }).catch((error) => {         
                console.error(error)
            });
    })
    document.querySelector(`div#log button[type=submit]`).addEventListener("click", () => {
        const auth = getAuth(app);
        
        signInWithEmailAndPassword(auth, document.querySelector(`div#log input#email`).value, document.querySelector(`div#log input#password`).value)
            .then((result) => {
                const user = result.user;
                console.log(user)

                img = "src/images/lockhavior_user.png"
                color = "#3cc358"
                name = `Lockhavior user (${document.querySelector(`div#log input#email`).value})`
                uid = user.uid
                start()
            }).catch((error) => { 
                if (error.code == "auth/user-not-found") authError("log", "Nie znaleziono konta, spróbuj inne.")
                if (error.code == "auth/wrong-password") authError("log", "Złe hasło.")
                else console.error(error)
            });
    })
    document.querySelector(`div#reg button[type=submit]`).addEventListener("click", () => {
        if (document.querySelector(`div#reg input#password1`).value != document.querySelector(`div#reg input#password2`).value) return authError("reg", "Różne hasła")
        if (document.querySelector(`div#reg input#name`).value.length < 3 || document.querySelector(`div#reg input#name`).value.length > 25) return authError("reg", "Niepoprawna nazwa użytkownika - powinna zawierać ilość liter od 3 do 25")

        const auth = getAuth(app);
        
        createUserWithEmailAndPassword(auth, document.querySelector(`div#reg input#email`).value, document.querySelector(`div#reg input#password1`).value)
            .then((result) => {
                const user = result.user;
                console.log(user)

                img = "src/images/lockhavior_user.png"
                color = "#3cc358"
                name = document.querySelector("div#reg input#name").value
                uid = user.uid
                start()
            }).catch((error) => {     
                console.error(error)
            });
    })
}

function start() {
    const dbRef = ref(getDatabase())
    get(child(dbRef, `setting_data/${uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Data avaible!")
            const setting_data = snapshot.val()

            name = setting_data.nickname
            changeTheme(setting_data.theme)
            theme = setting_data.theme
        } else {
            console.log("No data available. Creating it...")
            set(ref(getDatabase(), `setting_data/${uid}`), {
                version: 1,
                theme: "light",
                nickname: name,
            }).then(() => {
                console.log("Created!")
            })
        }

        document.body.innerHTML = `<input id="yt-link-input" type="text" placeholder="Wpisz/skopiuj link. Wyczyść, aby usunąć link"/>
        <div id="chat"></div>
        <div>
            <textarea id="send" placeholder="Aa"></textarea>
            <button id="sendBtn"><span class="material-symbols-outlined" style="margin-top: 2.9px;">send</span></button>
            <button id="addYtVideo"><span class="material-symbols-outlined" style="margin-top: 4px;">youtube_activity</span></button>
            <div id="btn" style="
                display: inline-flex;
                align-items: center; 
                font-size: 0px; 
                --accent-color: ${color};
                -webkit-tap-highlight-color: transparent;
            "><div class="image"><img src="${img}" width="45px" height="45px" class="image" /></div>
                <div class="user" style="display: inline-block; font-size: 26px; height: auto; margin-right: 10px">${name}</div>
                <div class="user-btns">
                    <button class="small" onclick="location.reload();"><span class="material-symbols-outlined" style="margin-top: 1.5px;">logout</span>
                    <button id="settingIcon" class="small"><span class="material-symbols-outlined" style="margin-top: 1.5px;">settings</span></span>
                </div>
            </button>
        </div>
        <div id="settings">
            <button class="small" style="background: transparent; font-size: 45px" role="close">&times;</button>
            <p>
                <h2>Nazwa użytkownika</h2>
                <input value="${name}" type="text" id="username" ${color == "#3cc358" ? "" : "disabled"}> ${color == "#3cc358" ? "" : "Ze względu na to, iż to konto firmy trzeciej, nie możesz zmienić nazwy"}
            </p>
            <p>
                <h2>Motyw</h2>
                <select>
                    <option value="light" ${theme == "light" ? "selected" : ""}>Jasny</option>
                    <option value="dark" ${theme == "dark" ? "selected" : ""}>Ciemny</option>
                </select>
            </p>
            <button role="apply">Wprowadź zmiany</button>
            </div>
        </div>`

        document.querySelector("button#sendBtn").addEventListener("click", () => {
            if (!document.querySelector("textarea#send").value.trim().length) return;
            writeUserData(document.querySelector("textarea#send").value)
            document.querySelector("textarea#send").value = ""
        })
        document.querySelector("button#addYtVideo").addEventListener("click", () => {
            document.getElementById("yt-link-input").classList.toggle("active")
        })
        document.querySelector("button#settingIcon").addEventListener("click", () => {
            document.getElementById("settings").classList.toggle("active")
        })
        document.querySelector(`#settings button[role="close"]`).addEventListener("click", () => {
            document.getElementById("settings").classList.remove("active")
        })
        document.querySelector("textarea#send").addEventListener("keydown", (btn) => { 
            if (btn.ctrlKey && btn.code == "Enter") {
                if (!document.querySelector("textarea#send").value.trim().length) return;
                writeUserData(document.querySelector("textarea#send").value)
                setTimeout(document.querySelector("textarea#send").value = "", 1000)
            }
        })
        document.querySelector(`#settings button[role="apply"]`).addEventListener("click", settingFunc)

        const db = getDatabase();
        const msg = ref(db, 'lastmessage/');
        
        onValue(msg, (snapshot) => {
            var data = snapshot.val();

            let text = ""    
            var args = ""
            if ("youtube_video_link" in data) { 
                args += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${data.youtube_video_link.code}{yt-timer-c34}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` 
                if ("timer" in data.youtube_video_link) args = args.replace("{yt-timer-c34}", `?start=${data.youtube_video_link.timer}`) 
                else args = args.replace("{yt-timer-c34}", "")
            }

            text += `<div id="${data.user_id}" class="boxA send" style="border-left-color: ${data.border_color};">
            <div class="image"><img src="${data.profile_picture}" width="45px" height="45px" class="image" /></div>
            <div class="boxB">
                <div class="user">${data.username.replace(/&/g, "&#38;").replace(/</g, "&lt;")}</div>
                <div class="text">${data.text.replace(/&/g, "&#38;").replace(/</g, "&lt;").replace(/\n/g, "<br />")}</div>
                ${args}
            </div>
            </div>`
            text += "\n\n"
            document.getElementById("chat").innerHTML += text

            setTimeout(() => {
                document.querySelector("div.send").classList.remove("send")
            }, 400)
        })
    }).catch((error) => {
        console.error(error);
    });
}

function settingFunc() {
    let numbers = 2

    if (document.querySelector("#settings select").value == theme) numbers--
    if (document.querySelector("#settings #username").value == name) numbers--
    if (document.querySelector("#settings #username").value.length < 3 || document.querySelector("#settings select").value.length > 25) return

    console.log(numbers)
    if (numbers == 0) {} else {
        changeTheme(document.querySelector("#settings select").value)

        theme = document.querySelector("#settings select").value
        name = document.querySelector("#settings #username").value
        document.querySelector("div.user").innerText = name

        var db = getDatabase()
        set(ref(db, `setting_data/${uid}`), {
            theme: theme,
            nickname: name,
            version: 1,
        })
    }
}

function changeTheme(id) {
    if (id == "dark") {
        if (!document.body.classList.contains("dark")) document.body.classList.value = "dark"
    } else if (id == "light") {
        if (!document.body.classList.contains("light")) document.body.classList.value = "light"
    } else {
        console.error("\"id\" not specified.")
    }
}