# 🧺 Azayaka Laundry - Online Order Form

Selamat datang di **Azayaka Laundry Order Form**, halaman pemesanan cepat via WhatsApp 💬  
Website ini dibuat agar pelanggan bisa langsung memesan layanan laundry dengan mudah dan cepat tanpa perlu aplikasi tambahan.

---

## 🌐 URL Publik
👉 **https://Zlinkhub.github.io/orderhere**

---

## 🧩 Struktur File

| File | Fungsi |
|------|--------|
| `index.html` | Halaman utama form pemesanan |
| `config.json` | File konfigurasi (logo, warna tema, nama laundry, dan daftar layanan satuan) |
| `README.md` | Dokumentasi ini |

---

## ⚙️ Cara Mengatur Tampilan

Kamu bisa **mengubah tampilan website** tanpa perlu menyentuh kode HTML.

1. Buka file [`config.json`](./config.json)
2. Edit bagian-bagian berikut sesuai kebutuhan:

```json
{
  "namaLaundry": "Nama Laundry Kamu",
  "logo": "[https://static.1010dry.id/pesanlaundry/images/5f486d5d5fb3cbf0ab6dc2278ee9a997.png]"
  "warna": "#ff8c00",
  "layananSatuan": 
    "Dry Clean",
    "Pakaian",
    "Bedcover",
    "Sepatu",
    "Karpet"
  ]
}
