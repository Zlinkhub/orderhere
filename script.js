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
}

window.onload = ()=>{ loadConfig(); document.getElementById("year").textContent=(new Date()).getFullYear(); };