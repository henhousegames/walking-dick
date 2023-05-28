let grid = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

let gridElement = document.getElementById("grid");

function updateGrid() {
  gridElement.innerHTML = "";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let cell = document.createElement("div");
      cell.className = "cell cell-" + grid[i][j];
      cell.onclick = function () {
        grid[i][j] = (grid[i][j] + 1) % 3;
        updateGrid();
      };
      gridElement.appendChild(cell);
    }
    gridElement.appendChild(document.createElement("br"));
  }
}

document.getElementById("addRow").onclick = function () {
  let newRow = new Array(grid[0].length).fill(0);
  grid.unshift(newRow); // unshift will add the new row to the beginning
  updateGrid();
};

document.getElementById("addColumn").onclick = function () {
  for (let i = 0; i < grid.length; i++) {
    grid[i].push(0);
  }
  updateGrid();
};

document.getElementById("removeRow").onclick = function () {
  if (grid.length > 1) {
    grid.shift(); // shift will remove the first row
    updateGrid();
  }
};

document.getElementById("removeColumn").onclick = function () {
  if (grid[0].length > 1) {
    for (let i = 0; i < grid.length; i++) {
      grid[i].pop();
    }
    updateGrid();
  }
};

document.getElementById("export").onclick = function () {
  let data = {
    width: grid[0].length * 75,
    height: grid.length * 75,
    items: grid,
  };

  let dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  let downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "level_data.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

updateGrid();