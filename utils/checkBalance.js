const fs = require("fs");

const checkBalance = (id) => {
    const moneyBuffer = fs.readFileSync("./money.json", "utf8");
    const moneyData = JSON.parse(moneyBuffer);

    if (!(id in moneyData)) {
        moneyData[id] = { money: 0 };
        fs.writeFileSync("./money.json", JSON.stringify(moneyData, null, 2), "utf8");
    }
};

module.exports = checkBalance;
