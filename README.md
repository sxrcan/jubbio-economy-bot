# 🎰 Ekonomi Botu

Jubbio platformu için geliştirilmiş, embed'li ve görsel ekonomi botu.

## 📋 İçindekiler

- [🤖 Kurulum](#kurulum) - Botu nasıl kuracağınız
- [🚀 Başlatma](#başlatma) - Botu nasıl çalıştıracağınız  
- [🎮 Komutlar](#komutlar) - Tüm komutların listesi ve kullanımı
- [🎨 Embed Özellikleri](#embed-özellikleri) - Embed'li arayüz özellikleri
- [📊 Veritabanı](#veritabanı) - Para sistemi nasıl çalışır
- [🔧 Geliştirme](#geliştirme) - Yeni komutlar nasıl eklenir

---

## 🚀 Kurulum

### Gerekli Paketler
```bash
npm install @jubbio/core dotenv
```

### Token Ayarı
1. `.env` dosyası oluşturun:
```env
JUBBIO_TOKEN=BOTTOKENINIZIBURAYAGIRIN
```

### Botu Çalıştırma
```bash
node main.js
```

**✅ Başarılı Çalışma:**
```
✅ Bot hazır! User: User_8218 (8218), App: 566747045646307328
[ ONLINE ] - Ekonomi Bot hazır!
[ USER ] - User_8218
[ KOMUT ] - bakiye yüklendi
[ KOMUT ] - blackjack yüklendi
[ KOMUT ] - gönder yüklendi
[ KOMUT ] - günlük yüklendi
[ KOMUT ] - help yüklendi
[ KOMUT ] - paraekle yüklendi
[ KOMUT ] - slot yüklendi
[ KOMUT ] - yazıtura yüklendi
[ KOMUT ] - zenginler yüklendi
```

---

## 🎮 Komutlar

**Prefix:** `!`

### 💵 Para Komutları

| Komut | Açıklama | Kullanım |
|--------|-----------|----------|
| `bakiye` | Hesabınızdaki parayı gösterir | `!bakiye` |
| `günlük` | Günlük ödül alırsınız (12 saatte bir) | `!günlük` |
| `gönder` | Başka bir kullanıcıya para gönderir | `!gönder @kullanıcı 100` |
| `zenginler` | En zengin 10 kişiyi gösterir | `!zenginler` |

### 🎰 Oyun Komutları

| Komut | Açıklama | Kullanım | Kazanç Oranı |
|--------|-----------|----------|-------------|
| `slot` | Slot makinesi oyunu | `!slot 100` | 3x - 10x |
| `yazıtura` | Yazı tura oyunu | `!yazıtura 50 yazı` | 2x |
| `blackjack` | Blackjack kart oyunu | `!blackjack 200` | 1x - 1.5x |

### 🔧 Admin Komutları

| Komut | Açıklama | Kullanım |
|--------|-----------|----------|
| `paraekle` | Kullanıcıya para ekler | `!paraekle @kullanıcı 500` |

### 📖 Yardım

- `!help` - Tüm komutları embed formatında gösterir

---

## 🎨 Embed Özellikleri

Bot, modern ve görsel embed'li arayüz kullanır:

### 🎰 Slot Makinesi
- 🎨 3 aşamalı animasyon
- 💎 10 farklı sembol (meyveler + 💎 + 7️⃣)
- 🎉 JACKPOT: 3 aynı sembol → 10x kazanç
- ✨ Küçük kazanç: 2 aynı sembol → 2x kazanç
- 📊 Detaylı sonuç embed'i

### 🃏 Blackjack
- 🃏 Gerçek kart emoji'leri (🃏🃙🂾🂽🂻)
- 📊 3 aşamalı oyun akışı
- 🎉 BLACKJACK bonusu (1.5x kazanç)
- 🤝 Beraberlik durumu
- 📋 Detaylı kart gösterimi

### 🪙 Yazı Tura
- 🪙 Para havaya atma animasyonu
- ⏱️ 2 saniyelik sonuç gösterimi
- 📄🪙 Görsel sonuç (YAZI/TURA)
- 🎊 Kazanç/kayıp renk ayrımı

### 🏆 Zenginler
- 🥇🥈🥉 Madalya sistemi (ilk 3)
- 💰 Binlik ayraçlı para formatı
- 📊 Toplam ekonomi istatistikleri
- 🖼️ Thumbnail ile görsel zenginleştirme

---

## 📊 Veritabanı

Bot kullanıcı verilerini `money.json` dosyasında saklar:

### Veri Yapısı
```json
{
  "kullanıcı_id": {
    "money": 1500
  }
}
```

### Özellikler
- ✅ Otomatik kullanıcı oluşturma
- ✅ Güvenli para işlemleri
- ✅ Cooldown sistemi (günlük ödül için)
- ✅ JSON formatında veri saklama

---

## 🔧 Geliştirme

### Yeni Komut Ekleme

1. `cmds/` klasöründe yeni `.js` dosyası oluşturun
2. Şablonu kullanın:

```javascript
const { EmbedBuilder } = require('@jubbio/core');

module.exports = {
    name: 'yeni-komut',
    description: 'Yeni komut açıklaması',
    execute: function(message, args) {
        const embed = new EmbedBuilder()
            .setTitle('🎯 Yeni Komut')
            .setColor('#00AE86')
            .setDescription('Bu yeni bir komuttur!')
            .setFooter(`${message.author.username} - Ekonomi Botu`)
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
};
```

3. Botu yeniden başlatın, komut otomatik yüklenecektir

### Proje Yapısı

```
jubbio-bot/
├── cmds/                    # Komut dosyaları
│   ├── bakiye.js          # Bakiye kontrolü
│   ├── blackjack.js        # Blackjack oyunu
│   ├── gönder.js           # Para transferi
│   ├── günlük.js          # Günlük ödül
│   ├── help.js             # Yardım menüsü
│   ├── paraekle.js         # Admin para ekleme
│   ├── slot.js             # Slot makinesi
│   ├── yazıtura.js        # Yazı tura oyunu
│   └── zenginler.js        # Zenginler sıralaması
├── utils/                   # Yardımcı fonksiyonlar
│   └── checkBalance.js    # Bakiye kontrolü
├── main.js                  # Ana bot dosyası
├── money.json              # Veritabanı
├── .env                    # Token dosyası
└── README.md               # Bu dosya
```

---

## 🛡️ Güvenlik

- ✅ Token `.env` dosyasında güvenli saklanır
- ✅ Para işlemleri doğrulanır
- ✅ Admin komutları korunur
- ✅ Hata yakalama ve yönetimi

---

## 🎯 Örnek Kullanım

### Slot Oyunu
```
!slot 100
🎰 Slot Makinesi
🎲 Slot makinesi çevriliyor...
🎰 Slot makinesi çalışıyor.. 🍒 🎲 🎲
🎰 Slot makinesi çalışıyor.. 🍒 🍊 🎲
🎰 Slot makinesi sonuçlandı! 🍒 🍒 🍒
🎉 JACKPOT! 1000 TL kazandınız!
```

### Blackjack Oyunu
```
!blackjack 200
🃏 Blackjack
🃏 Kartlar dağıtılıyor...
🃏 Kartlarınız: 🃏 🃙 (21)
Krupiye: 🃔
🎉 BLACKJACK! 300 TL kazandınız!
```

### Zenginler Sıralaması
```
!zenginler
🏆 Zenginler Sıralaması
🥇 Kullanıcı 123456: 50,000 TL
🥈 Kullanıcı 789012: 35,000 TL
🥉 Kullanıcı 345678: 25,000 TL
📊 İstatistikler
💰 Toplam Para: 125,000 TL
👥 Toplam Kullanıcı: 15
```

---

## 📞 Sorun Giderme

### Rate Limiting (429 Hatası)
Eğer "429" hatası alırsanız:
1. Biraz bekleyin (1-2 dakika)
2. Botu yeniden başlatın
3. Bu Jubbio'nun güvenlik önlemidir

### Komut Çalışmıyorsa
1. Prefix'in doğru olduğundan emin olun (`!`)
2. Komut adını doğru yazdığınızdan emin olun
3. Büyük/küçük harf duyarlılığına dikkat edin

---

## 👥 Destek

**Platform:** Jubbio  
**Version:** 1.0.0  
**License:** MIT

---

## 📜 Lisans

Bu proje MIT Lisansı altında dağıtılmaktadır. Detaylı bilgi için [LICENSE](LICENSE) dosyasını inceleyin.

---