let config = {};
let jenisDipilih = "", layananDipilih = "", deliveryDipilih = "";
let lokasiTeks = "";
const DEFAULT_PATH = "config.json";

/* ===============================
   LOAD CONFIG
=============================== */
async function loadConfig(){
  try{
    const resp = await fetch(DEFAULT_PATH);
    config = await resp.json();
    applyConfigToUI();
  }catch(e){
    console.error("loadConfig", e);
    config = {};
  }
}

/* ===============================
   APPLY CONFIG KE UI
=============================== */
function applyConfigToUI(){
  document.getElementById("logoImg").src = config.logo;
  document.getElementById("siteTitle").textContent = "🧺 " + config.namaLaundry;
  document.getElementById("footerName").textContent = config.namaLaundry;
  document.documentElement.style.setProperty('--accent-2', config.warna);
  document.documentElement.style.setProperty('--accent', config.warna);
  document.body.style.background = config.background;
  populateLayananButtons();
}

/* ===============================
   BUAT TOMBOL LAYANAN
=============================== */
function populateLayananButtons(){
  const container = document.getElementById("layananGroup");
  container.innerHTML = "";
  (config.layananKiloan || []).forEach(it => {
    const d = document.createElement("div");
    d.className = "btn layanan kiloan";
    d.textContent = it;
    d.onclick = () => pilihLayanan(it, d);
    d.style.display = "none";
    container.appendChild(d);
  });
  (config.layananSatuan || []).forEach(it => {
    const d = document.createElement("div");
    d.className = "btn layanan satuan";
    d.textContent = it;
    d.onclick = () => pilihLayanan(it, d);
    d.style.display = "none";
    container.appendChild(d);
  });
}

/* ===============================
   PILIHAN JENIS, LAYANAN, DELIVERY
=============================== */
function pilihJenis(j, el){
  jenisDipilih = j;
  layananDipilih = "";
  document.querySelectorAll('#jenisGroup .btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');

  document.querySelectorAll('.layanan').forEach(b => {
    const tampil = (j === "Kiloan" ? b.classList.contains('kiloan') : b.classList.contains('satuan'));
    b.style.display = tampil ? "block" : "none";
    b.classList.remove('active');
  });
}

function pilihLayanan(l, el){
  layananDipilih = l;
  document.querySelectorAll('.layanan').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function pilihDelivery(d, el){
  deliveryDipilih = d;
  document.querySelectorAll('#deliveryGroup .btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

/* ===============================
   FITUR: AMBIL LOKASI OTOMATIS
=============================== */
function ambilLokasi(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      lokasiTeks = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      document.getElementById("lokasi").value = "Lokasi berhasil diambil ✅";
    }, err=>{
      alert("Aktifkan izin lokasi agar bisa digunakan.");
    }, {timeout:10000});
  } else {
    alert("Browser tidak mendukung geolokasi.");
  }
}

/* ===============================
   FITUR: SUBMIT PESAN KE WHATSAPP
=============================== */
function submitOrder(tujuan){
  const nama = document.getElementById("nama").value.trim();
  const nohpInput = document.getElementById("nohp");
  const nohp = nohpInput.value.trim() || "-";

  if(!nama || !jenisDipilih || !layananDipilih || !deliveryDipilih){
    alert("Isi semua field wajib (nama, jenis, layanan, delivery)!");
    return;
  }

  // Simpan nomor WA ke localStorage jika diisi
  if(nohp !== "-") localStorage.setItem("lastWA", nohp);

  const estimasi = document.getElementById("estimasi").value || "-";
  const waktu = document.getElementById("waktu").value || "-";
  const alamat = document.getElementById("alamat").value.trim() || "-";
  const lokasi = lokasiTeks || "-";

  const pesan = `🧺 *PESAN LAUNDRY* 🧺
*${config.namaLaundry}*

👤 Nama: ${nama}
📱 No. WA: ${nohp}
🧥 Jenis: ${jenisDipilih}
🧼 Layanan: ${layananDipilih}
⏳ Estimasi: ${estimasi}
🚚 Delivery: ${deliveryDipilih}
🕓 Waktu: ${waktu}
🏠 Alamat: ${alamat}
📍 Lokasi: ${lokasi}`;

  const target = tujuan === "admin" ? config.whatsappAdmin : config.whatsappKurir;
  window.open(`https://wa.me/${target}?text=${encodeURIComponent(pesan)}`, "_blank");
}

/* ===============================
   FITUR: KLIK CEPAT 5X → LOGIN ADMIN
=============================== */
let clickCount = 0;
let lastClickTime = 0;

document.getElementById('siteTitle').addEventListener('click', function(){
  const now = Date.now();
  if(now - lastClickTime > 1000) clickCount = 0;
  clickCount++;
  lastClickTime = now;
  if(clickCount >= 5){
    clickCount = 0;
    document.getElementById('adminPanel').style.display = 'flex';
  }
});

/* ===============================
   FITUR: LOGIN ADMIN
=============================== */
const loginBtn = document.getElementById('loginBtn');
const msg = document.getElementById('loginMsg');

loginBtn.addEventListener('click', function(){
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();

  const ADMIN_USER = "Zlink";
  const ADMIN_PASS = "1234";

  if(user === ADMIN_USER && pass === ADMIN_PASS){
    msg.style.color = "green";
    msg.textContent = "Login berhasil!";
    setTimeout(() => {
      document.getElementById('adminPanel').style.display = 'none';
      alert("✅ Selamat datang Admin!");
      // Tambahkan fitur panel admin disini
    }, 800);
  } else {
    msg.style.color = "red";
    msg.textContent = "Username atau password salah!";
  }
});

// Klik luar untuk tutup panel
document.getElementById('adminPanel').addEventListener('click', function(e){
  if(e.target.id === "adminPanel"){
    document.getElementById('adminPanel').style.display = 'none';
  }
});

/* ===============================
   FITUR: SIMPAN NOMOR WA + TANDA ❌
=============================== */
function loadSavedWA(){
  const saved = localStorage.getItem("lastWA");
  const input = document.getElementById("nohp");
  const removeBtn = document.createElement("span");
  removeBtn.textContent = "❌";
  removeBtn.style.cursor = "pointer";
  removeBtn.style.marginLeft = "8px";
  removeBtn.title = "Hapus nomor tersimpan";

  // Tambahkan tombol ❌ di samping input
  input.insertAdjacentElement("afterend", removeBtn);

  // Jika ada data tersimpan, tampilkan
  if(saved){
    input.value = saved;
  }

  // Hapus nomor tersimpan
  removeBtn.addEventListener("click", ()=>{
    localStorage.removeItem("lastWA");
    input.value = "";
  });
}

/* ===============================
   INISIALISASI
=============================== */
window.onload = ()=>{
  loadConfig();
  document.getElementById("year").textContent = (new Date()).getFullYear();
  loadSavedWA();
};
// Tutup panel dengan klik di luar kotak
document.getElementById('adminPanel').addEventListener('click', function(e) {
if (e.target.id === "adminPanel") {
document.getElementById('adminPanel').style.display = 'none';
}
});
