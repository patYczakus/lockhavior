import { app } from "./database.js"
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js"
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, getAuth } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js"

var img, color, name, uid

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
}

function start() {
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
            <button class="small" onclick="location.reload();"><span class="material-symbols-outlined" style="margin-top: 1.5px;">logout</span></span>
        </button>
    </div>`

    document.querySelector("button#sendBtn").addEventListener("click", () => {
        if (!document.querySelector("textarea#send").value.trim().length) return;
        writeUserData(document.querySelector("textarea#send").value)
        document.querySelector("textarea#send").value = ""
    })
    document.querySelector("button#addYtVideo").addEventListener("click", () => {
        document.getElementById("yt-link-input").classList.toggle("active")
    })
    document.querySelector("textarea#send").addEventListener("keydown", (btn) => { 
        if (btn.ctrlKey && btn.code == "Enter") {
            if (!document.querySelector("textarea#send").value.trim().length) return;
            writeUserData(document.querySelector("textarea#send").value)
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
            args += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${data.youtube_video_link.code}{yt-timer-c34}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` 
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