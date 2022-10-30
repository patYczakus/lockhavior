import { app } from "./database.js"
import { getDatabase, ref, set, onValue, push, child } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js"
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, getAuth } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js"

var img, color, name, uid
var ytLink = "none"
var ytLinkNormal = null
let arrayNumber = 0

function writeUserData(text = String(), yt_link) {
    const db = getDatabase()

    var info
    if (yt_link != "none" && yt_link != null) {
        info = {
            username: name,
            profile_picture : img,
            text: text,
            border_color: color,
            user_id: uid,
            youtube_video_link: yt_link
        }

        ytLink = "none"
        ytLinkNormal = null
        document.querySelector("button#addYtVideo").style.background = "#d4d4d4"
    } else {
        info = {
            username: name,
            profile_picture : img,
            text: text,
            border_color: color,
            user_id: uid 
        }
    }

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
}

function start() {
    document.body.innerHTML = `<div id="chat"></div>
    <div>
        <textarea id="send" placeholder="Aa"></textarea>
        <button id="sendBtn"><img alt="Wyślij" src="src/svg-s/send.svg" style="margin-top: 4.3px" /></button>
        <button id="addYtVideo"><img alt="Link do YT" src="src/svg-s/youtube_activity.svg" style="margin-top: 4.3px" /></button>
        <div id="btn" style="
            display: inline-flex;
            align-items: center; 
            font-size: 0px; 
            background: linear-gradient(90deg, ${color} 15px, #d4d4d4 45px);
            -webkit-tap-highlight-color: transparent;
        "><div class="image"><img src="${img}" width="45px" height="45px" class="image" /></div>
            <div class="user" style="display: inline-block; font-size: 26px; height: auto; margin-right: 10px">${name}</div>
            <button class="small" onclick="location.reload();"><img alt="Wyloguj" src="src/svg-s/logout.svg"/></span>
        </button>
    </div>`

    document.querySelector("button#sendBtn").addEventListener("click", () => {
        if (!document.querySelector("textarea#send").value.trim().length) return;
        writeUserData(document.querySelector("textarea#send").value, ytLink)
        document.querySelector("textarea#send").value = ""
    })
    document.querySelector("button#addYtVideo").addEventListener("click", () => {
        ytLink = prompt(`Podaj link do wideo${ytLinkNormal != null ? "\nWyczyść, aby usunąć link": ""}`, ytLinkNormal != null ? ytLinkNormal : "")
        if (ytLink == null || ytLink == "") { 
            ytLink == "none" 
            ytLinkNormal = null
            document.querySelector("button#addYtVideo").style.background = "#d4d4d4"
        }
        else if (ytLink.startsWith("https://youtu.be/") || ytLink.startsWith("https://www.youtube.com/watch")) {
            ytLinkNormal = ytLink
            ytLink = ytLink.replace("https://www.youtube.com/watch", "").replace("https://youtu.be/", "")
            if (ytLink.indexOf("?t=") > -1) { 
                ytLink = ytLink.split("?t=") 
                ytLink = {
                    code: ytLink[0],
                    timer: ytLink[1]
                }
            } else {
                ytLink = {
                    code: ytLink
                }
            }

            document.querySelector("button#addYtVideo").style.background = "#1bff00"
        }
        else {
            alert("Zły link!")
            ytLink = "none" 
            ytLinkNormal = null
            document.querySelector("button#addYtVideo").style.background = "#d4d4d4"
        }
    })
    document.querySelector("textarea#send").addEventListener("keydown", (btn) => { 
        if (btn.ctrlKey && btn.code == "Enter") {
            if (!document.querySelector("textarea#send").value.trim().length) return;
            writeUserData(document.querySelector("textarea#send").value, ytLink)
            setTimeout(document.querySelector("textarea#send").value = "", 1000)
        }
    })

    const db = getDatabase();
    const msg = ref(db, 'lastmessage/');
    
    onValue(msg, (snapshot) => {
        var data = snapshot.val();

        

        let text = ""    
        var args = ""
        if ("youtube_video_link" in data) { 
            args += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${data.youtube_video_link.code}{yt-timer-c34}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="margin-left: 8px; border-radius: 0.8rem; margin-top: 4px; border: 8px double black;"></iframe>` 
            if ("timer" in data.youtube_video_link) args = args.replace("{yt-timer-c34}", `?start=${data.youtube_video_link.timer}`) 
            else args = args.replace("{yt-timer-c34}", "")
        }

        text += `<div id="${data.user_id}" class="boxA" style="border-left-color: ${data.border_color};">
        <div class="image"><img src="${data.profile_picture}" width="45px" height="45px" class="image" /></div>
        <div class="boxB">
            <div class="user">${data.username}</div>
            <div class="text">${data.text.replace(/</g, "&lt;").replace(/\n/g, "<br />")}</div>
            ${args}
        </div>
        </div>`
        text += "\n\n"
        document.getElementById("chat").innerHTML += text
    })
}