work();

function work(){
    chrome.runtime.onMessage.addListener(receiveMessageFromBackground);
}

async function receiveMessageFromBackground(message, sender, sendResponse) {
    const { text } = message; // placeholder

    let urlParams = new URLSearchParams(window.location.search);
    let size = urlParams.get('size');

    if (size === null || size !== "100") {
        urlParams.set('size', 100);
        window.location.search = urlParams.toString();
        return;
    }

    // NOTE: now page definitely has 100 teams list (i.e. all teams)

    setInterval(updateTable, 6000);
    
    return;
}

const START = 3;

function updateTable() {
    let table = document.getElementsByClassName("MuiTable-root")[0];

    if (table === undefined) {
        return;
    }

    let counts = getTableCounts(table);
    updateTableHead(table, counts)
    
}

function getTableCounts(table) {
    let tbody = table.getElementsByTagName("tbody")[0];
    let rows = tbody.getElementsByTagName("tr");

    let counts = [];
    problemCount = rows[0].getElementsByTagName("td").length - START; // NOTE: possible bug? if header loads but teams dont.

    for (let i = 0; i<problemCount; i++){
        counts.push([0, 0]);
    }

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName("td");
        for (let j = START; j < cells.length; j++) {
            if (cells[j].childElementCount === 1 && cells[j].firstChild.innerText === "-") { // no attempt, no ac
                continue; 
            }

            child = cells[j].firstChild;

            if (child.childElementCount === 0){ // attempt but no ac
                let text = child.innerText;
                let attemptCount = parseInt(text.split(" ")[0]);
                counts[j - START][1] += attemptCount;
            }
            else { // should have two children, one for ac and one for attempt
                let text = child.childNodes[1].innerText;
                let attemptCount = parseInt(text.split(" ")[0]);
                counts[j - START][0] += 1;
                counts[j - START][1] += attemptCount;
            }
        }
    }
    return counts;
}

function updateTableHead(table, counts) {
    if (counts.length === 0) {
        return;
    }

    let thead = table.getElementsByTagName("thead")[0];
    let rows = thead.getElementsByTagName("tr");
    for (let i = rows.length - 1; i >= 1; i--) {
        thead.removeChild(rows[i]);
    }
    
    let row = document.createElement("tr");

    problemCount = rows[0].getElementsByTagName("th").length - START; // FIXME: needed?

    row.classList.add("MuiTableRow-root");
    row.classList.add("MuiTableRow-head");

    while (row.getElementsByTagName("th").length < problemCount + START) {
        let th = document.createElement("th");
        row.appendChild(th);
    }    

    cells = row.getElementsByTagName("th");

    for(let i = 0; i < cells.length; i++) {
        cells[i].classList.add("MuiTableCell-root");
        cells[i].classList.add("MuiTableCell-head");
        cells[i].classList.add("MuiTableCell-alignCenter");
        cells[i].setAttribute("scope", "col");
        cells[i].setAttribute("width", "100");
    }

    cells[0].innerText = "Counts";

    for (let i = 0; i < problemCount; i++) {
        cells[i + START].innerText = '' + (counts[i][0]) + "/" + (counts[i][1]);
    }

    thead.appendChild(row);

    return;
}