const fs = require('fs');
const { EmbedBuilder } = require('@jubbio/core');
const checkBalance = require('../utils/checkBalance');

module.exports = {
    name: 'blackjack',
    description: 'Blackjack oyunu oynarsınız.',
    execute: function(message, args) {
        const userId = message.author.id;
        
        if (args.length !== 1) {
            message.reply('❌ Komutu doğru kullanınız: !blackjack (bahis)');
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
        
        function kartçek() {
            const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
            return cards[Math.floor(Math.random() * cards.length)];
        }
        
        function kartGorsel(kart) {
            const kartEmojileri = {
                'A': '🃏', 'K': '🂾', 'Q': '🂽', 'J': '🂻',
                '10': '🃙', '9': '🃘', '8': '🃗', '7': '🃖',
                '6': '🃕', '5': '🃔', '4': '🃓', '3': '🃒', '2': '🃑'
            };
            return kartEmojileri[kart] || '🃏';
        }
        
        function hesapla(hand) {
            let value = 0;
            let hasAce = false;
            
            for (const card of hand) {
                if (card === 'A') {
                    hasAce = true;
                    value += 11;
                } else if (['K', 'Q', 'J'].includes(card)) {
                    value += 10;
                } else {
                    value += parseInt(card);
                }
            }
            
            if (hasAce && value > 21) {
                value -= 10;
            }
            
            return value;
        }
        
        const oyuncuKartları = [kartçek(), kartçek()];
        const krupiyeKartları = [kartçek(), kartçek()];
        
        const oyuncuDeger = hesapla(oyuncuKartları);
        const krupiyeDeger = hesapla(krupiyeKartları);
        
        const startEmbed = new EmbedBuilder()
            .setTitle('🃏 Blackjack')
            .setColor('#0066CC')
            .setDescription('🃏 Kartlar dağıtılıyor...')
            .addFields({ name: 'Bahis', value: `${bahis} TL`, inline: true })
            .addFields({ 
                name: 'Kartlarınız', 
                value: `${kartGorsel(oyuncuKartları[0])} ${kartGorsel(oyuncuKartları[1])}`, 
                inline: true 
            })
            .addFields({ 
                name: 'Krupiye', 
                value: `${kartGorsel(krupiyeKartları[0])} 🃔`, 
                inline: true 
            })
            .setFooter(`${message.author.username} - Ekonomi Botu`)
            .setTimestamp();

        message.reply({ embeds: [startEmbed] }).then(oyunMesaj => {
            setTimeout(() => {
                if (oyuncuDeger === 21) {
                    moneyData[userId].money += bahis * 1.5;
                    
                    const blackjackEmbed = new EmbedBuilder()
                        .setTitle('🃏 Blackjack - SONUÇ')
                        .setColor('#00FF00')
                        .setDescription('🎉 **BLACKJACK!**')
                        .addFields({ name: 'Kartlarınız', value: `${kartGorsel(oyuncuKartları[0])} ${kartGorsel(oyuncuKartları[1])} (${oyuncuDeger})`, inline: true })
                        .addFields({ name: 'Krupiye', value: `${kartGorsel(krupiyeKartları[0])} ${kartGorsel(krupiyeKartları[1])} (${krupiyeDeger})`, inline: true })
                        .addFields({ name: 'Kazanç', value: `+${(bahis * 1.5).toFixed(1)} TL`, inline: true })
                        .addFields({ name: 'Yeni Bakiye', value: `${moneyData[userId].money} TL`, inline: true })
                        .setFooter(`${message.author.username} - Ekonomi Botu`)
                        .setTimestamp();
                    
                    oyunMesaj.edit({ embeds: [blackjackEmbed] });
                } else if (krupiyeDeger === 21) {
                    moneyData[userId].money -= bahis;
                    
                    const krupiyeBlackjackEmbed = new EmbedBuilder()
                        .setTitle('🃏 Blackjack - SONUÇ')
                        .setColor('#FF0000')
                        .setDescription('😞 **KRUPİYE BLACKJACK!**')
                        .addFields({ name: 'Kartlarınız', value: `${kartGorsel(oyuncuKartları[0])} ${kartGorsel(oyuncuKartları[1])} (${oyuncuDeger})`, inline: true })
                        .addFields({ name: 'Krupiye', value: `${kartGorsel(krupiyeKartları[0])} ${kartGorsel(krupiyeKartları[1])} (${krupiyeDeger})`, inline: true })
                        .addFields({ name: 'Kayıp', value: `-${bahis} TL`, inline: true })
                        .addFields({ name: 'Yeni Bakiye', value: `${moneyData[userId].money} TL`, inline: true })
                        .setFooter(`${message.author.username} - Ekonomi Botu`)
                        .setTimestamp();
                    
                    oyunMesaj.edit({ embeds: [krupiyeBlackjackEmbed] });
                } else {
                    const gameEmbed = new EmbedBuilder()
                        .setTitle('🃏 Blackjack')
                        .setColor('#0066CC')
                        .setDescription('Kartlarınızı seçin...')
                        .addFields({ name: 'Kartlarınız', value: `${kartGorsel(oyuncuKartları[0])} ${kartGorsel(oyuncuKartları[1])} (${oyuncuDeger})`, inline: true })
                        .addFields({ name: 'Krupiye', value: `${kartGorsel(krupiyeKartları[0])} ${kartGorsel(krupiyeKartları[1])} (${krupiyeDeger})`, inline: true })
                        .setFooter(`${message.author.username} - Ekonomi Botu`)
                        .setTimestamp();
                    
                    oyunMesaj.edit({ embeds: [gameEmbed] }).then(() => {
                        setTimeout(() => {
                            let sonucEmbed, sonucText, sonucRenk;
                            
                            if (oyuncuDeger > krupiyeDeger) {
                                moneyData[userId].money += bahis;
                                sonucText = '🎉 **KAZANDINIZ!**';
                                sonucRenk = '#00FF00';
                            } else if (krupiyeDeger > oyuncuDeger) {
                                moneyData[userId].money -= bahis;
                                sonucText = '😞 **KAYBETTİNİZ!**';
                                sonucRenk = '#FF0000';
                            } else {
                                sonucText = '🤝 **BERABERLİK!**';
                                sonucRenk = '#FFD700';
                            }
                            
                            sonucEmbed = new EmbedBuilder()
                                .setTitle('🃏 Blackjack - SONUÇ')
                                .setColor(sonucRenk)
                                .setDescription(sonucText)
                                .addFields({ name: 'Kartlarınız', value: `${kartGorsel(oyuncuKartları[0])} ${kartGorsel(oyuncuKartları[1])} (${oyuncuDeger})`, inline: true })
                                .addFields({ name: 'Krupiye', value: `${kartGorsel(krupiyeKartları[0])} ${kartGorsel(krupiyeKartları[1])} (${krupiyeDeger})`, inline: true })
                                .addFields({ 
                                    name: sonucRenk === '#FFD700' ? 'İade' : (sonucRenk === '#00FF00' ? 'Kazanç' : 'Kayıp'), 
                                    value: sonucRenk === '#FFD700' ? `${bahis} TL` : (sonucRenk === '#00FF00' ? `+${bahis} TL` : `-${bahis} TL`), 
                                    inline: true 
                                })
                                .addFields({ 
                                    name: 'Yeni Bakiye', 
                                    value: `${moneyData[userId].money} TL`, 
                                    inline: true 
                                })
                                .setFooter(`${message.author.username} - Ekonomi Botu`)
                                .setTimestamp();
                            
                            oyunMesaj.edit({ embeds: [sonucEmbed] });
                        }, 2000);
                    });
                }
                
                fs.writeFileSync('./money.json', JSON.stringify(moneyData, null, 2));
            }, 2000);
        });
    }
};
