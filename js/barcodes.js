// TODO
/**
 * [x] Read content from textarea
 * [x] Turn content into array (split, trim)
 * [x] Output array in a list
 * [x] Generate qrcode for array using Google Chart API
 * [x] Add width option
 * [] Add other label types via https://barcode.tec-it.com/en/QRCode?data=This%20is%20a%20QR%20Code%20by%20TEC-IT (add backlink) 128, 11, 39
 */

// Global variables
let textArea = document.getElementById("identifiers");
let sheetArea = document.getElementById("sheet-area");
let generateBtn = document.getElementById("generate-btn");
let idText = "";
let ids = [];

// Methods
function readIds() {
  idText = textArea.value;
  return idText;
}

function cleanIds(idsText) {
  ids = [];
  idsText.includes(",") ? (ids = idsText.split(",")) : ids.push(idsText);
  if (ids.length > 1) {
    ids = ids.map((id) => id.replace(/\s+/g, ""));
  }
  return ids;
}

function getImageOptions() {
  let imgWidth = document.getElementById("size").value;
  let unit = document.getElementById("unit").value;
  let options = imgWidth + unit;
  return options;
}

function displayIds(idArr) {
  sheetArea.innerHTML = "";
  let imgOptions = getImageOptions();
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
    itemImage.style.width = imgOptions;
    cellQRCode.appendChild(itemImage);
  });
  sheetArea.appendChild(table);
}

// Event Listeners
textArea.addEventListener("change", readIds);
generateBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let currArr = cleanIds(idText);
  displayIds(currArr);
});
