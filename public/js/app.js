const filterWrapper = document.querySelector(".filter-wrapper");
const saveButton = document.querySelector(".form-content-save-button");
const switchModes = document.querySelector(".form-content-create-button");

const node = new CreateNodeFromInputs();

let modeCreate = true;

(async function getData() {
    try {
        const req = await fetch("../filters.json");
        const res = await req.json();
        let filters = Array.from(res?.filters);
        createNodeList(filters);
    } catch(err) {
        console.log(err);
    }
}())

function createNodeList(filters) {
    node.update({filter: filters});
    const filterList = document.createElement("ul");
    filterList.classList.add("filterList");
    
    filters.forEach((key, index) => {
        const filterField = document.createElement("li");
        filterField.classList.add("filterField");
        
        const filterFieldName = document.createElement("h2");
        filterFieldName.classList.add("filterFieldName");
        filterFieldName.innerHTML = key.filterName;
        
        const filterFieldEdit = document.createElement("button");
        filterFieldEdit.classList.add("filterFieldButton");
        filterFieldEdit.innerHTML = "edit";
        filterFieldEdit.dataset.index = index;
        filterFieldEdit.onclick = () => {createData(filterFieldEdit, filters, false)};
        
        filterField.append(filterFieldName, filterFieldEdit);
        filterList.appendChild(filterField);
        filterWrapper.appendChild(filterList);
    })
}
            
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function createData(elm, filters, mode = true) {
    const key = filters[elm.dataset.index];

    node.update({
        filterName: key.filterName,
        wordsContains: key.wordsContains,
        wordsContainsNot: key.wordsContainsNot,
        playSound: key.playSound,
        soundPath: key.soundPath,
        highlightMessage: key.highlightMessage,
        highlightColorR: key.highlightColorR,
        highlightColorG: key.highlightColorG,
        highlightColorB: key.highlightColorB,
        hideMessage: key.hideMessage,
        displayInSecondChat: key.displayInSecondChat,
        filterTooltips: key.filterTooltips,
        room: key.room,
        highlightHex: rgbToHex(key.highlightColorR, key.highlightColorG, key.highlightColorB),
        filter: filters,
        index: elm.dataset.index,
        createMode: mode}
    );

    // const blob = new Blob([JSON.stringify(res)], {type:"application/json"});
    // const href = URL.createObjectURL(blob);
    
    // const a = Object.assign(document.createElement("a"), {href, style:"display:none", download:"filtersNew.json", textContent: "filterNewbackup.json"});
    
    // document.body.appendChild(a);
    
    // a.click();
    // URL.revokeObjectURL(href);
    // a.remove();
}

saveButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (modeCreate) {
        const fieldWrapper = document.querySelector(".filter-wrapper");
        node.updateFilter();
        fieldWrapper.innerHTML = "";
        createNodeList(node.getNode().filter);
    }
})

switchModes.addEventListener("click", (e) => {
    e.preventDefault();
    
    node.update({createMode: true});
})
