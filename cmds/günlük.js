const fs = require('fs');
const checkBalance = require('../utils/checkBalance');

module.exports = {
    name: 'günlük',
    description: 'Günlük ödülünüzü alırsınız. (Sadece 12 saatte bir)',
    execute: function(message, args, client) {
        const userId = message.author.id;
        
        if (!client.cooldowns) client.cooldowns = new Map();
        
        const moneyraw = fs.readFileSync('./money.json', "utf8");
        const moneyData = JSON.parse(moneyraw);
        
        const zaman = Date.now();
        if (client.cooldowns.has(userId)) {
            const son = client.cooldowns.get(userId);
            const fark = zaman - son;
            const geçti = Math.floor(fark / (1000 * 60 * 60));
            
            if (geçti < 12) {
                const kaldı = 12 - geçti;
                message.reply(`⏰ 12 saatlik cooldown süresi içerisindesiniz. Bir sonraki ödülü almak için ${kaldı} saat beklemelisiniz.`);
                return;
            }
        }
        
        const min = 500;
        const max = 1000;
        const miktar = Math.floor(Math.random() * (max - min + 1)) + min;
        
        checkBalance(userId);
        
        moneyData[userId].money += miktar;
        
        fs.writeFileSync('./money.json', JSON.stringify(moneyData, null, 2));
        
        client.cooldowns.set(userId, zaman);
        
        message.reply(`🎁 ${message.author.username}, günlük ödül olarak ${miktar} TL kazandınız!`);
    }
};
