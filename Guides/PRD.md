# **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

## **Aplikasi Chat Internasional dengan Auto-Translation**

**Versi Dokumen:** 1.0  
**Tanggal:** 3 Juli 2026

---

# **1\. Ringkasan Produk**

## **1.1 Nama Produk (Working Title)**

**LinguaChat**  
*(nama masih dapat diubah sesuai kebutuhan)*

## **1.2 Deskripsi Singkat**

LinguaChat adalah aplikasi chat 1-to-1 lintas negara yang memungkinkan pengguna dari bahasa berbeda untuk berkomunikasi tanpa perlu menerjemahkan pesan secara manual. Sistem akan secara otomatis menerjemahkan pesan yang dikirim ke bahasa preferensi penerima, sehingga setiap pengguna dapat membaca pesan dalam bahasa yang mereka pahami.

Aplikasi ini dirancang untuk menyelesaikan kendala komunikasi antar pengguna internasional, misalnya antara pengguna dari Indonesia, Thailand, Jepang, atau negara lainnya, dengan cara mengintegrasikan layanan machine translation ke dalam sistem chat.

## **1.3 Nilai Utama Produk**

Produk ini menawarkan tiga nilai utama:

1. **Komunikasi lintas bahasa tanpa translate manual**  
2. **Pengalaman chat yang lebih praktis dan natural**  
3. **Penyimpanan pesan asli dan hasil terjemahan secara terstruktur**

---

# **2\. Latar Belakang Masalah**

Komunikasi digital lintas negara semakin umum terjadi, baik untuk pertemanan, komunitas, pembelajaran, maupun kolaborasi. Namun, perbedaan bahasa masih menjadi hambatan utama. Pada aplikasi chat biasa, pengguna sering harus menyalin pesan ke layanan penerjemah eksternal, lalu kembali ke aplikasi chat untuk membalas. Proses ini tidak efisien, mengganggu alur percakapan, dan menurunkan kenyamanan pengguna.

Permasalahan tersebut dapat diatasi dengan menghadirkan aplikasi chat yang memiliki fitur auto-translation, sehingga pesan yang dikirim oleh pengguna dapat langsung diterjemahkan ke bahasa preferensi penerima. Dengan demikian, pengguna dapat fokus pada percakapan tanpa harus berpindah aplikasi atau menerjemahkan pesan secara manual.

---

# **3\. Tujuan Produk**

## **3.1 Tujuan Umum**

Membangun aplikasi chat lintas bahasa yang mampu menerjemahkan pesan secara otomatis agar komunikasi antar pengguna dari negara atau bahasa berbeda menjadi lebih mudah, cepat, dan nyaman.

## **3.2 Tujuan Khusus**

1. Memungkinkan pengguna mengirim dan menerima pesan teks dalam percakapan pribadi (1-to-1 chat).  
2. Menerjemahkan pesan secara otomatis berdasarkan bahasa preferensi penerima.  
3. Menyimpan pesan asli dan hasil terjemahan agar sistem tetap transparan dan dapat diaudit.  
4. Menyediakan riwayat chat yang dapat diakses kembali oleh pengguna.  
5. Memberikan pengalaman penggunaan yang sederhana dan mudah dipahami.

---

# **4\. Ruang Lingkup Produk**

## **4.1 In Scope (Termasuk dalam pengembangan)**

Fitur yang masuk dalam ruang lingkup versi utama/MVP:

1. Registrasi dan login pengguna  
2. Pengelolaan profil pengguna  
3. Penyimpanan bahasa preferensi pengguna  
4. Daftar pengguna / pencarian pengguna untuk memulai percakapan  
5. Percakapan privat 1-to-1  
6. Pengiriman pesan teks  
7. Auto-translation pesan saat dikirim  
8. Penyimpanan pesan asli dan pesan terjemahan  
9. Riwayat chat per percakapan  
10. Tampilan pesan asli dan/atau hasil terjemahan  
11. Penanganan kegagalan translation dasar  
12. API backend untuk kebutuhan frontend SPA/mobile

## **4.2 Out of Scope (Tidak termasuk pada versi awal)**

Fitur berikut tidak menjadi fokus pada versi awal agar scope tetap realistis:

1. Group chat  
2. Voice note / panggilan suara / video call  
3. Story/status  
4. End-to-end encryption  
5. Moderasi konten otomatis  
6. GIF reaction tingkat lanjut  
7. Multi-device synchronization yang kompleks  
8. AI reply suggestion  
9. Translation untuk voice message  
10. Translation correction crowdsourcing  
11. Integrasi banyak provider translation sekaligus pada MVP

---

# **5\. Target Pengguna**

## **5.1 Primary Users**

1. **Pengguna yang ingin berkomunikasi dengan teman dari negara lain**  
2. **Mahasiswa atau pelajar yang memiliki teman internasional**  
3. **Komunitas lintas negara**  
4. **Pengguna yang tidak fasih bahasa asing namun tetap ingin berinteraksi secara aktif**

## **5.2 Karakteristik Pengguna**

* Memiliki bahasa utama yang berbeda-beda  
* Membutuhkan komunikasi cepat dan sederhana  
* Tidak ingin menerjemahkan pesan secara manual  
* Menginginkan tampilan chat yang familiar dan mudah digunakan

---

# **6\. Problem Statement**

Bagaimana membangun aplikasi chat yang memungkinkan dua pengguna dengan bahasa berbeda dapat berkomunikasi secara natural melalui sistem penerjemahan otomatis, tanpa mengorbankan kejelasan isi pesan, kenyamanan penggunaan, dan keterlacakan pesan asli?

---

# **7\. Product Vision**

Menjadi platform komunikasi lintas bahasa yang memudahkan pengguna dari berbagai negara untuk saling terhubung tanpa terhalang perbedaan bahasa.

---

# **8\. Sasaran Keberhasilan Produk**

## **8.1 Sasaran Fungsional**

1. Pengguna dapat membuat akun dan menentukan bahasa preferensinya.  
2. Pengguna dapat mencari pengguna dan menambahkan sebagai teman  
3. Pengguna dapat memulai percakapan dengan teman.  
4. Pesan yang dikirim dapat diterjemahkan otomatis ke bahasa penerima.  
5. Penerima dapat membaca pesan hasil terjemahan di dalam chat.  
6. Sistem tetap menyimpan teks asli untuk keperluan transparansi dan referensi.

## **8.2 Sasaran Pengalaman Pengguna**

1. Pengiriman pesan terasa sederhana dan tidak membingungkan.  
2. Pengguna dapat mengetahui bahwa pesan telah diterjemahkan.  
3. Pengguna dapat memahami isi pesan lawan bicara tanpa membuka translator eksternal.

## **8.3 Sasaran Teknis**

1. Backend mampu memproses translation request dan menyimpan hasilnya ke database.  
2. Sistem dapat menangani kegagalan translation tanpa menyebabkan pesan hilang.  
3. API dapat digunakan oleh frontend secara konsisten dan terstruktur.

---

# **9\. Asumsi Produk**

1. Setiap pengguna memiliki **bahasa preferensi utama** yang digunakan sistem untuk menampilkan pesan terjemahan.  
2. Translation service awal menggunakan **LibreTranslate**.  
3. Versi awal difokuskan pada **chat 1-to-1**, bukan group chat.  
4. Pesan yang didukung pada MVP adalah **pesan teks**.  
5. Translation dapat dilakukan secara sinkron atau asynchronous, namun desain sistem harus memungkinkan pengembangan ke model queue/job.

---

# **10\. Gambaran Solusi**

Saat seorang pengguna mengirim pesan, sistem akan:

1. menerima pesan asli dari pengirim,  
2. mengidentifikasi bahasa target berdasarkan preferensi penerima,  
3. mengirim permintaan terjemahan ke translation service,  
4. menyimpan teks asli dan hasil terjemahan ke database,  
5. menampilkan pesan hasil terjemahan pada sisi penerima.

Contoh:

* User A bahasa utama: Indonesia (id)  
* User B bahasa utama: Thailand (th)

User A mengirim:

“Halo, kamu sedang sibuk?”

Sistem:

* menyimpan teks asli: “Halo, kamu sedang sibuk?”  
* menerjemahkan ke Thai  
* menyimpan hasil terjemahan  
* menampilkan versi Thai ke User B

---

# **11\. User Roles**

Pada versi awal terdapat satu role utama:

## **11.1 User**

Hak akses user:

1. Registrasi akun  
2. Login/logout  
3. Mengatur profil dan bahasa preferensi  
4. Mencari pengguna  
5. Menambahkan pengguna sebagai teman  
6. Memulai percakapan dengan teman  
7. Mengirim pesan  
8. Menerima pesan  
9. Melihat riwayat chat  
10. Melihat pesan asli dan/atau hasil terjemahan sesuai desain sistem

---

# **12\. Fitur Utama Produk**

## **12.1 Modul Autentikasi**

### **Tujuan**

Memungkinkan pengguna membuat akun dan mengakses aplikasi secara aman.

### **Fitur**

1. Registrasi akun  
2. Login  
3. Logout  
4. Penyimpanan token/session auth  
5. Validasi kredensial

### **Data yang dikelola**

* nama  
* email / username  
* password  
* bahasa preferensi

---

## **12.2 Modul Profil Pengguna**

### **Tujuan**

Menyimpan identitas dasar pengguna dan preferensi bahasa yang akan digunakan sistem untuk translation.

### **Fitur**

1. Melihat profil sendiri  
2. Mengubah nama  
3. Mengubah foto profil (opsional fase berikutnya)  
4. Mengubah bahasa preferensi  
5. Menyimpan negara asal (opsional sebagai data profil, bukan penentu utama translation)

### **Catatan penting**

Bahasa preferensi **lebih penting** daripada negara asal. Negara dapat disimpan sebagai data tambahan, namun translation harus mengacu pada **preferred\_language**, bukan semata negara.

---

## **12.3 Modul Daftar Pengguna / Kontak**

### **Tujuan**

Memungkinkan user menemukan pengguna lain untuk memulai percakapan.

### **Fitur**

1. Menampilkan daftar pengguna  
2. Pencarian pengguna berdasarkan nama  
3. Menambahkan pengguna lain sebagai teman  
4. Membuka halaman percakapan dengan teman terpilih

### **Catatan**

Pada MVP, relasi pertemanan/follow tidak wajib. Sistem dapat langsung mengizinkan chat antar pengguna yang terdaftar.

---

## **12.4 Modul Percakapan 1-to-1**

### **Tujuan**

Menyediakan wadah percakapan privat antar dua pengguna.

### **Fitur**

1. Membuat atau membuka percakapan dengan user lain  
2. Menampilkan daftar pesan dalam percakapan  
3. Menampilkan waktu pengiriman pesan  
4. Menampilkan urutan pesan berdasarkan waktu

---

## **12.5 Modul Pengiriman Pesan**

### **Tujuan**

Memungkinkan pengguna mengirim pesan teks kepada pengguna lain.

### **Fitur**

1. Input pesan teks  
2. Tombol kirim pesan  
3. Validasi agar pesan tidak kosong  
4. Penyimpanan pesan ke database

---

## **12.6 Modul Auto-Translation**

### **Tujuan**

Menerjemahkan pesan secara otomatis ke bahasa preferensi penerima.

### **Fitur**

1. Mengirim teks ke translation service  
2. Menentukan bahasa target berdasarkan preferensi penerima  
3. Menyimpan hasil terjemahan  
4. Menyimpan informasi bahasa sumber dan bahasa target  
5. Menandai status translation

### **Aturan umum**

1. Jika bahasa pengirim dan penerima sama, sistem boleh:  
   * tidak menerjemahkan, atau  
   * menyalin teks asli ke kolom translated\_text  
2. Jika translation gagal, pesan asli tetap harus tersimpan  
3. Sistem harus dapat menandai status translation, misalnya:  
   * pending  
   * done  
   * failed

---

## **12.7 Modul Riwayat Chat**

### **Tujuan**

Memungkinkan pengguna melihat kembali percakapan yang pernah dilakukan.

### **Fitur**

1. Menampilkan daftar pesan lama  
2. Menampilkan urutan kronologis  
3. Menampilkan isi pesan yang sesuai dengan sudut pandang pengguna  
4. Menampilkan indikator bila translation gagal atau belum selesai

---

## **12.8 Modul Tampilan Pesan Asli dan Terjemahan**

### **Tujuan**

Memberikan transparansi dan fleksibilitas terhadap hasil translation.

### **Fitur minimum yang disarankan**

1. Penerima melihat **hasil terjemahan**  
2. Sistem menyimpan **pesan asli**  
3. Tersedia mekanisme untuk melihat pesan asli (opsional untuk MVP, sangat disarankan untuk fase berikutnya)

### **Rekomendasi tampilan**

* Teks utama: hasil terjemahan  
* Keterangan kecil: “Translated from Indonesian” / “Translated from Thai”  
* Tombol/toggle: “Lihat pesan asli”

---

# **13\. User Stories**

## **13.1 Autentikasi**

1. Sebagai pengguna, saya ingin mendaftar akun agar dapat menggunakan aplikasi.  
2. Sebagai pengguna, saya ingin login agar dapat mengakses chat dan data saya.  
3. Sebagai pengguna, saya ingin logout agar akun saya aman saat selesai menggunakan aplikasi.

## **13.2 Profil**

4. Sebagai pengguna, saya ingin memilih bahasa preferensi agar sistem dapat menampilkan pesan dalam bahasa yang saya pahami.  
5. Sebagai pengguna, saya ingin memperbarui profil saya jika terjadi perubahan data.

## **13.3 Chat**

6. Sebagai pengguna, saya ingin melihat daftar pengguna agar dapat memulai percakapan dengan orang lain.  
7. Sebagai pengguna, saya ingin mengirim pesan teks ke pengguna lain agar dapat berkomunikasi.  
8. Sebagai pengguna, saya ingin menerima pesan yang sudah diterjemahkan agar saya tidak perlu menerjemahkan manual.  
9. Sebagai pengguna, saya ingin melihat riwayat chat agar dapat membaca kembali percakapan sebelumnya.

## **13.4 Translation**

10. Sebagai penerima, saya ingin pesan dari pengguna lain otomatis diterjemahkan ke bahasa saya agar isi pesan mudah dipahami.  
11. Sebagai sistem, saya harus tetap menyimpan teks asli agar data percakapan tetap akurat dan dapat direferensikan.  
12. Sebagai pengguna, saya ingin tahu jika translation gagal agar saya paham mengapa pesan tidak tampil seperti biasa.

---

# **14\. Functional Requirements**

## **14.1 Kebutuhan Fungsional Autentikasi**

**FR-01** Sistem harus menyediakan fitur registrasi pengguna.  
**FR-02** Sistem harus menyediakan fitur login pengguna.  
**FR-03** Sistem harus memverifikasi kredensial pengguna saat login.  
**FR-04** Sistem harus menyediakan mekanisme logout.

## **14.2 Kebutuhan Fungsional Profil**

**FR-05** Sistem harus menyimpan data profil pengguna.  
**FR-06** Sistem harus menyimpan bahasa preferensi pengguna.  
**FR-07** Pengguna harus dapat memperbarui bahasa preferensi melalui halaman profil.

## **14.3 Kebutuhan Fungsional Pengguna/Chat**

**FR-08** Sistem harus menampilkan daftar pengguna yang dapat diajak chat.  
**FR-09** Pengguna harus dapat membuka percakapan dengan pengguna lain.  
**FR-10** Pengguna harus dapat mengirim pesan teks ke pengguna lain.  
**FR-11** Sistem harus menyimpan pesan ke database.

## **14.4 Kebutuhan Fungsional Translation**

**FR-12** Saat pesan dikirim, sistem harus menentukan bahasa target berdasarkan bahasa preferensi penerima.  
**FR-13** Sistem harus mengirim teks ke translation service untuk diterjemahkan.  
**FR-14** Sistem harus menyimpan hasil terjemahan jika translation berhasil.  
**FR-15** Sistem harus menyimpan pesan asli meskipun translation gagal.  
**FR-16** Sistem harus menyimpan status translation pada setiap pesan.  
**FR-17** Sistem harus menyimpan bahasa sumber dan bahasa target pada data pesan.  
**FR-18** Sistem harus dapat menangani kondisi saat bahasa pengirim dan penerima sama.

## **14.5 Kebutuhan Fungsional Riwayat Chat**

**FR-19** Sistem harus menampilkan riwayat chat berdasarkan pasangan pengguna.  
**FR-20** Sistem harus menampilkan pesan secara kronologis.  
**FR-21** Sistem harus menampilkan isi pesan yang sesuai untuk user yang sedang melihat percakapan.

## **14.6 Kebutuhan Fungsional Error Handling**

**FR-22** Jika translation service gagal merespons, sistem harus tetap menyimpan pesan asli.  
**FR-23** Sistem harus memberi penanda bahwa translation gagal atau belum selesai.  
**FR-24** Sistem tidak boleh menghapus pesan hanya karena translation gagal.

---

# **15\. Non-Functional Requirements**

## **15.1 Usability**

1. Antarmuka harus sederhana dan mudah dipahami.  
2. Pengguna harus dapat mengirim pesan tanpa langkah yang rumit.  
3. Perbedaan antara pesan asli dan hasil terjemahan harus jelas bila keduanya ditampilkan.

## **15.2 Performance**

1. Waktu respons pengiriman pesan harus tetap wajar.  
2. Jika translation dilakukan sinkron, waktu tunggu tidak boleh terlalu lama.  
3. Jika translation dilakukan asynchronous, sistem harus menandai status pesan secara jelas.

## **15.3 Reliability**

1. Pesan asli tidak boleh hilang saat translation gagal.  
2. Sistem harus tetap dapat menampilkan riwayat chat meskipun beberapa translation gagal.

## **15.4 Security**

1. Password harus disimpan dalam bentuk hash.  
2. API harus dilindungi dengan autentikasi yang sesuai.  
3. Pengguna hanya boleh mengakses percakapan miliknya sendiri.

## **15.5 Maintainability**

1. Translation logic sebaiknya dipisahkan ke service layer.  
2. Struktur API harus modular dan konsisten.  
3. Sistem harus memungkinkan pergantian provider translation di masa depan.

## **15.6 Scalability**

1. Arsitektur backend harus memungkinkan penggunaan queue/job untuk translation.  
2. Desain database harus tetap dapat dikembangkan untuk fitur lanjutan seperti multi-translation atau group chat.

---

# **16\. Alur Bisnis Sistem (High-Level Flow)**

## **16.1 Alur Registrasi dan Pengaturan Bahasa**

1. Pengguna membuka aplikasi.  
2. Pengguna melakukan registrasi.  
3. Pengguna mengisi data akun.  
4. Pengguna memilih bahasa preferensi.  
5. Sistem menyimpan akun dan preferensi bahasa.

## **16.2 Alur Memulai Percakapan**

1. Pengguna login ke aplikasi.  
2. Pengguna membuka daftar user.  
3. Pengguna memilih salah satu user.  
4. Sistem membuka halaman percakapan 1-to-1.

## **16.3 Alur Mengirim Pesan**

1. Pengguna mengetik pesan.  
2. Pengguna menekan tombol kirim.  
3. Sistem menerima pesan asli.  
4. Sistem menentukan bahasa target dari penerima.  
5. Sistem mengirim teks ke translation service.  
6. Sistem menerima hasil terjemahan.  
7. Sistem menyimpan:  
   * pesan asli,  
   * bahasa sumber,  
   * pesan terjemahan,  
   * bahasa target,  
   * status translation.  
8. Sistem mengembalikan data pesan ke frontend.  
9. Frontend menampilkan pesan pada percakapan.

## **16.4 Alur Translation Gagal**

1. Pengguna mengirim pesan.  
2. Sistem mencoba translation.  
3. Translation service gagal merespons / gagal memproses.  
4. Sistem tetap menyimpan pesan asli.  
5. Status translation di-set sebagai failed.  
6. Frontend menampilkan indikator bahwa translation gagal.

---

# **17\. Business Rules / Aturan Sistem**

1. Setiap user wajib memiliki satu bahasa preferensi aktif.  
2. Setiap pesan harus memiliki pengirim dan penerima yang valid.  
3. Setiap pesan harus menyimpan teks asli.  
4. Hasil translation bersifat turunan dari pesan asli, bukan pengganti pesan asli.  
5. Jika translation berhasil, sistem menyimpan translated\_text.  
6. Jika translation gagal, original\_text tetap tersimpan.  
7. User tidak boleh mengakses percakapan milik user lain.  
8. Bahasa target translation harus mengacu pada preferensi bahasa penerima.  
9. Negara asal tidak boleh menjadi satu-satunya acuan translation; bahasa preferensi tetap menjadi sumber utama.  
10. Translation status harus terdokumentasi untuk setiap pesan yang diproses.

---

# **18\. Data Requirements**

## **18.1 Data Pengguna**

Data minimal pengguna:

* id  
* name  
* email  
* password  
* preferred\_language  
* country (opsional)  
* created\_at  
* updated\_at

## **18.2 Data Pesan**

Data minimal pesan:

* id  
* sender\_id  
* receiver\_id  
* original\_text  
* original\_language  
* translated\_text  
* translated\_language  
* translation\_status  
* created\_at  
* updated\_at

---

# **19\. Acceptance Criteria**

## **19.1 Registrasi**

* Pengguna dapat membuat akun baru dengan data valid.  
* Sistem menolak email yang sudah terdaftar.  
* Bahasa preferensi dapat disimpan saat registrasi atau setelah login pertama.

## **19.2 Login**

* Pengguna dapat login dengan kredensial valid.  
* Pengguna gagal login jika kredensial salah.

## **19.3 Pengiriman Pesan**

* Pengguna dapat mengirim pesan teks ke pengguna lain.  
* Pesan yang dikirim tersimpan di database.  
* Penerima dapat melihat pesan pada riwayat percakapan.

## **19.4 Translation**

* Saat bahasa pengirim dan penerima berbeda, sistem memproses translation.  
* Jika translation berhasil, translated\_text terisi.  
* Jika translation gagal, original\_text tetap tersimpan dan translation\_status menjadi failed.

## **19.5 Riwayat Chat**

* Pengguna dapat membuka percakapan dan melihat daftar pesan lama.  
* Pesan ditampilkan berdasarkan urutan waktu.

---

# **20\. Desain Pengalaman Pengguna (UX) – Gambaran Halaman**

## **20.1 Halaman Login/Register**

Komponen:

* form login/register  
* input nama/email/password  
* pilihan bahasa preferensi

## **20.2 Halaman Daftar Percakapan / Daftar User**

Komponen:

* sidebar daftar percakapan atau daftar user  
* kolom pencarian user  
* preview nama user

## **20.3 Halaman Chat**

Komponen:

* header info lawan bicara  
* area daftar pesan  
* bubble pesan kiri/kanan  
* input pesan  
* tombol kirim  
* indikator translation bila diperlukan

## **20.4 Halaman Profil**

Komponen:

* data profil user  
* pilihan bahasa preferensi  
* tombol simpan perubahan

---

# **21\. Rekomendasi Arsitektur Teknis**

## **21.1 Backend**

* Framework: Laravel  
* Tipe: REST API  
* Auth: Sanctum / token-based auth  
* Translation integration: LibreTranslate melalui service layer  
* Opsional fase lanjutan: Queue/Job untuk translation asynchronous

## **21.2 Frontend**

* SPA frontend menggunakan React atau Vue  
* Komunikasi ke backend via HTTP API  
* State management menyesuaikan framework yang dipilih

## **21.3 Translation Layer**

Disarankan membuat service khusus, misalnya:

* LibreTranslateService  
* TranslationManager (jika nanti ingin mendukung banyak provider)

---

# **22\. Definisi Selesai (Definition of Done)**

Sistem dianggap memenuhi target MVP apabila:

1. Pengguna dapat registrasi dan login.  
2. Pengguna dapat menyimpan bahasa preferensi.  
3. Pengguna dapat memilih pengguna lain untuk diajak chat.  
4. Pengguna dapat mengirim pesan teks.  
5. Sistem otomatis menerjemahkan pesan ke bahasa penerima.  
6. Pesan asli dan hasil terjemahan tersimpan di database.  
7. Riwayat chat dapat ditampilkan di frontend.  
8. Translation yang gagal tidak menyebabkan pesan hilang.

---

# **23\. Kesimpulan**

LinguaChat merupakan aplikasi chat lintas bahasa yang berfokus pada penyederhanaan komunikasi antar pengguna dari negara atau bahasa yang berbeda. Fitur inti sistem terletak pada kemampuan menerjemahkan pesan secara otomatis ke bahasa preferensi penerima, sambil tetap menyimpan pesan asli agar data percakapan tetap transparan dan dapat ditelusuri.

Pada versi awal, ruang lingkup terbaik adalah membangun **chat 1-to-1 berbasis teks dengan auto-translation**, tanpa membebani sistem dengan fitur-fitur chat kompleks lainnya. Dengan pendekatan ini, produk tetap memiliki nilai yang kuat, implementasinya lebih realistis, dan fondasinya cukup baik untuk dikembangkan ke fitur lanjutan pada tahap berikutnya.

