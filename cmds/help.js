const { EmbedBuilder } = require('@jubbio/core');

module.exports = {
    name: 'help',
    description: 'Ekonomi botu yardım menüsünü gösterir.',
    execute: function(message, args) {
        try {
            const helpEmbed = new EmbedBuilder()
                .setTitle('💰 Ekonomi Botu')
                .setColor('#00AE86')
                .setDescription('Aşağıda tüm komutların listesi bulunmaktadır:')
                .addFields(
                    {
                        name: '💵 Para Komutları',
                        value: '`bakiye` • `günlük` • `gönder` • `zenginler`',
                        inline: true
                    },
                    {
                        name: '🎮 Oyunlar', 
                        value: '`slot` • `yazıtura` • `blackjack`',
                        inline: true
                    },
                    {
                        name: '🔧 Admin',
                        value: '`paraekle`',
                        inline: true
                    }
                )
                .addFields({ name: '📋 Kullanım', value: '**Prefix:** `!`\n**Örnek:** `!bakiye`' })
                .setFooter('Ekonomi Botu v1.0')
                .setTimestamp();

            if (message.reply) {
                message.reply({ embeds: [helpEmbed] });
            } else if (message.channel && message.channel.send) {
                message.channel.send({ embeds: [helpEmbed] });
            } else {
                message.reply('Embed gönderilemedi, lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Embed hatası:', error);
            const helpText = `💰 **Ekonomi Botu Komutları:**

💵 **Para Komutları:**
• bakiye - Hesabınızdaki parayı gösterir
• günlük - Günlük ödül alırsınız (12 saatte bir)
• gönder <kullanıcı> <miktar> - Başka bir kullanıcıya para gönderir
• zenginler - En zengin 10 kişiyi gösterir

🎮 **Oyun Komutları:**
• slot <bahis> - Slot makinesi oyunu
• yazıtura <bahis> <yazı/tura> - Yazı tura oyunu
• blackjack <bahis> - Blackjack oyunu

🔧 **Admin Komutları:**
• paraekle <kullanıcı> <miktar> - Kullanıcıya para ekler

**Örnek:** !gönder @kullanıcı/id 100`;
            
            message.reply(helpText);
        }
    }
};
