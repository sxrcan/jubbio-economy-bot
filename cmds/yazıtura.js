const fs = require('fs');
const { EmbedBuilder } = require('@jubbio/core');
const checkBalance = require('../utils/checkBalance');

module.exports = {
    name: 'yazıtura',
    description: 'Yazı tura oyunu oynarsınız.',
    execute: function(message, args) {
        const userId = message.author.id;
        
        if (args.length !== 2) {
            message.reply('❌ Komutu doğru kullanınız: !yazıtura (bahis) (yazı/tura)');
            return;
        }
        
        const bahis = parseFloat(args[0]);
        const tahmin = args[1].toLowerCase();
        
        if (isNaN(bahis) || bahis <= 0) {
            message.reply('❌ Geçerli bir bahis miktarı girmelisiniz.');
            return;
        }
        
        if (!['yazı', 'tura'].includes(tahmin)) {
            message.reply('❌ "yazı" veya "tura" olarak tahmininizi belirtin.');
            return;
        }
        
        const raw = fs.readFileSync('./money.json');
        const moneyData = JSON.parse(raw);
        
        checkBalance(userId);
        
        if (moneyData[userId].money < bahis) {
            message.reply('❌ Yeterli paranız yok.');
            return;
        }
        
        const flipEmbed = new EmbedBuilder()
            .setTitle('🪙 Yazı Tura')
            .setColor('#FFD700')
            .setDescription('🪙 Para havaya atılıyor...')
            .addFields({ name: 'Bahis', value: `${bahis} TL`, inline: true })
            .addFields({ name: 'Tahmininiz', value: `**${tahmin.toUpperCase()}**`, inline: true })
            .setFooter(`${message.author.username} - Ekonomi Botu`)
            .setTimestamp();

        message.reply({ embeds: [flipEmbed] }).then(flipMessage => {
            setTimeout(() => {
                const sonuc = Math.random() < 0.5 ? 'yazı' : 'tura';
                const kazandi = tahmin === sonuc;
                
                if (kazandi) {
                    moneyData[userId].money += bahis;
                } else {
                    moneyData[userId].money -= bahis;
                }
                
                fs.writeFileSync('./money.json', JSON.stringify(moneyData, null, 2));
                
                const sonucEmoji = sonuc === 'yazı' ? '📄' : '🪙';
                const sonucText = sonuc === 'yazı' ? 'YAZI' : 'TURA';
                
                const resultEmbed = new EmbedBuilder()
                    .setTitle('🪙 Yazı Tura - Sonuç')
                    .setColor(kazandi ? '#00FF00' : '#FF0000')
                    .setDescription(`**${sonucEmoji} ${sonucText}**`)
                    .addFields({ name: 'Bahis', value: `${bahis} TL`, inline: true })
                    .addFields({ name: 'Tahmin', value: tahmin.toUpperCase(), inline: true })
                    .addFields({ name: 'Sonuç', value: sonucText, inline: true })
                    .addFields({ 
                        name: kazandi ? 'Kazanç' : 'Kayıp', 
                        value: `${kazandi ? '+' : '-'}${bahis} TL`, 
                        inline: true 
                    })
                    .addFields({ 
                        name: 'Yeni Bakiye', 
                        value: `${moneyData[userId].money} TL`, 
                        inline: true 
                    })
                    .setFooter(`${message.author.username} - Ekonomi Botu`)
                    .setTimestamp();
                
                flipMessage.edit({ embeds: [resultEmbed] });
            }, 2000);
        });
    }
};
