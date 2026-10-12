
let currentInput = "0", previousInput = null, operator = null, resetInput = false;

const buttonList = [
    ["AC", "AC"], ["DEL", "DEL"], ["Sqrt", "sqrt"], ["Divide", "/"],
    ["7", "7"], ["8", "8"], ["9", "9"], ["Multi", "*"],
    ["4", "4"], ["5", "5"], ["6", "6"], ["Minus", "-"],
    ["1", "1"], ["2", "2"], ["3", "3"], ["Plus", "+"],
    ["00", "00"], ["0", "0"], ["Dot", "."], ["Equal", "="]
];

const buttons = document.getElementById("buttons");

buttonList.forEach(([image, value]) => {
    const button = document.createElement("button");
    button.innerHTML = `<img src="images/buttons/${image}.png" alt="${image}">`;
    button.onclick = () => press(value);
    buttons.appendChild(button);
});

function updateDisplay() {
    const display = document.getElementById("display");
    display.replaceChildren();

    if (currentInput === "Error") {
        display.textContent = "Error";
        display.className = "display error-text";
        return;
    }

    display.className = "display";

    for (const char of currentInput) {
        const file = char === "-" ? "minus" : char === "." ? "dot" : char;
        const img = document.createElement("img");
        img.src = `images/digits/${file}.png`;
        img.alt = char;
        img.className = char === "-" ? "minus" : char === "." ? "dot" : "digit";
        display.appendChild(img);
    }
}

function press(value) {
    if (value === "AC") {
        currentInput = "0";
        previousInput = operator = null;
        resetInput = false;
        return updateDisplay();
    }

    if (value === "DEL") {
        if (resetInput || currentInput === "Error") currentInput = "0";
        else currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
        resetInput = false;
        return updateDisplay();
    }

    if (currentInput === "Error") return;

    if (value === "sqrt") {
        const n = Number(currentInput);
        if (n < 0) return error();
        currentInput = String(Number(Math.sqrt(n).toPrecision(12)));
        previousInput = operator = null;
        resetInput = true;
        return updateDisplay();
    }

    if (["+", "-", "*", "/"].includes(value)) {
        if (operator !== null && !resetInput) {
            calculate();
            if (currentInput === "Error") return;
        }
        previousInput = Number(currentInput);
        operator = value;
        resetInput = true;
        return;
    }

    if (value === "=") return calculate();

    if (resetInput) {
        currentInput = value === "." ? "0." : value === "00" ? "0" : value;
        resetInput = false;
    } else if (value === ".") {
        if (!currentInput.includes(".")) currentInput += ".";
    } else if (currentInput === "0") {
        currentInput = value === "00" ? "0" : value;
    } else if (currentInput.replace(/[-.]/g, "").length < 15) {
        currentInput += value;
    }

    updateDisplay();
}

function calculate() {
    if (operator === null || previousInput === null) return;

    const a = previousInput, b = Number(currentInput);
    if (operator === "/" && b === 0) return error();

    const result = { "+": a + b, "-": a - b, "*": a * b, "/": a / b }[operator];
    if (!Number.isFinite(result)) return error();

    currentInput = String(Number(result.toPrecision(12)));
    previousInput = operator = null;
    resetInput = true;
    updateDisplay();
}

function error() {
    currentInput = "Error";
    previousInput = operator = null;
    resetInput = true;
    updateDisplay();
}

updateDisplay();