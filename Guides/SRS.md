# **SOFTWARE REQUIREMENTS SPECIFICATION (SRS)**

## **Sistem Aplikasi Chat Internasional dengan Auto-Translation**

**Nama Sistem:** LinguaChat  
**Versi Dokumen:** 1.0  
**Tanggal:** 3 Juli 2026

---

# **1\. Pendahuluan**

## **1.1 Tujuan Dokumen**

Dokumen Software Requirements Specification (SRS) ini disusun untuk mendefinisikan kebutuhan perangkat lunak dari sistem **LinguaChat**, yaitu aplikasi chat internasional berbasis teks yang mendukung penerjemahan pesan otomatis (auto-translation) antar pengguna dengan bahasa berbeda.

Dokumen ini menjadi acuan teknis bagi proses analisis, perancangan, implementasi, pengujian, dan pengembangan sistem. Isi dokumen mencakup kebutuhan fungsional, kebutuhan non-fungsional, kebutuhan antarmuka, aturan bisnis, struktur data, use case, dan batasan sistem.

## **1.2 Ruang Lingkup Sistem**

LinguaChat adalah sistem aplikasi chat 1-to-1 yang memungkinkan dua pengguna dari bahasa berbeda untuk berkomunikasi tanpa perlu menerjemahkan pesan secara manual. Sistem akan menyimpan pesan asli yang dikirim oleh pengirim, menerjemahkan pesan ke bahasa preferensi penerima melalui layanan translation, lalu menampilkan hasil terjemahan pada percakapan.

Versi awal sistem difokuskan pada:

1. autentikasi pengguna,  
2. pengelolaan profil dan bahasa preferensi,  
3. daftar pengguna,  
4. percakapan privat 1-to-1,  
5. pengiriman pesan teks,  
6. auto-translation pesan,  
7. riwayat chat,  
8. penyimpanan pesan asli dan hasil terjemahan.

## **1.3 Definisi, Akronim, dan Singkatan**

Berikut beberapa istilah yang digunakan pada dokumen ini:

* **SRS (Software Requirements Specification)**: dokumen yang menjelaskan kebutuhan perangkat lunak secara rinci.  
* **PRD (Product Requirements Document)**: dokumen kebutuhan produk dari sudut pandang bisnis dan produk.  
* **MVP (Minimum Viable Product)**: versi minimum dari sistem yang sudah memiliki fungsi inti dan dapat digunakan.  
* **Auto-translation**: proses penerjemahan pesan secara otomatis oleh sistem.  
* **Preferred Language**: bahasa utama yang dipilih pengguna untuk menerima tampilan hasil terjemahan.  
* **Sender**: pengguna yang mengirim pesan.  
* **Receiver**: pengguna yang menerima pesan.  
* **Translation Provider**: layanan pihak ketiga yang digunakan untuk menerjemahkan pesan, pada sistem ini menggunakan **LibreTranslate**.  
* **API (Application Programming Interface)**: antarmuka komunikasi antara frontend dan backend.  
* **SPA (Single Page Application)**: arsitektur frontend berbasis satu halaman dinamis.

## **1.4 Referensi**

Dokumen ini disusun berdasarkan:

1. PRD LinguaChat versi 1.0  
2. Kebutuhan sistem hasil analisis fitur  
3. Rencana implementasi menggunakan Laravel REST API, React/Vue SPA, dan LibreTranslate

## **1.5 Gambaran Umum Dokumen**

Dokumen ini dibagi menjadi beberapa bagian utama:

1. Deskripsi umum sistem  
2. Kebutuhan antarmuka eksternal  
3. Kebutuhan fungsional sistem  
4. Kebutuhan non-fungsional  
5. Aturan bisnis  
6. Use case dan skenario  
7. Model data konseptual  
8. Kriteria penerimaan sistem

---

# **2\. Deskripsi Umum Sistem**

## **2.1 Perspektif Produk**

LinguaChat merupakan aplikasi mandiri yang dibangun menggunakan arsitektur **client-server**. Sistem terdiri dari:

1. **Frontend**: aplikasi SPA yang digunakan user untuk login, memilih pengguna lain, melihat percakapan, dan mengirim pesan.  
2. **Backend**: REST API yang menangani autentikasi, pengelolaan data user, pengelolaan percakapan, pengiriman pesan, pemanggilan translation provider, dan penyimpanan data ke database.  
3. **Database**: menyimpan data user, pesan, preferensi bahasa, dan data pendukung lainnya.  
4. **Translation Provider**: layanan eksternal (LibreTranslate) yang digunakan untuk menerjemahkan pesan.

## **2.2 Tujuan Sistem**

Sistem bertujuan untuk mempermudah komunikasi lintas bahasa antar pengguna dengan cara menerjemahkan pesan secara otomatis ke bahasa penerima, sambil tetap menyimpan pesan asli agar informasi tetap transparan dan dapat ditelusuri.

## **2.3 Karakteristik Pengguna**

Pengguna sistem adalah individu yang:

1. ingin berkomunikasi dengan pengguna dari negara lain,  
2. tidak ingin menerjemahkan pesan secara manual,  
3. memiliki bahasa utama yang berbeda-beda,  
4. membutuhkan antarmuka chat yang sederhana dan mudah dipahami.

## **2.4 Batasan Sistem**

Batasan pada versi awal sistem:

1. Sistem hanya mendukung **chat 1-to-1**.  
2. Sistem hanya mendukung **pesan teks**.  
3. Translation provider awal adalah **LibreTranslate**.  
4. Sistem belum mendukung voice note, file sharing, group chat, maupun panggilan suara/video.  
5. Sistem belum mengimplementasikan end-to-end encryption.  
6. Sistem belum menyediakan multi-provider translation pada MVP.

## **2.5 Asumsi dan Dependensi**

### **Asumsi**

1. Setiap pengguna memiliki satu bahasa preferensi aktif.  
2. Pengguna sudah terdaftar dan login (bisa melalui akun google) sebelum dapat mengirim pesan.  
3. Translation provider dapat diakses oleh backend melalui HTTP request.  
4. Pesan yang diterjemahkan merupakan pesan teks biasa.

### **Dependensi**

1. Backend bergantung pada konektivitas ke translation provider.  
2. Frontend bergantung pada ketersediaan REST API backend.  
3. Proses translation bergantung pada validitas bahasa sumber dan target yang digunakan.

---

# **3\. Kebutuhan Antarmuka Eksternal**

# **3.1 Antarmuka Pengguna (User Interface)**

Sistem harus menyediakan antarmuka minimal berikut:

## **3.1.1 Halaman Registrasi**

Komponen minimum:

1. Input nama  
2. Input email  
3. Input password  
4. Input konfirmasi password (opsional namun disarankan)  
5. Pilihan bahasa preferensi  
6. Tombol daftar

## **3.1.2 Halaman Login**

Komponen minimum:

1. Input email  
2. Input password  
3. Tombol login

## **3.1.3 Halaman Profil**

Komponen minimum:

1. Informasi nama pengguna  
2. Informasi email  
3. Pilihan bahasa preferensi  
4. Tombol simpan perubahan

## **3.1.4 Halaman Daftar Pengguna / Kontak**

Komponen minimum:

1. Daftar pengguna  
2. Kolom pencarian pengguna  
3. Tombol/aksi untuk membuka percakapan

## **3.1.5 Halaman Percakapan**

Komponen minimum:

1. Informasi lawan bicara  
2. Daftar pesan  
3. Penanda pesan milik pengirim dan penerima  
4. Input teks pesan  
5. Tombol kirim  
6. Penanda status translation jika diperlukan

## **3.1.6 Tampilan Pesan**

Untuk setiap pesan, sistem minimal harus dapat menampilkan:

1. isi pesan yang relevan untuk user yang sedang melihat,  
2. waktu pengiriman,  
3. indikator jika translation gagal atau masih pending.

---

## **3.2 Antarmuka Perangkat Lunak (Software Interface)**

### **3.2.1 Antarmuka Frontend ke Backend**

Frontend harus berkomunikasi dengan backend menggunakan HTTP/HTTPS melalui REST API berbasis JSON.

### **3.2.2 Antarmuka Backend ke Database**

Backend harus dapat melakukan operasi:

1. create,  
2. read,  
3. update,  
4. query data  
   terhadap tabel yang digunakan sistem, terutama tabel user dan message.

### **3.2.3 Antarmuka Backend ke Translation Provider**

Backend harus mengirim request translation ke LibreTranslate menggunakan HTTP POST dengan data minimal:

* text / q  
* source language  
* target language  
* format (jika diperlukan)

Response translation minimal harus dapat menghasilkan:

* translated text  
* informasi bahasa terdeteksi (jika tersedia)

---

## **3.3 Antarmuka Komunikasi**

1. Komunikasi frontend-backend menggunakan protokol HTTP/HTTPS.  
2. Komunikasi backend-translation provider menggunakan HTTP/HTTPS.  
3. Format pertukaran data utama adalah JSON.

---

# **4\. Fitur Sistem dan Kebutuhan Fungsional**

# **4.1 Modul Autentikasi**

## **4.1.1 Deskripsi**

Modul autentikasi digunakan untuk mengelola proses registrasi, login, identifikasi user aktif, dan logout.

## **4.1.2 Kebutuhan Fungsional**

**FR-AUTH-01** Sistem harus memungkinkan pengguna melakukan registrasi akun baru.  
**FR-AUTH-02** Sistem harus memvalidasi bahwa email yang digunakan saat registrasi belum terdaftar.  
**FR-AUTH-03** Sistem harus menyimpan password dalam bentuk hash.  
**FR-AUTH-04** Sistem harus memungkinkan pengguna login menggunakan kredensial yang valid.  
**FR-AUTH-05** Sistem harus menolak login jika email atau password salah.  
**FR-AUTH-06** Sistem harus menyediakan mekanisme logout untuk mengakhiri sesi/token user.  
**FR-AUTH-07** Sistem harus dapat mengidentifikasi user yang sedang login untuk setiap request terproteksi.

## **4.1.3 Input**

* nama  
* email  
* password  
* preferred\_language

## **4.1.4 Output**

* status registrasi berhasil/gagal  
* status login berhasil/gagal  
* token/session user  
* data user yang sedang login

---

# **4.2 Modul Manajemen Profil Pengguna**

## **4.2.1 Deskripsi**

Modul ini mengelola data profil pengguna dan bahasa preferensi yang digunakan sistem untuk proses translation.

## **4.2.2 Kebutuhan Fungsional**

**FR-PROF-01** Sistem harus menyimpan data profil pengguna.  
**FR-PROF-02** Sistem harus menyimpan preferred\_language untuk setiap pengguna.  
**FR-PROF-03** Pengguna harus dapat melihat profilnya sendiri.  
**FR-PROF-04** Pengguna harus dapat memperbarui nama profilnya.  
**FR-PROF-05** Pengguna harus dapat memperbarui preferred\_language.  
**FR-PROF-06** Sistem boleh menyimpan country sebagai data tambahan, namun translation tetap harus mengacu pada preferred\_language.

## **4.2.3 Input**

* nama  
* preferred\_language  
* country (opsional)

## **4.2.4 Output**

* data profil user  
* status update profil

---

# **4.3 Modul Daftar Pengguna**

## **4.3.1 Deskripsi**

Modul ini memungkinkan user melihat daftar pengguna lain dan memilih lawan bicara untuk memulai percakapan.

## **4.3.2 Kebutuhan Fungsional**

**FR-USER-01** Sistem harus menampilkan daftar pengguna yang tersedia untuk diajak chat.  
**FR-USER-02** Sistem harus menyediakan fitur pencarian pengguna berdasarkan nama.  
**FR-USER-03** Sistem tidak boleh menampilkan user yang sedang login sebagai lawan chat pada daftar pencarian utama, kecuali dibutuhkan untuk keperluan tertentu.

## **4.3.3 Input**

* keyword pencarian (opsional)

## **4.3.4 Output**

* daftar pengguna  
* hasil pencarian pengguna

---

# **4.4 Modul Percakapan dan Riwayat Chat**

## **4.4.1 Deskripsi**

Modul ini mengelola tampilan percakapan antara dua pengguna dan pengambilan riwayat pesan.

## **4.4.2 Kebutuhan Fungsional**

**FR-CONV-01** Sistem harus memungkinkan pengguna membuka percakapan dengan pengguna lain.  
**FR-CONV-02** Sistem harus menampilkan riwayat pesan antara dua pengguna yang terlibat dalam percakapan.  
**FR-CONV-03** Riwayat pesan harus ditampilkan berdasarkan urutan waktu secara kronologis.  
**FR-CONV-04** Sistem harus memastikan bahwa pengguna hanya dapat melihat percakapan yang melibatkan dirinya.  
**FR-CONV-05** Sistem harus dapat menampilkan daftar percakapan user, jika modul daftar percakapan diterapkan.

## **4.4.3 Input**

* user target / receiver\_id  
* parameter pagination (opsional)  
* parameter pencarian riwayat (opsional, jika diterapkan di masa depan)

## **4.4.4 Output**

* daftar pesan dalam percakapan  
* informasi lawan bicara  
* informasi waktu pengiriman pesan

---

# **4.5 Modul Pengiriman Pesan**

## **4.5.1 Deskripsi**

Modul ini bertanggung jawab menerima pesan teks dari pengirim, memprosesnya, dan menyimpannya ke sistem.

## **4.5.2 Kebutuhan Fungsional**

**FR-MSG-01** Pengguna harus dapat mengirim pesan teks kepada pengguna lain.  
**FR-MSG-02** Sistem harus memvalidasi bahwa pesan tidak kosong.  
**FR-MSG-03** Sistem harus memvalidasi bahwa receiver\_id mengacu pada pengguna yang valid.  
**FR-MSG-04** Sistem harus menyimpan original\_text dari setiap pesan yang dikirim.  
**FR-MSG-05** Sistem harus menyimpan sender\_id dan receiver\_id pada setiap pesan.  
**FR-MSG-06** Sistem harus menyimpan waktu pembuatan pesan.

## **4.5.3 Input**

* receiver\_id  
* message / original\_text

## **4.5.4 Output**

* data pesan yang berhasil dibuat  
* status gagal jika validasi tidak terpenuhi

---

# **4.6 Modul Auto-Translation**

## **4.6.1 Deskripsi**

Modul ini menangani proses penerjemahan pesan ke bahasa preferensi penerima.

## **4.6.2 Kebutuhan Fungsional**

**FR-TR-01** Saat sebuah pesan dikirim, sistem harus menentukan bahasa target berdasarkan preferred\_language penerima.  
**FR-TR-02** Sistem harus mengirim original\_text ke translation provider saat translation diperlukan.  
**FR-TR-03** Sistem harus menyimpan translated\_text jika translation berhasil.  
**FR-TR-04** Sistem harus menyimpan translated\_language pada data pesan.  
**FR-TR-05** Sistem harus menyimpan original\_language pada data pesan.  
**FR-TR-06** Sistem harus menyimpan translation\_status pada setiap pesan.  
**FR-TR-07** Jika bahasa pengirim dan bahasa penerima sama, sistem dapat:

1. tidak melakukan translation, atau  
2. mengisi translated\_text dengan original\_text.  
   **FR-TR-08** Jika translation provider gagal merespons, sistem tetap harus menyimpan original\_text.  
   **FR-TR-09** Jika translation gagal, sistem harus mengubah translation\_status menjadi failed atau status sejenis yang setara.  
   **FR-TR-10** Jika translation berhasil, sistem harus mengubah translation\_status menjadi done.  
   **FR-TR-11** Jika translation diproses asynchronous, sistem harus dapat menyimpan status pending.  
   **FR-TR-12** Sistem harus memungkinkan pemisahan translation logic ke service layer agar mudah dirawat dan dikembangkan.

## **4.6.3 Aturan Translation**

1. Bahasa target diambil dari preferred\_language penerima.  
2. Bahasa sumber dapat:  
   * menggunakan preferred\_language pengirim, atau  
   * menggunakan deteksi otomatis (auto) jika implementasi mendukung.  
3. Jika translation provider mengembalikan hasil deteksi bahasa, sistem dapat menyimpannya sebagai original\_language.  
4. Pesan asli tidak boleh ditimpa oleh hasil translation.

## **4.6.4 Input**

* original\_text  
* source language  
* target language

## **4.6.5 Output**

* translated\_text  
* original\_language  
* translated\_language  
* translation\_status

---

# **4.7 Modul Penanganan Kegagalan Translation**

## **4.7.1 Deskripsi**

Modul ini memastikan sistem tetap konsisten saat translation provider gagal, timeout, atau mengembalikan respons tidak valid.

## **4.7.2 Kebutuhan Fungsional**

**FR-ERR-01** Sistem harus tetap menyimpan original\_text jika translation gagal.  
**FR-ERR-02** Sistem harus menandai status translation sebagai gagal.  
**FR-ERR-03** Sistem tidak boleh menghapus data pesan akibat kegagalan translation.  
**FR-ERR-04** Sistem harus mengembalikan respons yang tetap valid ke frontend meskipun translation gagal.  
**FR-ERR-05** Sistem sebaiknya mencatat kegagalan translation ke log backend untuk keperluan debugging.

---

# **5\. Business Rules / Aturan Bisnis Sistem**

1. Setiap pengguna wajib memiliki satu preferred\_language aktif.  
2. Translation pesan harus mengacu pada preferred\_language penerima.  
3. original\_text adalah sumber utama isi pesan dan wajib disimpan.  
4. translated\_text merupakan hasil turunan dari original\_text.  
5. Pengguna hanya boleh mengakses data percakapan yang melibatkan dirinya.  
6. Pesan tidak boleh hilang hanya karena translation gagal.  
7. Jika translation berhasil, translated\_text harus disimpan bersama metadata bahasa.  
8. Jika translation tidak berhasil, translation\_status harus menandai kegagalan.  
9. Sistem tidak boleh menjadikan country sebagai satu-satunya acuan penentuan bahasa translation.  
10. Untuk versi awal, satu pesan hanya menyimpan satu hasil translation utama sesuai bahasa penerima saat pesan dikirim.

---

# **6\. Use Case Specification**

# **6.1 Daftar Use Case**

1. Registrasi akun  
2. Login  
3. Logout  
4. Mencari Pengguna  
5. Tambah Teman  
6. Melihat profil  
7. Mengubah bahasa preferensi  
8. Melihat daftar pengguna  
9. Mencari pengguna  
10. Membuka percakapan  
11. Mengirim pesan  
12. Melihat riwayat chat

---

## 

## 

## 

## 

## **6.2 Use Case UC-01 – Registrasi Akun**

### **Aktor**

User

### **Tujuan**

Membuat akun baru agar dapat menggunakan sistem.

### **Prasyarat**

User belum memiliki akun terdaftar.

### **Alur Utama**

1. User membuka halaman registrasi.  
2. User mengisi nama, email, password, dan preferred\_language.  
3. User menekan tombol daftar.  
4. Sistem memvalidasi data.  
5. Sistem menyimpan akun baru.  
6. Sistem memberikan respons registrasi berhasil.

### **Alur Alternatif**

* Jika email sudah terdaftar, sistem menolak registrasi dan menampilkan pesan kesalahan.  
* Jika data tidak valid, sistem menampilkan pesan validasi.

### **Pasca Kondisi**

Akun user tersimpan di database.

---

## 

## 

## 

## **6.3 Use Case UC-02 – Login**

### **Aktor**

User

### **Tujuan**

Masuk ke dalam sistem.

### **Prasyarat**

User telah memiliki akun.

### **Alur Utama**

1. User membuka halaman login.  
2. User mengisi email dan password.  
3. User menekan tombol login.  
4. Sistem memverifikasi kredensial.  
5. Sistem membuat token/session login.  
6. Sistem mengarahkan user ke halaman utama.

### **Alur Alternatif**

* Jika kredensial salah, sistem menolak login dan menampilkan pesan kesalahan.

### **Pasca Kondisi**

User berada dalam keadaan terautentikasi.

---

## 

## 

## 

## 

## **6.4 Use Case UC-03 – Mengubah Bahasa Preferensi**

### **Aktor**

User

### **Tujuan**

Mengubah bahasa utama yang digunakan sistem untuk menampilkan hasil terjemahan.

### **Prasyarat**

User telah login.

### **Alur Utama**

1. User membuka halaman profil.  
2. User memilih bahasa preferensi baru.  
3. User menyimpan perubahan.  
4. Sistem memvalidasi input.  
5. Sistem memperbarui preferred\_language user.  
   

### **Pasca Kondisi**

preferred\_language user diperbarui.

---

## 

## 

## 

## 

## 

## **6.5 Use Case UC-04 – Melihat Daftar Pengguna**

### **Aktor**

User

### **Tujuan**

Melihat pengguna lain yang dapat diajak chat.

### **Prasyarat**

User telah login.

### **Alur Utama**

1. User membuka halaman daftar pengguna.  
2. Sistem menampilkan daftar pengguna lain.  
3. User dapat memilih salah satu pengguna untuk memulai percakapan.

---

## **6.6 Use Case UC-05 – Mencari Pengguna**

### **Aktor**

User

### **Tujuan**

Mencari pengguna lain berdasarkan nama.

### **Prasyarat**

User telah login.

### **Alur Utama**

1. User mengetik kata kunci pencarian.  
2. Sistem melakukan pencarian user berdasarkan nama.  
3. Sistem menampilkan hasil pencarian yang sesuai.

---

## **6.7 Use Case UC-06 – Membuka Percakapan**

### **Aktor**

User

### **Tujuan**

Melihat percakapan dengan pengguna tertentu.

### **Prasyarat**

1. User telah login.  
2. User memilih pengguna target.

### **Alur Utama**

1. User memilih pengguna dari daftar.  
2. Sistem mengambil riwayat pesan antara user login dan pengguna target.  
3. Sistem menampilkan halaman percakapan.

### **Alur Alternatif**

* Jika belum ada riwayat chat, sistem tetap membuka halaman percakapan dalam kondisi kosong.

---

## 

## 

## 

## 

## 

## 

## 

## **6.8 Use Case UC-07 – Mengirim Pesan**

### **Aktor**

User

### **Tujuan**

Mengirim pesan kepada pengguna lain.

### **Prasyarat**

1. User telah login.  
2. User sedang membuka percakapan dengan pengguna target.

### **Alur Utama**

1. User mengetik pesan.  
2. User menekan tombol kirim.  
3. Sistem memvalidasi pesan.  
4. Sistem menyimpan original\_text.  
5. Sistem menentukan target language dari receiver.  
6. Sistem memproses translation.  
7. Sistem menyimpan hasil translation dan status translation.  
8. Sistem mengembalikan data pesan ke frontend.  
9. Frontend menampilkan pesan pada percakapan.

### **Alur Alternatif**

* Jika pesan kosong, sistem menolak pengiriman.  
* Jika receiver tidak valid, sistem menolak pengiriman.  
* Jika translation gagal, sistem tetap menyimpan original\_text dan menandai translation\_status sebagai failed.

### **Pasca Kondisi**

Pesan tersimpan di database.

---

## 

## **6.9 Use Case UC-08 – Melihat Riwayat Chat**

### **Aktor**

User

### **Tujuan**

Melihat pesan-pesan yang pernah dikirim dan diterima pada percakapan tertentu.

### **Prasyarat**

1. User telah login.  
2. User memilih salah satu percakapan.

### **Alur Utama**

1. User membuka percakapan.  
2. Sistem mengambil data pesan berdasarkan sender-receiver yang relevan.  
3. Sistem menampilkan daftar pesan secara kronologis.

---

# **7\. Kebutuhan Non-Fungsional**

# **7.1 Performance**

**NFR-PERF-01** Sistem harus memberikan respons pengiriman pesan dalam waktu yang wajar untuk penggunaan normal.  
**NFR-PERF-02** Jika translation dilakukan sinkron, sistem harus meminimalkan waktu tunggu pengguna.  
**NFR-PERF-03** Sistem harus mendukung pengembangan ke translation asynchronous menggunakan queue/job di masa depan.

# **7.2 Reliability**

**NFR-REL-01** Pesan asli tidak boleh hilang saat translation gagal.  
**NFR-REL-02** Sistem harus tetap dapat menampilkan riwayat chat meskipun beberapa pesan gagal diterjemahkan.  
**NFR-REL-03** Sistem harus menjaga konsistensi data sender, receiver, dan isi pesan.

# **7.3 Security**

**NFR-SEC-01** Password harus disimpan dalam bentuk hash.  
**NFR-SEC-02** Endpoint yang memerlukan login harus dilindungi autentikasi.  
**NFR-SEC-03** Pengguna hanya boleh mengakses resource miliknya sendiri atau percakapan yang melibatkan dirinya.  
**NFR-SEC-04** Sistem harus memvalidasi input untuk mencegah data tidak sah masuk ke sistem.

# **7.4 Maintainability**

**NFR-MAIN-01** Logic translation harus dipisahkan dari controller utama sejauh mungkin.  
**NFR-MAIN-02** Struktur kode backend harus modular agar mudah diuji dan dirawat.  
**NFR-MAIN-03** Sistem harus memungkinkan penggantian translation provider dengan perubahan minimal pada lapisan aplikasi lain.

# **7.5 Scalability**

**NFR-SCAL-01** Struktur data harus memungkinkan penambahan fitur di masa depan tanpa perombakan total.  
**NFR-SCAL-02** Sistem harus memungkinkan penambahan queue translation, notifikasi, atau realtime chat pada fase berikutnya.

# **7.6 Usability**

**NFR-USE-01** Antarmuka harus mudah dipahami oleh pengguna umum.  
**NFR-USE-02** Pengguna harus dapat mengirim pesan dengan langkah yang sederhana.  
**NFR-USE-03** Informasi hasil translation harus cukup jelas bagi penerima.

---

# **8\. Kriteria Penerimaan Sistem**

## **8.1 Kriteria Penerimaan Modul Autentikasi**

1. User dapat registrasi dengan data valid.  
2. Sistem menolak registrasi jika email sudah terdaftar.  
3. User dapat login dengan kredensial valid.  
4. Sistem menolak login jika password salah.

## **8.2 Kriteria Penerimaan Modul Profil**

1. User dapat melihat data profilnya.  
2. User dapat memperbarui preferred\_language.  
3. Perubahan preferred\_language tersimpan di database.

## **8.3 Kriteria Penerimaan Modul Chat**

1. User dapat membuka percakapan dengan user lain.  
2. User dapat mengirim pesan.  
3. Riwayat chat dapat ditampilkan secara kronologis.

## **8.4 Kriteria Penerimaan Modul Translation**

1. Saat pesan dikirim ke user dengan bahasa berbeda, sistem memproses translation.  
2. translated\_text tersimpan jika translation berhasil.  
3. original\_text tetap tersimpan jika translation gagal.  
4. translation\_status sesuai dengan hasil proses translation.

---

# **9\. Batasan Pengembangan dan Catatan Implementasi**

1. Dokumen ini mendeskripsikan kebutuhan sistem untuk **versi awal / MVP**.  
2. Realtime chat tidak diwajibkan pada tahap awal, tetapi arsitektur sistem sebaiknya tidak menutup kemungkinan penambahan realtime di masa depan.  
3. Sistem sebaiknya dirancang agar translation provider dapat diganti di masa depan tanpa mengubah struktur besar aplikasi.  
4. Penggunaan queue/job untuk translation sangat disarankan untuk fase pengembangan lanjutan.  
5. Jika implementasi awal dilakukan secara sinkron, sistem harus tetap memiliki mekanisme penanganan kegagalan translation yang jelas.

---

# **10\. Kesimpulan**

Dokumen SRS ini mendefinisikan kebutuhan perangkat lunak untuk sistem LinguaChat, yaitu aplikasi chat 1-to-1 lintas bahasa dengan auto-translation. Fokus utama sistem adalah memungkinkan pengguna berkomunikasi dengan lebih mudah tanpa menerjemahkan pesan secara manual, sambil tetap menjaga transparansi data melalui penyimpanan pesan asli dan hasil terjemahan.

Secara teknis, sistem dibangun di atas komponen utama berupa autentikasi pengguna, pengelolaan profil dan bahasa preferensi, daftar pengguna, percakapan privat, pengiriman pesan, integrasi translation provider, serta penyimpanan riwayat chat. Dengan spesifikasi ini, proses desain sistem, implementasi backend/frontend, perancangan database, serta pengujian dapat dilakukan dengan dasar yang lebih jelas dan terstruktur.

