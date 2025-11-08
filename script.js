let config = {};
let jenisDipilih="", layananDipilih="", deliveryDipilih="";
let lokasiTeks = "";

const DEFAULT_PATH = "config.json";

/* Load config */
async function loadConfig(){
  try{
    const resp = await fetch(DEFAULT_PATH);
    config = await resp.json();
    applyConfigToUI();
  }catch(e){ console.error("loadConfig", e); config={}; }
}

/* Apply UI */
function applyConfigToUI(){
  document.getElementById("logoImg").src = config.logo;
  document.getElementById("siteTitle").textContent = "🧺 "+config.namaLaundry;
  document.getElementById("footerName").textContent = config.namaLaundry;
  document.documentElement.style.setProperty('--accent-2', config.warna);
  document.documentElement.style.setProperty('--accent', config.warna);
  document.body.style.background = config.background;
  populateLayananButtons();
}

/* Populate layanan */
function populateLayananButtons(){
  const container = document.getElementById("layananGroup");
  container.innerHTML = "";
  (config.layananKiloan||[]).forEach(it=>{
    const d = document.createElement("div");
    d.className="btn layanan kiloan"; d.textContent=it; d.onclick=()=>pilihLayanan(it,d); d.style.display="none";
    container.appendChild(d);
  });
  (config.layananSatuan||[]).forEach(it=>{
    const d = document.createElement("div");
    d.className="btn layanan satuan"; d.textContent=it; d.onclick=()=>pilihLayanan(it,d); d.style.display="none";
    container.appendChild(d);
  });
}

function pilihJenis(j,el){ jenisDipilih=j; layananDipilih=""; document.querySelectorAll('#jenisGroup .btn').forEach(b=>b.classList.remove('active')); el.classList.add('active'); document.querySelectorAll('.layanan').forEach(b=>{ b.style.display=(j==="Kiloan"?b.classList.contains('kiloan'):b.classList.contains('satuan'))?"block":"none"; b.classList.remove('active'); }); }
function pilihLayanan(l,el){ layananDipilih=l; document.querySelectorAll('.layanan').forEach(b=>b.classList.remove('active')); el.classList.add('active'); }
function pilihDelivery(d,el){ deliveryDipilih=d; document.querySelectorAll('#deliveryGroup .btn').forEach(b=>b.classList.remove('active')); el.classList.add('active'); }

/* Lokasi */
function ambilLokasi(){ if(navigator.geolocation){ navigator.geolocation.getCurrentPosition(pos=>{ lokasiTeks=`https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`; document.getElementById("lokasi").value="Lokasi berhasil diambil ✅"; }, err=>{ alert("Aktifkan izin lokasi"); }, {timeout:10000}); }else alert("Browser tidak mendukung geolokasi."); }

/* Submit order */
function submitOrder(tujuan){
  const nama = document.getElementById("nama").value.trim(); 
  if(!nama || !jenisDipilih || !layananDipilih || !deliveryDipilih){ alert("Isi semua field wajib!"); return; }
  const nohp = document.getElementById("nohp").value.trim()||"-";
  const estimasi = document.getElementById("estimasi").value||"-";
  const waktu = document.getElementById("waktu").value||"-";
  const alamat = document.getElementById("alamat").value.trim()||"-";
  const lokasi = lokasiTeks||"-";
  const pesan=`🧺 *PESAN LAUNDRY* 🧺\n*${config.namaLaundry}*\n\n👤 Nama: ${nama}\n📱 No. WA: ${nohp}\n🧥 Jenis: ${jenisDipilih}\n🧼 Layanan: ${layananDipilih}\n⏳ Estimasi: ${estimasi}\n🚚 Delivery: ${deliveryDipilih}\n🕓 Waktu: ${waktu}\n🏠 Alamat: ${alamat}\n📍 Lokasi: ${lokasi}`;
  const target = tujuan==="admin"?config.whatsappAdmin:config.whatsappKurir;
  window.open(`https://wa.me/${target}?text=${encodeURIComponent(pesan)}`, "_blank");
function submitOrder(tipe) {
  const nama = document.getElementById("nama").value;
  const layanan = document.getElementById("layananGroup").textContent || "Tidak dipilih";
  const delivery = document.querySelector(".btn-group #deliveryGroup")?.textContent || "Tidak dipilih";
  const estimasi = document.getElementById("estimasi").value;
  const note = document.getElementById("note").value;

  if (!nama || !layanan || !estimasi) {
    alert("Harap isi semua kolom wajib (*)");
    return;
  }

  const order = {
    nama,
    layanan,
    delivery,
    estimasi,
    note,
    status: "Baru",
    waktu: new Date().toLocaleString()
  };

  // Simpan ke localStorage
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("✅ Order berhasil dikirim dan tersimpan di sistem admin!");
  async function loadConfig() {
  const res = await fetch("config.json");
  const cfg = await res.json();

  document.getElementById("siteTitle").textContent = cfg.site.nama;
  document.getElementById("siteSubtitle").textContent = cfg.site.deskripsi;
  document.getElementById("footerName").textContent = cfg.site.nama;
  document.getElementById("year").textContent = cfg.site.tahun;
  document.getElementById("logoImg").src = cfg.site.logo;
  document.documentElement.style.setProperty("--warna-tema", cfg.site.warnaTema);

  // Populate layanan
  const layananSelect = document.getElementById("layanan");
  for (const kategori in cfg.layanan) {
    const group = document.createElement("optgroup");
    group.label = kategori;
    cfg.layanan[kategori].forEach(item => {
      const opt = document.createElement("option");
      opt.textContent = item;
      group.appendChild(opt);
    });
    layananSelect.appendChild(group);
  }

  // Populate pengiriman dan estimasi
  cfg.pengiriman.forEach(p => {
    const opt = document.createElement("option");
    opt.textContent = p;
    document.getElementById("delivery").appendChild(opt);
  });

  cfg.estimasi.forEach(e => {
    const opt = document.createElement("option");
    opt.textContent = e;
    document.getElementById("estimasi").appendChild(opt);
  });

  // Kirim ke WhatsApp
  document.getElementById("orderForm").addEventListener("submit", e => {
    e.preventDefault();
    const nama = document.getElementById("nama").value;
    const nohp = document.getElementById("nohp").value;
    const layanan = document.getElementById("layanan").value;
    const delivery = document.getElementById("delivery").value;
    const estimasi = document.getElementById("estimasi").value;
    const alamat = document.getElementById("alamat").value;
    const note = document.getElementById("note").value;

    const template = cfg.whatsappTemplate.admin
      .replace("{nama}", nama)
      .replace("{nohp}", nohp)
      .replace("{layanan}", layanan)
      .replace("{delivery}", delivery)
      .replace("{estimasi}", estimasi)
      .replace("{alamat}", alamat)
      .replace("{note}", note)
      .replace("{namaLaundry}", cfg.site.nama);

    const url = `https://wa.me/${cfg.kontak.admin_wa}?text=${template}`;
    window.open(url, "_blank");
  });
}

document.addEventListener("DOMContentLoaded", loadConfig);
}

window.onload = ()=>{ loadConfig(); document.getElementById("year").textContent=(new Date()).getFullYear(); };
