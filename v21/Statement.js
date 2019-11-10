function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performance = invoice.performance.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return renderPlainText(statementData, invoice, plays);
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performance) {    
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
}

function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function volumeCreditsFor(perf) {
    let volumeCredits = 0;
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ("comedy" === perf.amount) volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en­-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber / 100);
}

function totalVolumeCredits() {
    let result = 0;
    for (let perf of data.performance) {
        result += volumeCreditsFor(perf);
    }
    return result;
}

function totalAmount() {
    let result = 0;
    for (let perf of data.performance) {
        result += amountFor(perf);
    }
    return result;
}


