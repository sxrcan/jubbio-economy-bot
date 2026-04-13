const fs = require('fs');
const checkBalance = require('../utils/checkBalance');

module.exports = {
    name: 'paraekle',
    description: 'Kullanıcıya para ekler (Admin komutu).',
    execute: function(message, args) {
        const userId = args[0];
        const amount = parseFloat(args[1]);
        
        if (!userId || isNaN(amount) || amount <= 0) {
            message.reply('❌ Komutu doğru kullanınız: !paraekle (kullanıcı ID) (miktar)');
            return;
        }
        
        const raw = fs.readFileSync('./money.json');
        const moneyData = JSON.parse(raw);
        
        checkBalance(userId);
        moneyData[userId].money += amount;
        
        fs.writeFileSync('./money.json', JSON.stringify(moneyData, null, 2));
        
        message.reply(`✅ ${userId} kullanıcısına ${amount} TL eklendi.`);
    }
};
