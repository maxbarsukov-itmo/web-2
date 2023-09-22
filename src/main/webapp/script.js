"use strict";

let x, y, r;

let svg = document.getElementById("svg");

function drawPoint(x, y, r, result) {
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x * 60 * 2 / r + 150);
  circle.setAttribute("cy", -y * 60 * 2 / r + 150);
  circle.setAttribute("r", 3);
  circle.style.fill = result ? "#09a53d" : "#a50909";
  svg.appendChild(circle);
}

function transformSvgToPlane(svgX, svgY, r) {
  let planeX = (svgX - 150) / (120 / r);
  let planeY = (150 - svgY) / (120 / r);

  return { x: planeX, y: planeY };
}

function addToTable(x, y, r, result) {
  const table = document.getElementById("outputTable");
  const span = document.getElementById("notifications");
  if (span) {
    span.innerText = "";
    span.className = "notification";
  }

  const newRow = table.insertRow();
  newRow.insertCell().innerText = x;
  newRow.insertCell().innerText = y;
  newRow.insertCell().innerText = r;
  newRow.insertCell().innerHTML = result
    ? "<span class=\"success\">Попал</span>"
    : "<span class=\"fail\">Промазал</span>";
}

async function checkPoint(x, y, r) {
  const form = new FormData();
  form.append("X", x);
  form.append("Y", y);
  form.append("R", r);
  form.append("action", "checkPoint")

  const url = "controller?" + new URLSearchParams(form).toString();
  const response = await fetch(url, { method: "get" });

  if (!response.ok) {
    createNotification("Не удалось отправить точку.");
  }

  const data = await response.json();
  if (data.error) createNotification(data.error);

  return data;
}

async function sendCoordinatesToServer(x, y, r) {
  const data = await checkPoint(x, y, r);

  if (!data.error) {
    drawPoint(x, y, r, data.result);
    addToTable(x, y, r, data.result);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("outputTable");

  if (table) {
    for (let item of table.rows) {
      const x = parseFloat(item.children[0].innerText.trim());
      const y = parseFloat(item.children[1].innerText.trim());
      const r = parseFloat(item.children[2].innerText.trim());
      if (isNaN(x) || isNaN(y) || isNaN(r)) continue;

      const result = item.children[3].innerText.trim() === "Попал";
      drawPoint(x, y, r, result);
    }
  }

  svg.addEventListener("click", (event) => {
    if (validateR()) {
      let point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;

      let ctm = svg.getScreenCTM();
      if (ctm) {
        let invertedCTM = ctm.inverse();
        let svgPoint = point.matrixTransform(invertedCTM);

        let planeCoords = transformSvgToPlane(svgPoint.x, svgPoint.y, r);
        console.log(planeCoords)
        sendCoordinatesToServer(
          planeCoords.x.toFixed(1), planeCoords.y.toFixed(1), r
        );
      }
    }
  });

  function click(element) {
    element.onclick = function () {
      x = this.value;
      buttons.forEach(function (element) {
        element.style.boxShadow = null;
        element.style.backgroundColor = null;
        element.style.color = null;
      });
      this.style.boxShadow = "0 0 40px 5px #f41c52";
      this.style.backgroundColor = "#f41c52";
      this.style.color = "white";
    }
  }
  let buttons = document.querySelectorAll("input[name=X-button]");
  buttons.forEach(click);
});

document.getElementById("checkButton").onclick = function () {
  if (validateX() && validateY() && validateR()) {
    const form = $('<form>', {
      action: "controller",
      method: "get"
    });

    const args = { action: "submitForm", X: x, Y: y, R: r };
    Object.entries(args).forEach(entry => {
      const [key, value] = entry;
      $('<input>').attr({
        type: "hidden",
        name: key,
        value: value
      }).appendTo(form);
    });

    // const w = window.open("about:blank", "_self", "noreferrer");
    // w.document.write(form[0].outerHTML);
    // w.document.forms[0].submit();
    form.appendTo('body').submit()
  }
};

function createNotification(message) {
  let outputContainer = document.getElementById("outputContainer");
  if (outputContainer.contains(document.querySelector(".notification"))) {
    let stub = document.querySelector(".notification");
    stub.textContent = message;
    stub.classList.replace("outputStub", "errorStub");
  } else {
    let notificationTableRow = document.createElement("h4");
    notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
    outputContainer.prepend(notificationTableRow);
    let span = document.querySelector(".notification");
    span.textContent = message;
  }
}

function validateX() {
  if (isNumeric(x)) return true;
  else {
    createNotification("Значение X не выбрано");
    return false;
  }
}

function validateY() {
  y = document.querySelector("input[name=Y-input]").value.replace(",", ".");
  if (y === undefined) {
    createNotification("Y не введён");
    return false;
  } else if (!isNumeric(y)) {
    createNotification("Y не число");
    return false;
  } else if (y < -3 || y > 5) {
    createNotification("Y не входит в область допустимых значений");
    return false;
  } else return true;
}

function validateR() {
  try {
    r = document.querySelector("input[type=radio]:checked").value;
    return true;
  } catch (err) {
    createNotification("Значение R не выбрано");
    return false;
  }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
