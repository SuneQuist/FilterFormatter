class CreateNodeFromInputs {
    constructor(
        filterName = "",
        wordContains = [""],
        wordsContainsNot = [""],
        playSound = true,
        soundPath = "",
        highlightMessage = true,
        highlightColorR = 192,
        highlightColorG = 76,
        highlightColorB = 60,
        hideMessage = false,
        displayInSecondChat = false,
        filterTooltips = false,
        room = "Global",
        highlightHex = "#C04C3C",
        createMode = true,
    ) {
        this.filterName = filterName;
        this.wordsContains = wordContains;
        this.wordsContainsNot = wordsContainsNot;
        this.playSound = playSound;
        this.soundPath = soundPath;
        this.highlightMessage = highlightMessage;
        this.highlightColorR = highlightColorR,
        this.highlightColorG = highlightColorG,
        this.highlightColorB = highlightColorB,
        this.hideMessage = hideMessage;
        this.displayInSecondChat = displayInSecondChat;
        this.filterTooltips = filterTooltips;
        this.room = room;
        this.highlightHex = highlightHex;
        this.filter = false;
        this.index = 0;
        this.createMode = createMode;
        this.init();
    }

    init() {
        // Updating fields

        document.querySelector(".form-content .filterName").value = this.filterName;
        document.querySelector(".form-content .wordsContains").value = this.wordsContains.join(", ");
        document.querySelector(".form-content .wordsContainsNot").value = this.wordsContainsNot.join(", ");
        document.querySelector(".form-content .playSound").checked = this.playSound;
        document.querySelector(".form-content .soundPath").value = this.soundPath;
        document.querySelector(".form-content .highlightMessage").checked = this.highlightMessage;
        document.querySelector(".form-content .textColorField").value = this.highlightHex;
        document.querySelector(".form-content .color-field").value = this.highlightHex;
        document.querySelector(".form-content .hideMessage").checked = this.hideMessage;
        document.querySelector(".form-content .displayInSecondChat").checked = this.displayInSecondChat;
        document.querySelector(".form-content .filterToolTips").checked = this.filterTooltips;
        document.querySelector(".form-content .room").value = this.room;

        // Mode Switching

        const switchModes = document.querySelector(".form-content-create-button");
        const saveButton = document.querySelector(".form-content-save-button");

        const mode = document.querySelector(".current-mode");
        const title = document.querySelector(".current-title");

        if (this.createMode) { 
            mode.innerHTML = "Create";
            title.innerHTML = "None";
            switchModes.style.display = "none";
            saveButton.innerHTML = "Create new filter";
        }
        if (!this.createMode && this.filterName) { 
            mode.innerHTML = "Editing";
            title.innerHTML =  this.filterName;
            switchModes.style.display = "flex";
            saveButton.innerHTML = "save edit";
        };
    }

    // Update different input fields
    
    filterNameFunc(self) {
        this.filterName = self.value;

        if (self.value === "") {
            this.createMode = true;
        }

        this.init();
    }
    
    wordsContainsFunc(self) {
        this.wordsContains = self.value.replace(/\s*,\s*/g, ",").split(",");
    }

    ignoreWordsContainsFunc(self) {
        this.wordsContainsNot = self.value.replace(/\s*,\s*/g, ",").split(",");
    }

    playSoundFunc(self) {
        this.playSound = self.checked;
    }

    soundPathFunc(self) {
        this.soundPath = self.value;
    }

    highlightMessageFunc(self) {
        this.highlightMessage = self.checked;
    }

    colorFunc(self) {
        const colorLabel = document.querySelector(".textColorField");
        colorLabel.value = self.value;

        const r = parseInt(self.value.substr(1,2), 16)
        const g = parseInt(self.value.substr(3,2), 16)
        const b = parseInt(self.value.substr(5,2), 16)
        this.highlightColorR = r;
        this.highlightColorG = g;
        this.highlightColorB = b;
    }

    colorInputFunc(self) {
        const colorLabel = document.querySelector(".color-field");
        colorLabel.value = self.value;

        const r = parseInt(self.value.substr(1,2), 16)
        const g = parseInt(self.value.substr(3,2), 16)
        const b = parseInt(self.value.substr(5,2), 16)
        this.highlightColorR = r;
        this.highlightColorG = g;
        this.highlightColorB = b;
    }

    hideMessageFunc(self) {
        this.hideMessage = self.checked;
    }

    displayInSecondChatFunc(self) {
        this.displayInSecondChat = self.checked;
    }

    filterTooltipsFunc(self) {
        this.filterTooltips = self.checked;
    }

    roomFunc(self) {
        if(self.value === "") { this.room = "Global" };
        if (self.value !== "") { this.room = self.value };
    }

    // Add or edit filter array

    updateFilter() {
        const node = this.getNode();

        if (this.filter && !this.createMode) {
            this.filter[this.index] = node;
        }

        if (this.filter && this.createMode) {
            this.filter.push(node);
        }
    }

    // Update specific or all fitlers without resetting by inisiating.

    update({filterName = this.filterName,
    wordsContains = this.wordsContains,
    wordsContainsNot = this.wordsContainsNot,
    playSound = this.playSound,
    soundPath = this.soundPath,
    highlightMessage = this.highlightMessage,
    highlightColorR = this.highlightColorR,
    highlightColorG = this.highlightColorG,
    highlightColorB = this.highlightColorB,
    hideMessage = this.hideMessage,
    displayInSecondChat = this.displayInSecondChat,
    filterTooltips = this.filterTooltips,
    room = this.room,
    highlightHex = this.highlightHex,
    filter = this.filter,
    index = this.index,
    createMode = this.createMode}) {
        this.filterName = filterName;
        this.wordsContains = wordsContains;
        this.wordsContainsNot = wordsContainsNot;
        this.playSound = playSound;
        this.soundPath = soundPath;
        this.highlightMessage = highlightMessage;
        this.highlightColorR = highlightColorR,
        this.highlightColorG = highlightColorG,
        this.highlightColorB = highlightColorB,
        this.hideMessage = hideMessage;
        this.displayInSecondChat = displayInSecondChat;
        this.filterTooltips = filterTooltips;
        this.room = room;
        this.highlightHex = highlightHex;
        this.filter = filter;
        this.index = index;
        this.createMode = createMode;

        this.init();
    }

    deleteNode(index) {
        if (this.filter) {
            const filteredOut = this.filter.filter((key, idx) => { return idx !== index });

            if (Array.isArray(filteredOut) && filteredOut.length > 0) {
                this.filter = filteredOut;
            }
        }
    }

    saveData() {
        if (this.filter) {
            localStorage.setItem("filterFormatterData", JSON.stringify({filters: this.filter}));
        }
    }

    // Returns all filters

    getNode() {
        this.newNode = {
            filterName: this.filterName,
            wordsContains: this.wordsContains,
            wordsContainsNot: this.wordsContainsNot,
            playSound: this.playSound,
            soundPath: this.soundPath,
            highlightMessage: this.highlightMessage,
            highlightColorR: this.highlightColorR,
            highlightColorG: this.highlightColorG,
            highlightColorB: this.highlightColorB,
            hideMessage: this.hideMessage,
            displayInSecondChat: this.displayInSecondChat,
            filterTooltips: this.filterTooltips,
            room: this.room,
            createMode: this.createMode
        }

        return this.newNode;
    }

    createJSONFile() {
        const format = localStorage.getItem("filterFormatterData");

        const blob = new Blob([JSON.stringify(this.filter ? {filters: this.filter} : format)], {type:"application/json"});
        const href = URL.createObjectURL(blob);
        
        const a = Object.assign(document.createElement("a"), {href, style:"display:none", download:"filters.json", textContent: "filters.json"});
        
        document.body.appendChild(a);
        
        a.click();
        URL.revokeObjectURL(href);
        a.remove();
    }
}