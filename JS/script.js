if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("Service Worker Registered Successfully!"))
    .catch((err) => console.error("Service Worker Register Failed:", err));
}

// Memastikan semua elemen HTML sudah siap dibaca oleh JS
document.addEventListener("DOMContentLoaded", function () {
  // LOGIKA FITUR SCAN STRUK
  const inputKamera = document.getElementById("input-kamera");
  const statusScan = document.getElementById("status-scan");
  const inputDeskripsi = document.getElementById("deskripsi");
  const inputNominal = document.getElementById("nominal");

  // Pastikan elemennya ada di HTML sebelum menjalankan fungsi
  if (inputKamera) {
    inputKamera.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      statusScan.innerText = "⏳ Sedang membaca struk... Harap tunggu...";

      Tesseract.recognize(
        file,
        "ind", // Membaca teks dengan basis Bahasa Indonesia
        { logger: (m) => console.log(m) },
      )
        .then(({ data: { text } }) => {
          statusScan.innerText = "✅ Scan berhasil!";
          console.log("Hasil teks struk:", text);

          // 1. Algoritma mencari angka nominal terbesar (Total Belanja)
          const regexAngka = /\b\d[\d.,]*\b/g;
          const semuaAngka = text.match(regexAngka) || [];

          let nominalTertinggi = 0;
          semuaAngka.forEach((angkaStr) => {
            const angkaBersih = parseInt(angkaStr.replace(/[^0-9]/g, ""));
            if (angkaBersih > nominalTertinggi && angkaBersih < 10000000) {
              nominalTertinggi = angkaBersih;
            }
          });

          // 2. Mengambil baris pertama teks sebagai nama toko/deskripsi
          const barisTeks = text
            .split("\n")
            .map((b) => b.trim())
            .filter((b) => b.length > 3);
          const perkiraanDeskripsi = barisTeks[0] || "Transaksi via Scan";

          // Input otomatis nilai hasil scan ke Form
          if (nominalTertinggi > 0) {
            inputNominal.value = nominalTertinggi;
          }
          inputDeskripsi.value = perkiraanDeskripsi;
        })
        .catch((error) => {
          console.error(error);
          statusScan.innerText =
            "❌ Gagal membaca struk. Coba foto ulang lebih dekat.";
        });
    });
  }

  // ======================================================================
  // (Opsional) Tempatkan logika submit form keuangan Anda di bawah sini nanti...
  // ======================================================================
});
