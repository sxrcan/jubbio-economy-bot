const fs = require('fs');
const checkBalance = require('../utils/checkBalance');

module.exports = {
    name: 'gönder',
    description: 'Başka bir kullanıcıya para gönderirsiniz.',
    execute: function(message, args) {
        const senderId = message.author.id;
        
        const receiverId = args[0];
        const amount = parseFloat(args[1]);
        
        if (!receiverId) {
            message.reply('❌ Bir kullanıcı ID\'si girmelisiniz.');
            return;
        }
        
        if (senderId === receiverId) {
            message.reply('❌ Kendinize para gönderemezsiniz.');
            return;
        }
        
        if (isNaN(amount) || amount <= 0) {
            message.reply('❌ Geçerli bir miktar girmelisiniz.');
            return;
        }
        
        const moneyraw = fs.readFileSync('./money.json');
        const moneyData = JSON.parse(moneyraw);
        
        checkBalance(senderId);
        checkBalance(receiverId);
        
        if (moneyData[senderId].money < amount) {
            message.reply('❌ Yeterli paranız yok.');
            return;
        }
        
        moneyData[senderId].money -= amount;
        moneyData[receiverId].money += amount;
        
        fs.writeFileSync('./money.json', JSON.stringify(moneyData, null, 2));
        
        message.reply(`💸 ${amount} TL başarıyla gönderildi!`);
    }
};
