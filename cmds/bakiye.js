const fs = require('fs');
const checkBalance = require('../utils/checkBalance');

module.exports = {
    name: 'bakiye',
    description: 'Paranızı gösterir.',
    execute: function(message, args) {
        const userId = message.author.id;
        
        checkBalance(userId);
        
        const raw = fs.readFileSync('./money.json');
        const moneyData = JSON.parse(raw);
        
        const balance = moneyData[userId].money;
        message.reply(`💰 Hesabınızda ${balance} TL var.`);
    }
};
