// TODO
/**
 * [x] Read content from textarea
 * [x] Turn content into array (split, trim)
 * [x] Output array in a list
 * [x] Generate qrcode for array using Google Chart API
 * [x] Add width option
 * [] Add other label types via https://barcode.tec-it.com/en/QRCode?data=This%20is%20a%20QR%20Code%20by%20TEC-IT (add backlink) 128, 11, 39
 * [x] Don't clean barcode for spaces
 * [x] Add selector for size of sheet
 * [x] Add selector for size of label
 * [x] Add checkbox for margin
 * [x] Add selector for label spacing
 * [x] Add selector for font size
 * [x] Add selector for border
 * [x] Calculate sheets needed for labels
 */

// Global variables
let textArea = document.getElementById("identifiers");
let sheetArea = document.getElementById("sheet-area");
let generateBtn = document.getElementById("generate-btn");
let printBtn = document.getElementById("print-btn");
let idText = "";
let ids = [];

// Methods
function readIds() {
  idText = textArea.value;
  return idText;
}

function setIdsArr(idsText) {
  ids = [];
  if (idsText.length === 0) {
    window.alert("Please add identifiers to generate labels");
    sheetArea.innerHTML = "";
    sheetArea.style.border = "none";
    return (ids = false);
  } else if (idsText.includes(",")) {
    ids = idsText.split(",");
  } else if (idsText.includes("\n")) {
    ids = idsText.split("\n");
  } else {
    ids.push(idsText);
  }
  return ids;
  // else {
  //   idsText.includes(",") ? (ids = idsText.split(",")) : ids.push(idsText);
  //   return ids;
  // }
}

function cleanIds(idsText) {
  ids = [];
  idsText.includes(",") ? (ids = idsText.split(",")) : ids.push(idsText);
  if (ids.length > 1) {
    ids = ids.map((id) => id.replace(/\s+/g, ""));
  }
  return ids;
}

function getLabelOptions() {
  let imgWidth = document.getElementById("bcw").value;
  let imgUnit = document.getElementById("bcunit").value;
  let labelWidth = document.getElementById("lw").value;
  let labelUnit = document.getElementById("lunit").value;
  let labelHeight = document.getElementById("lh").value;
  let labelHUnit = document.getElementById("lhunit").value;
  let labelSpacing = document.getElementById("ls").value;
  let labelSUnit = document.getElementById("lsunit").value;
  let spaceEvenly = document.getElementById("spaceEven").checked;
  let txtFontSize = document.getElementById("ifs").value;
  let showBorder = document.getElementById("border").checked;
  let pageSize = document.getElementById("ps").value;
  let options = {
    bcw: imgWidth + imgUnit,
    lw: labelWidth + labelUnit,
    lh: labelHeight + labelHUnit,
    ls: labelSpacing + labelSUnit,
    spaceEvenly: spaceEvenly,
    txts: txtFontSize,
    border: showBorder ? "solid 1px gray" : "none",
    ps: pageSize,
  };
  return options;
}

function displayIds(idArr) {
  sheetArea.innerHTML = "";
  let lbOptions = getLabelOptions();
  let headers = ["Text", "QRCode"];
  let table = document.createElement("table");
  let thead = table.createTHead();
  let trow = thead.insertRow();
  headers.forEach((key) => {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    trow.appendChild(th);
  });
  idArr.forEach((item) => {
    let row = table.insertRow();
    let cellText = row.insertCell();
    cellText.appendChild(document.createTextNode(item));
    let cellQRCode = row.insertCell();
    let itemImage = document.createElement("img");
    itemImage.src = `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${item}`;
    itemImage.style.width = lbOptions;
    cellQRCode.appendChild(itemImage);
  });
  sheetArea.appendChild(table);
}

function generateLabels(idArr) {
  // console.log(idArr.length);
  sheetArea.innerHTML = "";
  generateBtn.innerText = "Refresh Labels";
  printBtn.classList.remove("hidden");
  let lbOptions = getLabelOptions();
  let labelPage = document.createElement("div");
  labelPage.classList.add("page");
  labelPage.classList.add(lbOptions.ps);
  let invisiblePage = document.getElementById("page-invisible");
  invisiblePage.classList.add("page");
  invisiblePage.classList.add(lbOptions.ps);
  lbOptions.spaceEvenly
    ? (labelPage.style.justifyContent = "space-evenly")
    : (labelPage.style.justifyContent = "normal");
  // calculate total height of labelPage to determine if page break is needed
  let labelHeight = parseInt(lbOptions.lh);
  let labelSpacing = parseInt(lbOptions.ls);
  let labelCount = idArr.length;
  // calculate max page height based on page size option and css class
  let maxPageHeight = getComputedStyle(invisiblePage).height;
  let totalLabelHeight =
    labelHeight * labelCount + labelSpacing * (labelCount - 1);
  console.log(
    "totalLabelHeight: " + totalLabelHeight,
    "maxPageHeight: " + maxPageHeight
  );

  // calculate how many labels can be added per page
  let labelsPerPage = Math.floor(
    (parseInt(maxPageHeight) - labelSpacing) / (labelHeight + labelSpacing)
  );
  console.log("labelsPerPage: " + labelsPerPage);
  console.log("actual label count: " + labelCount);

  const identifiersAdded = document.getElementById("identifiers-added");
  identifiersAdded.innerText = `${labelCount} label(s) will be generated.`;

  // calculate how many pages are needed
  let pageCount = Math.ceil(labelCount / labelsPerPage);
  console.log("pageCount: " + pageCount);

  const pagesCalculated = document.getElementById("pages-calculated");
  pagesCalculated.innerText = `Based on options selected, ${pageCount} page(s) will be generated (max ${labelsPerPage} label(s) per page).`;

  idArr.forEach((item) => {
    item = item.trim();
    if (item !== "") {
      let label = document.createElement("div");
      label.classList.add("label");
      label.style.width = lbOptions.lw;
      label.style.height = lbOptions.lh;
      label.style.margin = lbOptions.ls;
      label.style.border = lbOptions.border;
      let labelText = document.createElement("span");
      labelText.style.width = lbOptions.lw - lbOptions.bcw;
      labelText.style.fontSize = lbOptions.txts + "pt";
      let barcode = document.createElement("img");
      barcode.src = `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${item}`;
      barcode.style.width = lbOptions.bcw;
      barcode.style.height = lbOptions.bcw;
      labelText.innerText = item;
      label.appendChild(labelText);
      label.appendChild(barcode);
      labelPage.appendChild(label);
    }
  });
  sheetArea.appendChild(labelPage);
  sheetArea.style.border = "solid 1px gray";
  sheetArea.style.marginTop = "20px";
}

function printLabels() {
  window.print();
}

// Event Listeners
textArea.addEventListener("change", readIds);
generateBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // let currArr = cleanIds(idText);
  let currArr = setIdsArr(idText);
  // displayIds(currArr);
  currArr === false ? "" : generateLabels(currArr);
});
printBtn.addEventListener("click", function (e) {
  e.preventDefault();
  printLabels();
});

// function to set example ids and preview labels
function setExampleIds() {
  let exampleStr =
    "A000001,A000002,A000003,A000004,A000005,A000006,A000007,A000008,A000009,A000010,A000011,A000012,A000013,A000014,A000015,A000016,A000017,A000018,A000019,A000020";
  textArea.value = exampleStr;
  readIds();
  generateLabels(setIdsArr(idText));
}

setExampleIds();
