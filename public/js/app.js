const filterWrapper = document.querySelector(".filter-wrapper");
const saveButton = document.querySelector(".form-content-save-button");
const switchModes = document.querySelector(".form-content-create-button");
const downloadButton = document.querySelector(".download-button");
const uploadButton = document.querySelector(".upload-button");

const node = new CreateNodeFromInputs();

(async function getData() {
    const format = localStorage.getItem("filterFormatterData");
    if (format) {
        let filterData = await JSON.parse(format);
        createNodeList(filterData?.filters);
    }

    if (!format) {
        try {
            const req = await fetch("../filters.json");
            const res = await req.json();
            let filters = Array.from(res?.filters);
            createNodeList(filters);
        } catch(err) {
            console.log(err);
        }
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

        const filterToggles= document.createElement("div");
        filterField.classList.add("filterFieldToggles");
        
        const filterFieldEdit = document.createElement("button");
        filterFieldEdit.classList.add("filterFieldButton");
        filterFieldEdit.innerHTML = "edit";
        filterFieldEdit.dataset.index = index;
        filterFieldEdit.onclick = () => {createData(filterFieldEdit, filters, false)};

        const filterFieldDelete = document.createElement("button");
        filterFieldDelete.classList.add("filterFieldButton");
        filterFieldDelete.innerHTML = "Delete";
        filterFieldDelete.dataset.index = index;
        filterFieldDelete.onclick = () => {deleteData(index)};
        
        filterToggles.append(filterFieldEdit, filterFieldDelete)
        filterField.append(filterFieldName, filterToggles);
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
}

function deleteData(index) {
    node.deleteNode(index);

    const fieldWrapper = document.querySelector(".filter-wrapper");

    node.saveData();
    const format = localStorage.getItem("filterFormatterData");

    fieldWrapper.innerHTML = "";
    createNodeList(JSON.parse(format)?.filters);
}

saveButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (node.getNode().filterName !== "") {
        const fieldWrapper = document.querySelector(".filter-wrapper");
        node.updateFilter();
    
        node.saveData();
        const format = localStorage.getItem("filterFormatterData");
    
        fieldWrapper.innerHTML = "";
        createNodeList(JSON.parse(format)?.filters);
    } else {
        document.querySelector(".form-content .filterName").focus();
    }
})

switchModes.addEventListener("click", (e) => {
    e.preventDefault();
    
    node.update({createMode: true});
})

downloadButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    node.createJSONFile();
})

uploadButton.addEventListener("change", async (e) => {
    e.preventDefault();

    const files = uploadButton.files;

    let res = [];

    for (let file of files) {
        res = await read(file);
    }

    if (res?.filters && Array.isArray(res?.filters) && res?.filters.length > 0) {
        const fieldWrapper = document.querySelector(".filter-wrapper");
        node.update({filter: res.filters});
        node.saveData();
        const format = localStorage.getItem("filterFormatterData");
    
        fieldWrapper.innerHTML = "";
        createNodeList(JSON.parse(format)?.filters);
    }
}, false);

async function read(file) {
    return await new Response(file).json();
}
  