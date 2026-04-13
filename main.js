const { Client, GatewayIntentBits } = require('@jubbio/core');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`[ USER ] - ${client.user.username}`);
});

client.commands = new Map();

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    client.commands.set(command.name, command);
    console.log(`[ KOMUT ] - ${command.name} yüklendi`);
}

client.on('messageCreate', (message) => {
    
    if (message.author?.bot) {
        return;
    }
    
    const prefix = '!';
    if (!message.content?.startsWith(prefix)) {
        return;
    }
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if (!client.commands.has(commandName)) {
        return;
    }
    
    const command = client.commands.get(commandName);
    
    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(`Komut hatası: ${commandName}`, error);
        if (message.reply) {
            message.reply('❌ Üzgünüm bir hata oluştu! Lütfen daha sonra tekrar deneyin.');
        }
    }
});

client.on('raw', (data) => {
});

client.login(process.env.JUBBIO_TOKEN).catch(error => {
    console.error('Bot giriş yapamadı:', error);
});
