// TODOS
// -[x] Add editing panel + styles from symbiota label generator
// -[x] Method to add fields from csv and not from array
// -[x] Add methods/event listeners for dragging fields
// -[x] Add methods to refresh field list when dragged
// -[x] Create formatting controls
// -[x] Add controls methods
// -[x] Add line method
// -[] Fix Uncaught ReferenceError: fieldProps is not defined
// at getCurrFields (main.js:539)
// at refreshAvailFields (main.js:220)
// at HTMLSpanElement.removeField (main.js:288)
// -[] Add refreshPreview method
// -[] Fix control button not getting selected when clicked (getState method?)
/** Global variables
 ******************************
 */
let csvFile = document.getElementById("csv-file");
const fieldsList = document.getElementById("fields-list");
const labelsList = document.getElementById("labels");
const numCols = document.getElementById("num-cols");
const genBtn = document.getElementById("gen-btn");
const controlsList = document.getElementById("controls");
const labelMid = document.getElementById("label-middle");
const containers = document.querySelectorAll(".container");
const draggables = document.querySelectorAll(".draggable");
const build = document.getElementById("build-label");
const preview = document.getElementById("preview-label");
const controls = document.querySelectorAll(".control");
const inputs = document.querySelectorAll("input");
// Defines formatting buttons
const formatsArr = [
  { group: "field", func: "font-bold", icon: "format_bold", title: "Bold" },
  { group: "field", func: "italic", icon: "format_italic", title: "Italic" },
  {
    group: "field",
    func: "underline",
    icon: "format_underlined",
    title: "Underline",
  },
  {
    group: "field",
    func: "uppercase",
    icon: "format_size",
    title: "Uppercase",
  },
  {
    group: "field-block",
    func: "bar",
    icon: "",
    name: "Bar Below",
    title: "Add bar below line",
  },
  {
    group: "field-block",
    func: "bar-top",
    icon: "",
    name: "Bar Above",
    title: "Add bar above line",
  },
];
// Defines dropdown style groups
const dropdownsArr = [
  {
    id: "text",
    name: "font-size",
    group: "field",
    options: [
      { value: "", text: "Font Size" },
      { value: "text-xs", text: "X-Small" },
      { value: "text-sm", text: "Small" },
      { value: "text-base", text: "Normal" },
      { value: "text-lg", text: "Large" },
      { value: "text-xl", text: "X-Large" },
      { value: "text-2xl", text: "2X-Large" },
      { value: "text-3xl", text: "3X-Large" },
      { value: "text-4xl", text: "4X-Large" },
      { value: "text-5xl", text: "5X-Large" },
      { value: "text-6xl", text: "6X-Large" },
    ],
  },
  {
    id: "float",
    name: "float",
    group: "field",
    options: [
      { value: "", text: "Position in Line" },
      // { value: 'float-none', text: 'None' },
      { value: "float-left", text: "Left" },
      { value: "float-right", text: "Right" },
    ],
  },
  {
    id: "font-family",
    name: "font-family",
    group: "field",
    options: [
      { value: "", text: "Font Family" },
      { value: "font-family-arial", text: "Arial (sans-serif)" },
      { value: "font-family-verdana", text: "Verdana (sans-serif)" },
      { value: "font-family-helvetica", text: "Helvetica (sans-serif)" },
      { value: "font-family-tahoma", text: "Tahoma (sans-serif)" },
      { value: "font-family-trebuchet", text: "Trebuchet (sans-serif)" },
      { value: "font-family-times", text: "Times New Roman (serif)" },
      { value: "font-family-georgia", text: "Georgia (serif)" },
      { value: "font-family-garamond", text: "Garamond (serif)" },
      { value: "font-family-courier", text: "Courier New (monospace)" },
      { value: "font-family-brush", text: "Brush Script MT (cursive)" },
    ],
  },
  {
    id: "text-align",
    name: "text-align",
    group: "field-block",
    options: [
      { value: "", text: "Text Align" },
      { value: "text-align-center", text: "Center" },
      { value: "text-align-right", text: "Right" },
      // { value: 'text-align-justify', text: 'Justify' },
      { value: "text-align-left", text: "Left" },
    ],
  },
  {
    id: "mt",
    name: "spacing-top",
    group: "field-block",
    options: [
      { value: "", text: "Line Spacing Top" },
      { value: "mt-0", text: "0" },
      { value: "mt-1", text: "1" },
      { value: "mt-2", text: "2" },
      { value: "mt-3", text: "3" },
      { value: "mt-4", text: "4" },
      { value: "mt-5", text: "5" },
      { value: "mt-6", text: "6" },
      { value: "mt-8", text: "8" },
      { value: "mt-10", text: "10" },
      { value: "mt-12", text: "12" },
    ],
  },
  {
    id: "mb",
    name: "spacing-bottom",
    group: "field-block",
    options: [
      { value: "", text: "Line Spacing Bottom" },
      { value: "mb-0", text: "0" },
      { value: "mb-1", text: "1" },
      { value: "mb-2", text: "2" },
      { value: "mb-3", text: "3" },
      { value: "mb-4", text: "4" },
      { value: "mb-5", text: "5" },
      { value: "mb-6", text: "6" },
      { value: "mb-8", text: "8" },
      { value: "mb-10", text: "10" },
      { value: "mb-12", text: "12" },
    ],
  },
];

/** Default methods
 ******************************
 */
// Creates formatting (button) controls in page
formatsArr.forEach((format) => {
  let targetDiv = document.getElementById(`${format.group}-options-btns`);
  let btn = document.createElement("button");
  btn.classList.add("control");
  btn.disabled = true;
  btn.dataset.func = format.func;
  btn.dataset.group = format.group;
  btn.title = format.title;
  if (format.icon !== "") {
    let icon = document.createElement("span");
    icon.classList.add("material-icons");
    icon.innerText = format.icon;
    btn.appendChild(icon);
  } else {
    btn.innerText = format.name;
  }
  targetDiv.appendChild(btn);
});

/** Methods
 ******************************
 */

/**
 * Grabs file loaded in input
 * @returns File blob
 */
function loadFile() {
  let file = csvFile.files[0];
  return file;
}

/**
 * Parses loaded CSV and adds headers as fields
 * Dependencies: PapaParse.JS and createFields method
 */
function displayFields() {
  let file = loadFile();
  let results = Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (data) {
      results = data;
      let fieldsArr = results.meta["fields"];
      createFields(fieldsArr, fieldsList);
      // console.dir(fields);
      // fields.forEach((field) => {
      //   let li = document.createElement("li");
      //   li.innerText = field;
      //   fieldsList.appendChild(li);
      // });
    },
  });
}

/**
 * Refreshes field list
 */
function refreshAvailFields() {
  let available = getCurrFields();
  fieldListDiv.innerHTML = "";
  let selectedFilter = fieldsFilter.value;
  selectedFilter != "all"
    ? filterFields(selectedFilter)
    : createFields(available, fieldListDiv);
}

/** USE THIS WITH FORMATTING CONTROLS */
function applyStyles() {
  let pgCols = numCols.value;
  labelsList.style.setProperty(
    "grid-template-columns",
    `repeat(${pgCols},1fr)`
  );
}

/**
 * Builds printable labels from loaded file
 */
function displayLabels() {
  let file = loadFile();
  let results = Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (data) {
      results = data;
      applyStyles();
      // console.log(results);
      results.data.forEach((row) => {
        let label = document.createElement("div");
        Object.keys(row).forEach((field) => {
          // console.log(field, ": ", row[field]);
          label.innerText += " " + row[field];
        });
        labelsList.appendChild(label);
      });
    },
  });
}

/**
 * Creates draggable elements
 * @param {Arr} arr Array with list of currently available fields
 * @param {HTMLObjectElement} target HTML element where fields will be added
 */
function createFields(arr, target) {
  // console.log(arr);
  arr.forEach((field) => {
    if (field != "") {
      let li = document.createElement("li");
      li.innerHTML = field;
      li.id = field;
      let closeBtn = document.createElement("span");
      closeBtn.classList.add("material-icons");
      closeBtn.innerText = "cancel";
      closeBtn.addEventListener("click", removeField, false);
      li.appendChild(closeBtn);
      li.draggable = "true";
      li.classList.add("draggable");
      li.addEventListener("dragstart", handleDragStart, false);
      li.addEventListener("dragover", handleDragOver, false);
      li.addEventListener("drop", handleDrop, false);
      li.addEventListener("dragend", handleDragEnd, false);
      target.appendChild(li);
    }
  });
}

/**
 * Removes field from label-middle
 * @param {Object} field node to be removed
 */
function removeField(field) {
  field.target.parentNode.remove();
  // Refresh available fields list
  refreshAvailFields();
}

//////
/** Drag & Drop methods */

/**
 * Tags dragging elements and copies their content
 * @param {Event} e
 */
function handleDragStart(e) {
  dragSrcEl = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

/**
 * Moves content of dragged element when done moving
 * @param {Event} e
 */
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = "move";
  return false;
}

/**
 * Reorders element based on position when dropped
 * @param {Event} e
 */
let dragSrcEl = null;
function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl != this) {
    this.parentNode.insertBefore(dragSrcEl, this);
  }
  return false;
}

/**
 * Removes tag from dragging element
 * @param {Event} e
 */
function handleDragEnd(e) {
  this.classList.remove("dragging");
  refreshPreview();
  return false;
}
//////

//////
/** Formatting methods */
/**
 * Returns true if item is formattable
 * @param {Object} element
 */
function isFormattable(element) {
  if (
    element.classList.contains("field-block") ||
    element.classList.contains("draggable")
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Toggles formatting controls based on filter and state
 * @param {String} filter Class of formatting control (field or field-block)
 * @param {Boolean} bool
 */
function activateControls(filter, bool) {
  let filtered = document.querySelectorAll(`[data-group=${filter}]`);
  filtered.forEach((control) => {
    bool ? (control.disabled = false) : (control.disabled = true);
  });
}

/**
 * Deactivates all controls
 */
function deactivateControls() {
  controls.forEach((control) => {
    control.disabled = true;
  });
}

/**
 * Gets selected item state (formatted classes)
 * @param {DOM Node} item Field in build label area
 */
function getState(item) {
  // console.log(item);
  let delimiter = item.dataset.delimiter;
  if (delimiter) {
    let delimiterInput = document.getElementById("delimiter");
    delimiterInput.value = delimiter;
  }
  let formatList = Array.from(item.classList);
  // Removes '.draggable' and '.selected' from array
  printableList = formatList.filter(isPrintStyle);
  // console.log(printableList);
  if (printableList.length > 0) {
    // Render state of each formatting button
    printableList.forEach((formatItem) => {
      // Check if class is a choice in a dropdown by matching first part of class
      let strArr = formatItem.split("-");
      let str = "";
      strArr.length == 3
        ? (str = strArr[0] + "-" + strArr[1])
        : (str = strArr[0]);
      // console.log(str);
      // Loop through each item in array
      dropdownsArr.forEach((dropdown) => {
        let isDropdownStyle = str === dropdown.id;
        if (isDropdownStyle) {
          let selDropdown = document.getElementById(str);
          selDropdown.value = formatItem;
        }
      });
      controls.forEach((control) => {
        // Select that format and activate it
        if (formatItem === control.dataset.func) {
          control.classList.add("selected");
        }
      });
    });
  }

  // Get state of prefix/suffix for fields
  let hasPrefix = item.dataset.prefix != null;
  let prefixInput = document.getElementById("prefix");
  hasPrefix ? (prefixInput.value = item.dataset.prefix) : "";
  let hasSuffix = item.dataset.suffix != null;
  let suffixInput = document.getElementById("suffix");
  hasSuffix ? (suffixInput.value = item.dataset.suffix) : "";
}

/**
 * Clears/resets controls state
 */
function resetControls() {
  controls.forEach((control) => {
    // Deal with select input
    let isDropdown = control.tagName === "SELECT";
    isDropdown ? (control.value = "") : "";
    control.classList.remove("selected");
    let isInput = control.tagName === "INPUT";
    isInput ? (control.value = "") : "";
  });
}

/**
 * Checks if class should be output in JSON
 * @param {String} className found in item
 */
function isPrintStyle(className) {
  const functionalStyles = [
    "draggable",
    "selected",
    "field-block",
    "container",
  ];
  return !functionalStyles.includes(className);
}

/**
 * Toggles select/deselect clicked element
 * @param {DOM Node} element
 */
function toggleSelect(element) {
  element.classList.toggle("selected");
  let isSelected = element.classList.contains("selected");
  return isSelected;
}

/**
 * Appends line (fieldBlock) to label builder
 * Binded to button, adds editable div
 */
function addLine() {
  let line = document.createElement("div");
  line.classList.add("field-block", "container");
  line.dataset.delimiter = " ";
  let midBlocks = document.querySelectorAll("#label-middle > .field-block");
  let close = document.createElement("span");
  close.classList.add("material-icons");
  close.innerText = "close";
  line.appendChild(close);
  let up = document.createElement("span");
  up.classList.add("material-icons");
  up.innerText = "keyboard_arrow_up";
  line.appendChild(up);
  let down = document.createElement("span");
  down.classList.add("material-icons");
  down.innerText = "keyboard_arrow_down";
  line.appendChild(down);
  let lastBlock = midBlocks[midBlocks.length - 1];
  lastBlock.parentNode.insertBefore(line, lastBlock.nextSibling);
  // Allows items to be added/reordered inside fieldBlock
  line.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    dragging !== null ? line.appendChild(dragging) : "";
  });
  refreshLineState();
}

/**
 * Refreshes line state
 * If there is only one line, disables line controls
 */
function refreshLineState() {
  let lines = labelMid.querySelectorAll(".field-block");
  let icons = lines[0].querySelectorAll(".material-icons");
  let isSingleLine = lines.length == 1;
  icons.forEach((icon) => {
    isSingleLine
      ? icon.classList.add("disabled")
      : icon.classList.remove("disabled");
  });
}

/**
 * Removes line from label-middle
 * @param {Object} line node to be removed
 */
function removeLine(line) {
  let lineCount = labelMid.querySelectorAll(".field-block").length;
  lineCount > 1 ? line.remove() : false;
  refreshLineState();
  refreshAvailFields();
}

/**
 * Gets list of fields currently available to drag to label build area
 */
function getCurrFields() {
  let currFields = fieldProps;
  let usedFields = document.querySelectorAll("#label-middle .draggable");
  if (usedFields.length > 0) {
    usedFields.forEach((usedField) => {
      currFields = removeObject(currFields, { id: usedField.id });
    });
  }
  return currFields;
}

//////

/** Event Listeners
 ******************************
 */
// csvFile.addEventListener("change", loadFile, false);
csvFile.addEventListener(
  "change",
  function () {
    fieldsList.innerHTML = "";
    displayFields();
  },
  false
);

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", handleDragStart, false);
  draggable.addEventListener("dragover", handleDragOver, false);
  draggable.addEventListener("drop", handleDrop, false);
  draggable.addEventListener("dragend", handleDragEnd, false);
});

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    dragging !== null ? container.appendChild(dragging) : "";
  });
});

// Elements in '#label-middle'
labelMid.addEventListener("click", (e) => {
  if (e.target.matches(".material-icons")) {
    if (e.target.innerText === "keyboard_arrow_up") {
      let first = labelMid.getElementsByClassName("field-block")[0];
      let curr = e.target.parentNode;
      // reorder only if item is not first in list already
      if (curr !== first) {
        let prev = e.target.parentNode.previousSibling;
        // move current into prev
        prev.replaceWith(curr);
        // insert current after prev
        curr.parentNode.insertBefore(prev, curr.nextSibling);
      }
    } else if (e.target.innerText === "keyboard_arrow_down") {
      let next = e.target.parentNode.nextSibling;
      let curr = e.target.parentNode;
      if (next) {
        // move current into next
        curr.replaceWith(next);
        // insert current after next
        next.parentNode.insertBefore(curr, next.nextSibling);
      }
    } else if (e.target.innerText === "close") {
      let line = e.target.parentNode;
      removeLine(line);
    }
    refreshPreview();
  } else {
    if (isFormattable(e.target)) {
      // Add ".selected" to clicked item, removing it from others
      let lines = labelMid.querySelectorAll(".field-block");
      lines.forEach((line) => {
        line.classList.remove("selected");
      });
      let fields = labelMid.querySelectorAll(".draggable");
      fields.forEach((field) => {
        field.classList.remove("selected");
      });
      e.target.classList.add("selected");
    }
    // Everytime item is clicked, display list of selected items:
    let selectedItems = build.querySelectorAll(".selected");
    if (selectedItems.length == 1) {
      let itemType = "";
      // Refreshes buttons according to applied styles in selected item
      let item = build.querySelector(".selected");
      if (item.matches(".draggable")) {
        itemType = "field";
        // deactivate 'field-block' items
        activateControls("field-block", false);
      } else if (item.matches(".field-block")) {
        itemType = "field-block";
        // deactivate 'field' items
        activateControls("field", false);
      }
      resetControls();
      activateControls(itemType, true);
      getState(item);
    } else {
      return false;
    }
  }
});

genBtn.addEventListener("click", function () {
  displayLabels();
});
