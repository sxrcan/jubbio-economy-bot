const fs = require('fs');
const { EmbedBuilder } = require('@jubbio/core');
const checkBalance = require('../utils/checkBalance');

module.exports = {
    name: 'slot',
    description: 'Slot oyunu oynarsınız.',
    execute: function(message, args) {
        const userId = message.author.id;
        
        if (args.length !== 1) {
            message.reply('❌ Komutu doğru kullanınız: !slot (bahis)');
            return;
        }
        
        const bahis = parseFloat(args[0]);
        if (isNaN(bahis) || bahis <= 0) {
            message.reply('❌ Geçerli bir bahis miktarı girmelisiniz.');
            return;
        }
        
        const raw = fs.readFileSync('./money.json');
        const moneyData = JSON.parse(raw);
        
        checkBalance(userId);
        
        if (moneyData[userId].money < bahis) {
            message.reply('❌ Yeterli paranız yok.');
            return;
        }
        
        const slotSymbols = ['🍒', '🍊', '🍋', '🍇', '🍉', '🍍', '🍓', '🍏', '💎', '7️⃣'];
        const slots = [];
        
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * slotSymbols.length);
            slots.push(slotSymbols[randomIndex]);
        }
        
        const startEmbed = new EmbedBuilder()
            .setTitle('🎰 Slot Makinesi')
            .setColor('#FFD700')
            .setDescription('🎲 Slot makinesi çevriliyor...')
            .addFields({ 
                name: 'Bahis', 
                value: `${bahis} TL`,
                inline: true 
            })
            .addFields({ 
                name: 'Semboller', 
                value: '🎲 🎲 🎲',
                inline: true 
            })
            .setFooter(`${message.author.username} - Ekonomi Botu`)
            .setTimestamp();

        message.reply({ embeds: [startEmbed] }).then(slotmesaj => {
            setTimeout(() => {
                const step1Embed = new EmbedBuilder()
                    .setTitle('🎰 Slot Makinesi')
                    .setColor('#FFA500')
                    .setDescription('🎲 Çevriliyor...')
                    .addFields({ name: 'Bahis', value: `${bahis} TL`, inline: true })
                    .addFields({ name: 'Semboller', value: `${slots[0]} 🎲 🎲`, inline: true })
                    .setFooter(`${message.author.username} - Ekonomi Botu`)
                    .setTimestamp();
                
                slotmesaj.edit({ embeds: [step1Embed] }).then(() => {
                    setTimeout(() => {
                        const step2Embed = new EmbedBuilder()
                            .setTitle('🎰 Slot Makinesi')
                            .setColor('#FF6347')
                            .setDescription('🎲 Çevriliyor...')
                            .addFields({ name: 'Bahis', value: `${bahis} TL`, inline: true })
                            .addFields({ name: 'Semboller', value: `${slots[0]} ${slots[1]} 🎲`, inline: true })
                            .setFooter(`${message.author.username} - Ekonomi Botu`)
                            .setTimestamp();
                        
                        slotmesaj.edit({ embeds: [step2Embed] }).then(() => {
                            setTimeout(() => {
                                const result = slots.join(' ');
                                let winType = '';
                                let winAmount = 0;
                                let color = '#FF0000';
                                
                                if (slots[0] === slots[1] && slots[1] === slots[2]) {
                                    winType = '🎉 **JACKPOT!**';
                                    winAmount = bahis * 10;
                                    color = '#00FF00';
                                    moneyData[userId].money += winAmount;
                                } else if (slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2]) {
                                    winType = '✨ **KAZANDIN!**';
                                    winAmount = bahis * 2;
                                    color = '#00FF00';
                                    moneyData[userId].money += winAmount;
                                } else {
                                    winType = '😞 **KAYBETTİN**';
                                    winAmount = bahis;
                                    color = '#FF0000';
                                    moneyData[userId].money -= bahis;
                                }
                                
                                fs.writeFileSync('./money.json', JSON.stringify(moneyData, null, 2));
                                
                                const resultEmbed = new EmbedBuilder()
                                    .setTitle('🎰 Slot Makinesi - Sonuç')
                                    .setColor(color)
                                    .setDescription(`**${result}**\n\n${winType}`)
                                    .addFields({ name: 'Bahis', value: `${bahis} TL`, inline: true })
                                    .addFields({ 
                                        name: winAmount > bahis ? 'Kazanç' : 'Kayıp', 
                                        value: `${winAmount > bahis ? '+' : '-'}${Math.abs(winAmount - bahis)} TL`, 
                                        inline: true 
                                    })
                                    .addFields({ 
                                        name: 'Yeni Bakiye', 
                                        value: `${moneyData[userId].money} TL`, 
                                        inline: true 
                                    })
                                    .setFooter(`${message.author.username} - Ekonomi Botu`)
                                    .setTimestamp();
                                
                                slotmesaj.edit({ embeds: [resultEmbed] });
                            }, 1500);
                        });
                    }, 1500);
                });
            }, 1500);
        });
    }
};
