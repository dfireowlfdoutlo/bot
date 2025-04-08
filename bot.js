const { Client } = require('discord.js');
const fetch = require('node-fetch');

const TOKEN = 'MTM1NjM2NTY2NzE3NDk3NzczOQ.Gr-_Fi.Hr6Xc29pWdENJRw4Auk7KL2rI4ZT7DEgZ9ZOPM';
const CHANNEL_ID = '1354512824407167078';
const WEBSITE_URL = 'https://panel.pixel-host.icu/';
const CHECK_INTERVAL = 1000;

const client = new Client();

let lastStatus = null;
let statusMessage = null;

client.once('ready', async () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
    
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error('❌ لم يتم العثور على القناة!');
        return;
    }

    try {
        statusMessage = await channel.send('🌐  جاري التحقق من حالة الموقع...');
        checkWebsiteStatus();
        setInterval(checkWebsiteStatus, CHECK_INTERVAL);
    } catch (error) {
        console.error('❌ خطأ أثناء إرسال الرسالة:', error);
    }
});

async function checkWebsiteStatus() {
    try {
        const response = await fetch(WEBSITE_URL);
        const status = response.ok ? '✅ الموقع يعمل' : '❌ الموقع متوقف';

        // تسجيل الحالة في الـ console
        console.log(`تم التحقق من الموقع: ${status}`);

        if (status !== lastStatus) {
            lastStatus = status;
            await updateMessage(status);
        }
    } catch (error) {
        if (lastStatus !== '❌ الموقع متوقف') {
            lastStatus = '❌ الموقع متوقف';
            await updateMessage(lastStatus);
        }

        // تسجيل خطأ في حالة عدم الوصول للموقع
        console.log('❌ فشل في الوصول إلى الموقع:', error);
    }
}

async function updateMessage(status) {
    if (!statusMessage) return;

    try {
        if (status && status.trim()) {
            await statusMessage.edit(` \n${status}`);
        }
    } catch (error) {
        console.error('❌ فشل تحديث الرسالة:', error);
    }
}

client.login(TOKEN);
