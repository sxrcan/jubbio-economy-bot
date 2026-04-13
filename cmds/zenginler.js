const fs = require('fs');
const { EmbedBuilder } = require('@jubbio/core');

module.exports = {
    name: 'zenginler',
    description: 'En zengin 10 kişiyi gösterir.',
    execute: function(message, args) {
        const raw = fs.readFileSync('./money.json');
        const moneyData = JSON.parse(raw);
        
        const sortedUsers = Object.entries(moneyData)
            .sort(([,a], [,b]) => b.money - a.money)
            .slice(0, 10);
        
        const leaderboardEmbed = new EmbedBuilder()
            .setTitle('🏆 Zenginler Sıralaması')
            .setColor('#FFD700')
            .setDescription('En çok paraya sahip ilk 10 kullanıcı!')
            .setThumbnail('https://cdn.discordapp.com/attachments/741841323643383838/842949799495311380/money.png');
        
        const userFields = sortedUsers.map((entry, index) => {
            const [userId, data] = entry;
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            
            return {
                name: `${medal} Kullanıcı ${userId}`,
                value: `💰 ${data.money.toLocaleString()} TL`,
                inline: false
            };
        });
        
        leaderboardEmbed.addFields(...userFields);
        
        const totalMoney = Object.values(moneyData).reduce((sum, user) => sum + user.money, 0);
        const totalUsers = Object.keys(moneyData).length;
        
        leaderboardEmbed.addFields(
            { 
                name: '📊 İstatistikler', 
                value: `💰 Toplam Para: ${totalMoney.toLocaleString()} TL\n👥 Toplam Kullanıcı: ${totalUsers}`, 
                inline: false 
            }
        );
        
        leaderboardEmbed.setFooter(`${message.author.username} - Ekonomi Botu`)
            .setTimestamp()
            .setColor('#FFD700');
        
        message.reply({ embeds: [leaderboardEmbed] });
    }
};
