const form = document.getElementById("investmentForm");
const profitDisplay = document.getElementById("totalProfit")
const expensesDisplay = document.getElementById("totalExpenses")
const IRRDisplay = document.getElementById("IRR")
const ROIDisplay = document.getElementById("ROI")
const paybackPeriodDisplay = document.getElementById("paybackPeriod")
const yearContainer = document.getElementById("yearContainer")
const NPVDisplay = document.getElementById("NPV");

const submitBtn = document.getElementById("submit")

// submitBtn.onclick = () => {
//     calculateResults()
// }

form.addEventListener("submit", (e) => {
    e.preventDefault()
    calculateResults()
})

function calculateResults() {
    cashFlowsInputs = document.querySelectorAll(".cashFlow")
    const cashFlows = []
    cashFlowsInputs.forEach(element => {
        cashFlows.push(parseFloat(element.value))
    });
    const totalProfit = calculateTotalProfit(cashFlows)
    const totalInvestments = calculateInvestment(cashFlows)
    const resultDiv = document.getElementById('result');
    const rate = 10 / 100;

    const paybackPeriod = computePaybackPeriod(cashFlows);
    const roi = computeROI(totalProfit, totalInvestments);
    const npv = computeNPV(cashFlows, rate);
    const irr = computeIRR(cashFlows);

    profitDisplay.innerHTML = totalProfit
    expensesDisplay.innerHTML = totalInvestments
    IRRDisplay.innerHTML = `${irr.toFixed(2)}%` 
    ROIDisplay.innerHTML = `${roi.toFixed(2)}%`
    NPVDisplay.innerHTML = `${npv.toFixed(2)}`
    paybackPeriodDisplay.innerHTML = paybackPeriod

}

function calculateTotalProfit(cashFlows){
    let i = 0;
    cashFlows.forEach(element => {
        i += element;
    });

    if(i > 0){
        let payback = computePaybackPeriod(cashFlows)
        if(typeof(payback) == "number"){
            return (i / payback).toFixed(2)
        }
    }

    return 0;
}

function addAyear(){
    let yearCount = yearContainer.childElementCount
    let yearNo = yearCount
    let year = document.createElement("div")
    year.classList.add("input-group")
    let yearLabel = document.createElement("label")
    let yearInput = document.createElement("input", "type=number")
    yearInput.classList.add("cashFlow")
    let id = `cashFlow${yearNo}`
    yearInput.setAttribute("id", id)
    yearInput.setAttribute("type", "number")
    yearInput.setAttribute("required", "true")
    yearLabel.setAttribute("for", id)
    yearLabel.innerHTML = `Year ${yearNo}`
    year.appendChild(yearLabel)
    year.appendChild(yearInput)
    yearContainer.appendChild(year)
}

function removeAyear(){
    let size = yearContainer.children.length
    yearContainer.removeChild(yearContainer.children[size-1])
}

function calculateInvestment(cashFlows){
    let investments = 0
    cashFlows.forEach(element => {
        if(element < 0){
            investments += element
        }
    });
    return Math.abs(investments).toFixed(2)
}


function computePaybackPeriod(cashFlows) {
    let cumulativeCashFlow = 0;
    for (let i = 0; i < cashFlows.length; i++) {
        cumulativeCashFlow += cashFlows[i];
        if (cumulativeCashFlow >= 0) {
            return i + 1;
        }
    }
    return "Not recovered";
}

function computeROI(totalProfit, totalInvestments) {
    return (totalProfit / totalInvestments) * 100;
}

function computeNPV(cashFlows, rate) {
    return cashFlows.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i), 0);
}

function computeIRR(cashFlows) {
    const maxIterations = 1000;
    const tolerance = 1e-7;
    let lowerBound = -1.0;
    let upperBound = 1.0;

    function npv(rate) {
        return cashFlows.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i), 0);
    }

    for (let i = 0; i < maxIterations; i++) {
        const mid = (lowerBound + upperBound) / 2;
        const npvMid = npv(mid);

        if (Math.abs(npvMid) < tolerance) {
            return mid * 100; // IRR in percentage
        }

        if (npvMid > 0) {
            lowerBound = mid;
        } else {
            upperBound = mid;
        }
    }

    return null; // If IRR is not found within max iterations
}


