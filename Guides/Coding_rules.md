# **CODING RULES & GUIDELINES**

**Proyek:** LinguaChat

**Versi:** 1.0

**Stack Teknologi:** Laravel (Backend/REST API), React (Frontend SPA)

**Database : Mysql (gunakan settingan lokal terlebih dahulu utk pegembangan , dengan port 3306, username : root, password dikosongkan)**

## **1\. Tujuan & Ruang Lingkup**

* **Tujuan:** Memastikan seluruh kode yang ditulis oleh tim *developer* memiliki standar yang sama, mudah dibaca (*readable*), mudah dirawat (*maintainable*), dan meminimalisir *bug*.  
* **Ruang Lingkup:** Aturan ini berlaku untuk pengembangan Frontend (React), Backend (Laravel), perancangan Database, dan standarisasi API untuk proyek LinguaChat.

## **2\. General Coding Principles**

* **KISS (Keep It Simple, Stupid):** Tulis kode yang sederhana dan langsung pada tujuannya. Hindari over-engineering.  
* **DRY (Don't Repeat Yourself):** Jika ada blok kode yang digunakan lebih dari 2 kali, buatkan *helper*, *hook*, atau *service* terpisah.  
* **SRP (Single Responsibility Principle):** Satu fungsi/class/komponen hanya boleh memiliki satu tanggung jawab utama.  
* **Clean Code:** Prioritaskan kode yang mudah dibaca oleh manusia daripada kode yang singkat tapi membingungkan. Tinggalkan kode dalam keadaan lebih rapi dari sebelumnya (Boy Scout Rule).

## **3\. Naming Conventions**

Penamaan yang konsisten adalah kunci kolaborasi tim.

* **Variables & Functions:** camelCase (contoh: getUserData, isTranslationFailed, translatedText).  
* **Classes & Models (PHP):** PascalCase / StudlyCaps (contoh: UserController, Message, TranslationService).  
* **React Components:** PascalCase (contoh: ChatBubble, UserProfile, TranslationIndicator).  
* **Database Tables:** snake\_case dan *plural* (jamak) (contoh: users, messages).  
* **Database Columns:** snake\_case (contoh: preferred\_language, original\_text, translation\_status).  
* **API Endpoints:** kebab-case (contoh: /api/users, /api/chat-history).  
* **Constants:** UPPER\_SNAKE\_CASE (contoh: MAX\_UPLOAD\_SIZE, DEFAULT\_LANGUAGE).

## **4\. Project/Folder Structure**

Gunakan struktur standar dengan beberapa penyesuaian untuk kebersihan arsitektur.

**Backend (Laravel):**

* app/Http/Controllers/ : Hanya untuk menerima *request* dan mengembalikan *response*.  
* app/Http/Requests/ : Tempat menyimpan *Form Request* untuk validasi.  
* app/Http/Resources/ : Tempat memformat response API (API Resources).  
* app/Services/ : **(WAJIB)** Tempat meletakkan *business logic* dan *3rd party integration* (contoh: TranslationService.php, ChatService.php).  
* app/Models/ : Relasi database dan konfigurasi *table*.

**Frontend (React) (bisa sesuaikan sedikit dengan template yang tersedia):**

* src/components/ : Komponen UI yang *reusable* (tombol, input, chat bubble).  
* src/pages/ : Komponen level halaman (Login, ChatRoom, Profile).  
* src/services/ : File untuk melakukan pemanggilan API menggunakan Axios (contoh: authService.js, chatService.js).  
* src/hooks/ : Custom React Hooks.  
* src/utils/ : Fungsi *helper* murni (format tanggal, format string).  
* src/context/ atau src/store/ : *Global state management* (Context API / Zustand).

## **5\. Laravel Backend Rules**

1. **Skinny Controllers, Fat Services:** Controller tidak boleh berisi logika bisnis atau *query* kompleks. Panggil class di folder app/Services/ dari dalam controller.  
2. **Validasi:** Dilarang keras memvalidasi *request* langsung di dalam Controller. Gunakan **Form Request** (php artisan make:request).  
3. **Response:** Selalu gunakan **API Resources** (php artisan make:resource) untuk memanipulasi output JSON ke frontend. Jangan kembalikan object Model langsung ke *response*.  
4. **Dependency Injection:** Gunakan *dependency injection* pada *constructor* controller atau service, jangan meng-instansiasi class secara manual (contoh: $service \= new Service()).  
5. **Autentikasi:** Gunakan Laravel Sanctum sesuai spesifikasi PRD.

Tambahan : Jika ada mekanisme upload dan baca file/gambar , maka jangan masukkan ke storage/app/public, atau jangan menggunakan mekanisme symbolic link Laravel , seluruh file upload disimpan secara fisik langsung ke:  
public/storage/….

## **6\. React Frontend Rules**

1. **Functional Components:** Gunakan *Functional Components* dengan Hooks. Dilarang menggunakan *Class Components*.  
2. **Pisahkan Logic & UI:** Jika komponen memiliki state/logic yang kompleks, pisahkan menggunakan *Custom Hooks*.  
3. **API Calls:** Komponen tidak boleh melakukan *fetch/axios* langsung di dalam useEffect. Panggil fungsi dari folder src/services/.  
4. **Conditional Rendering:** Gunakan *Ternary operator* (? :) atau *Logical AND* (&&) dengan rapi. Ekstrak ke variabel jika kondisinya terlalu panjang.  
5. **Props:** Berikan nilai *default* pada props jika memungkinkan, dan pecah objek props (destructuring) langsung di parameter komponen ({ name, language }).

## **7\. API & Response Rules**

1. **HTTP Methods:** Gunakan method yang sesuai:  
   * GET (Mendapatkan data)  
   * POST (Membuat data baru)  
   * PUT/PATCH (Mengupdate data)  
   * DELETE (Menghapus data)  
2. **Standard Response Format:** Semua endpoint backend HARUS mengembalikan struktur JSON yang seragam:

{  
  "meta": {  
    "status": "success", // atau "error"  
    "message": "Pesan berhasil dikirim",  
    "code": 200  
  },  
  "data": { ... } // Berisi object atau array data, null jika error  
}

3. **HTTP Status Codes:**  
   * 200 OK (Berhasil)  
   * 201 Created (Berhasil membuat record baru)  
   * 400 Bad Request (Parameter salah/validasi gagal)  
   * 401 Unauthorized (Belum login/Token tidak valid)  
   * 403 Forbidden (Tidak punya akses ke percakapan user lain)  
   * 404 Not Found (Data tidak ditemukan)  
   * 500 Internal Server Error (Error server/Translation provider mati)  
     

## **8\. Database & Migration Rules**

1. **Migration bersifat Immutable:** JANGAN PERNAH mengubah file migrasi yang sudah di-*commit* dan berjalan. Jika ada perubahan struktur tabel, buat file migrasi baru (contoh: add\_translation\_status\_to\_messages\_table).  
2. **Foreign Keys:** Selalu definisikan constraint Foreign Key dengan aksi yang jelas (contoh: onDelete('cascade') atau onDelete('set null')).  
3. **Penamaan Kolom Ketat:** Ikuti PRD. Gunakan nama yang spesifik: original\_text, translated\_text, preferred\_language, translation\_status (enum: pending, done, failed).  
4. **Timestamps:** Selalu gunakan created\_at dan updated\_at.

## **9\. Validation, Error Handling, Logging**

1. **Double Validation:** Validasi wajib dilakukan di dua sisi. Frontend (untuk UX yang cepat) dan Backend (untuk keamanan data mutlak).  
2. **Error Handling Frontend:** Selalu bungkus proses API dalam blok try...catch. Tampilkan pesan error yang ramah (User Friendly) melalui Toast/Alert, jangan tampilkan raw error backend ke user.  
3. **Aturan Khusus Translation (Sesuai SRS):** Jika API LibreTranslate gagal/timeout, backend **TIDAK BOLEH** me-lempar exception yang membatalkan penyimpanan pesan. Pesan original\_text wajib tetap disimpan ke DB dengan translation\_status \= failed.  
4. **Logging:** Gunakan Log::error() di Laravel untuk mencatat semua kegagalan dari layanan pihak ketiga (LibreTranslate) beserta payload-nya untuk keperluan debugging.

## **10\. Documentation Rules**

1. **Inline Comments:** Gunakan komentar hanya untuk menjelaskan *MENGAPA* (Why) kode tersebut ditulis demikian, bukan *APA* (What) yang dilakukan kode tersebut (karena clean code seharusnya sudah menjelaskan "Apa").  
2. **PHPDoc / JSDoc:** Wajib digunakan pada fungsi/method di level *Service* yang memiliki parameter kompleks.  
3. **API Documentation:** Wajib mengupdate koleksi Postman/Swagger yang di-*share* ke tim setiap kali ada pembuatan/perubahan *endpoint* API.  
4. **Git Commits:** Gunakan standar *Conventional Commits*:  
   * feat: untuk penambahan fitur baru (contoh: feat: add auto-translation on chat send)  
   * fix: untuk perbaikan bug  
   * refactor: untuk merapikan kode tanpa ubah fitur  
   * docs: untuk ubah dokumentasi

