
const hostUrl = "http://192.168.0.109:2077/";

const apiBaseUrl = hostUrl + "api/folder";

let currentPath = "/";

function sortByType(array) {
    return array.sort((a, b) => {
        const typeA = a.name.split(".").pop();
        const typeB = b.name.split(".").pop();
        return typeA.localeCompare(typeB);
    })
}

function sortByDate(array) {
    return array.sort((a, b) => {
        return new Date(a.ctime) - new Date(b.ctime);
    })
}

async function fetchFiles(url, sort_method) {
    var data;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response Status ${response.status}`);
        }
        data = await response.json();
    } catch (e) {
        console.error(e);
    }

    var sorted = sort_method(data)
    
    return sorted;
}



function createIconFromMimeType(filetype, mime) {
    var icon = document.createElement("img");
    icon.setAttribute("class", "list-icon");

    if (mime) {
        var mime_str = mime.split("/")[0];
        //console.log("Mime", mime_str);
        switch (mime_str) {
            case "text":
                icon.src = "icons/material-symbols-light--text-snippet-outline-sharp.svg";
                break;
            case "image":
                icon.src = "icons/material-symbols-light--image-outline-sharp.svg"
                break;
            case "video":
                icon.src = "icons/material-symbols-light--animated-images-outline-sharp.svg";
                break;
            case "audio":
                icon.src = "icons/material-symbols-light--music-note-rounded.svg"
                break;
            case "application":
                icon.src = "icons/material-symbols-light--file-copy-outline-sharp.svg"
                break;
            default:
                icon.src = "icons/material-symbols-light--file-copy-outline-sharp.svg"
        }
    }
    else {
        if (filetype == "folder") {
            icon.src = "icons/material-symbols-light--folder-open-sharp.svg";
        }
    }


    return icon;

}

function setFilePreview(file) {
    var preview = document.getElementById("file-preview")
    var mimetype = file.mime.split("/")[0];


    var previewBox = document.getElementById("preview-box");
    if (previewBox) {
        previewBox.remove();
    }

    var previewDiv
    if (mimetype == "image") {
        previewDiv = document.createElement("img");
        
        previewDiv.src = hostUrl + "den/" + file.dir;
    }
    else if (mimetype == "text") {
        previewDiv  = document.createElement("iframe");
        previewDiv.style.width = "100%";
        previewDiv.style.height = "100%";
        previewDiv.setAttribute("src", hostUrl + "den/" + file.dir);
    }
    else if (mimetype == "video") {
        previewDiv = document.createElement("video");
        previewDiv.style.width = "auto";
        previewDiv.style.height = "100%";
        previewDiv.setAttribute("controls", "");
        previewDiv.src = hostUrl + "den/" + file.dir;
    }
    else {
        previewDiv = document.createElement("div");
        previewDiv.setAttribute("class", "preview-not-available");
        var p = document.createElement("p");
        p.textContent = "PREVIEW NOT AVAILABLE";
        previewDiv.appendChild(p);
    }
    previewDiv.setAttribute("id", "preview-box")
    preview.appendChild(previewDiv);

    var textDesc = document.getElementById("text-descriptions")
    if (textDesc) {textDesc.remove()}

    textDesc = document.createElement("div");
    textDesc.setAttribute("id", "text-descriptions");

    for (const attr in file) {
        var text = document.createElement("p");
        text.setAttribute("class", "text-description-item");
        text.textContent = `${attr}:  ${file[attr]}`;
        textDesc.appendChild(text);
    }
    var viewer = document.getElementById("file-viewer");

    viewer.appendChild(textDesc);
    
}


async function navigateTo(path, pushHistory = true) {
    
    const data = await fetchFiles(apiBaseUrl + path, sortByType);

    list = document.getElementById("item-list");
    list.replaceChildren();

    data.forEach(item => {
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.textContent = item.name;
        if (item.type == "folder") {
            li.addEventListener("click", () => {
            currentPath = "/" + item.dir;
            navigateTo(currentPath)
            })        
        }
        else {
            li.addEventListener("click", () => {
                setFilePreview(item);
            })
        }
        var icon = createIconFromMimeType(item.type, item.mime)
         
        li.insertBefore(icon, null) 
        li.appendChild(link)
        li.setAttribute("class", "item-entry");
        list.appendChild(li);
    })
    if (pushHistory) {
        history.pushState({folder_path: path}, "", null);
        //console.log("State path: " + history.state.folder_path + "State len:", history.length)
    }
    return;
}

window.addEventListener('DOMContentLoaded', (event) => {
  navigateTo(currentPath);
})

window.addEventListener('popstate', async (event) => {
  currentPath = event.state.folder_path;
  navigateTo(currentPath, false); 

})
