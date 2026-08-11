# **ERD \+ SKEMA DATABASE LENGKAP**

## **Sistem Aplikasi Chat Internasional dengan Auto-Translation (LinguaChat)**

**Versi Dokumen:** 1.0  
**Tanggal:** 3 Juli 2026

**Database : Mysql (gunakan settingan lokal terlebih dahulu utk pegembangan , dengan port 3306, username : root, password dikosongkan)**

---

# **1\. Tujuan Perancangan Database**

Dokumen ini menjelaskan rancangan **Entity Relationship Diagram (ERD)** dan **skema database** untuk sistem **LinguaChat**, yaitu aplikasi chat internasional berbasis teks yang mendukung auto-translation.

Perancangan database ini dibuat untuk memenuhi kebutuhan sistem berikut:

1. menyimpan data akun pengguna,  
2. menyimpan preferensi bahasa pengguna,  
3. mengelola percakapan antar pengguna,  
4. menyimpan pesan asli dan hasil terjemahan,  
5. mencatat status translation,  
6. menyediakan struktur yang cukup rapi untuk pengembangan lanjutan.

Dokumen ini berfokus pada **desain database untuk MVP**, namun tetap memperhitungkan kemungkinan ekspansi sistem ke fase berikutnya.

---

# **2\. Pendekatan Desain**

## **2.1 Prinsip Desain**

Struktur database dirancang dengan prinsip berikut:

1. **Normalisasi secukupnya**, agar data tidak terlalu berulang.  
2. **Tetap realistis untuk Laravel**, tidak terlalu rumit untuk diimplementasikan.  
3. **Mendukung kebutuhan chat 1-to-1** pada fase awal.  
4. **Mendukung penyimpanan pesan asli dan hasil translation secara eksplisit**.  
5. **Menyediakan pondasi untuk daftar percakapan**, bukan hanya tabel pesan mentah.  
6. **Tidak memaksakan kompleksitas group chat atau multi-translation** pada MVP.

## **2.2 Pendekatan yang Dipilih**

Untuk MVP, saya **tidak menyarankan hanya memakai tabel messages tanpa tabel conversations**.  
Memang secara teknis chat bisa dibangun hanya dengan:

* sender\_id  
* receiver\_id

Namun untuk aplikasi chat yang ingin terasa rapi, pendekatan itu cepat jadi berantakan ketika kamu butuh:

* daftar percakapan,  
* last message,  
* unread count,  
* status percakapan,  
* optimasi query riwayat chat.

Karena itu, desain yang saya sarankan adalah:

### **Entitas inti:**

1. **users**  
2. **conversations**  
3. **conversation\_participants**  
4. **messages**  
5. **message\_translations** 

---

# **3\. Gambaran ERD Konseptual**

## **3.1 Entitas Utama**

Berikut entitas utama dalam sistem:

1. **users**  
   Menyimpan data akun pengguna dan preferensi bahasa.  
2. **conversations**  
   Menyimpan data percakapan. Satu percakapan mewakili satu ruang chat 1-to-1 antara dua pengguna.  
3. **conversation\_participants**  
   Menyimpan daftar peserta dalam percakapan. Untuk MVP 1-to-1, satu percakapan memiliki tepat dua peserta. Tabel ini tetap berguna agar desain tidak buntu jika nanti ingin group chat.  
4. **messages**  
   Menyimpan pesan asli yang dikirim pengguna di dalam suatu percakapan.  
5. **message\_translations**  
   Menyimpan hasil translation dari suatu pesan untuk bahasa target tertentu. Pada MVP memang satu pesan umumnya hanya punya satu translation utama untuk penerima, tetapi memisahkan translation dari pesan utama adalah desain yang lebih bersih dan lebih scalable.

---

# **4\. Relasi Antar Entitas**

## **4.1 Relasi Utama**

1. **Satu user dapat ikut dalam banyak conversation**  
2. **Satu conversation memiliki banyak participant**  
3. **Satu conversation memiliki banyak message**  
4. **Satu message dimiliki oleh satu sender**  
5. **Satu message dapat memiliki nol atau lebih translation**  
6. **Satu translation terkait ke satu message**  
7. **Satu translation menyimpan informasi bahasa target dan hasil terjemahan**

---

# **5\. ERD Teks (Textual ERD)**

Berikut representasi relasi dalam bentuk teks:

* **users** 1 \--- n **conversation\_participants**  
* **conversations** 1 \--- n **conversation\_participants**  
* **conversations** 1 \--- n **messages**  
* **users** 1 \--- n **messages** *(sebagai sender)*  
* **messages** 1 \--- n **message\_translations**  
* **users** 1 \--- n **message\_translations** *(opsional: jika translation disimpan per recipient tertentu)*

---

# **6\. Struktur Tabel yang Direkomendasikan**

## **6.1 Daftar Tabel**

Untuk MVP yang rapi, merekomendasikan **5 tabel utama**:

1. users  
2. conversations  
3. conversation\_participants  
4. messages  
5. message\_translations

---

# **7\. Detail Skema Tabel**

# **7.1 Tabel users**

## **7.1.1 Fungsi**

Menyimpan data akun pengguna dan preferensi bahasa yang digunakan sistem untuk menentukan bahasa target translation.

## **7.1.2 Struktur Tabel**

| Kolom | Tipe Data | Null | Key | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | No | PK | Primary key user |
| name | VARCHAR(100) | No |  | Nama pengguna |
| email | VARCHAR(150) | No | UNIQUE | Email pengguna |
| password | VARCHAR(255) | No |  | Password hash |
| preferred\_language | VARCHAR(10) | No | INDEX | Bahasa utama user, contoh: id, en, th, ja |
| country\_code | VARCHAR(10) | Yes |  | Kode negara opsional, contoh: ID, TH, JP |
| avatar | VARCHAR(255) | Yes |  | Path/URL avatar jika nanti ditambahkan |
| is\_active | BOOLEAN | No |  | Status akun aktif/nonaktif |
| created\_at | TIMESTAMP | No |  | Waktu dibuat |
| updated\_at | TIMESTAMP | No |  | Waktu diperbarui |

## **7.1.3 Catatan Desain**

1. preferred\_language **wajib** karena inti sistem translation bergantung pada ini.  
2. country\_code sebaiknya hanya informasi tambahan, **bukan sumber utama translation**.  
3. is\_active berguna jika nanti ingin soft-block akun tanpa menghapus data.

---

# **7.2 Tabel conversations**

## **7.2.1 Fungsi**

Menyimpan entitas percakapan. Untuk MVP, satu conversation mewakili satu chat room 1-to-1 antara dua user.

## **7.2.2 Struktur Tabel**

| Kolom | Tipe Data | Null | Key | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | No | PK | Primary key conversation |
| type | ENUM('private') / VARCHAR(20) | No |  | Jenis percakapan, untuk MVP: private |
| created\_by | BIGINT UNSIGNED | Yes | FK \-\> users.id | User yang pertama kali memulai conversation |
| last\_message\_id | BIGINT UNSIGNED | Yes | FK \-\> messages.id | Pesan terakhir dalam conversation |
| last\_message\_at | TIMESTAMP | Yes | INDEX | Waktu pesan terakhir |
| created\_at | TIMESTAMP | No |  | Waktu dibuat |
| updated\_at | TIMESTAMP | No |  | Waktu diperbarui |

## **7.2.3 Catatan Desain**

1. last\_message\_id dan last\_message\_at sangat berguna untuk **daftar percakapan** tanpa harus query seluruh pesan.  
2. type tetap disediakan walaupun saat ini hanya private, supaya desain tidak mentok jika nanti ada group chat.  
3. created\_by berguna untuk audit dan histori pembentukan conversation.

---

# **7.3 Tabel conversation\_participants**

## **7.3.1 Fungsi**

Menyimpan daftar peserta dalam sebuah conversation.

## **7.3.2 Struktur Tabel**

| Kolom | Tipe Data | Null | Key | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | No | PK | Primary key |
| conversation\_id | BIGINT UNSIGNED | No | FK \-\> conversations.id | ID conversation |
| user\_id | BIGINT UNSIGNED | No | FK \-\> users.id | ID user peserta conversation |
| joined\_at | TIMESTAMP | No |  | Waktu user masuk ke conversation |
| last\_read\_message\_id | BIGINT UNSIGNED | Yes | FK \-\> messages.id | Pesan terakhir yang sudah dibaca user |
| last\_read\_at | TIMESTAMP | Yes |  | Waktu terakhir user membaca conversation |
| created\_at | TIMESTAMP | No |  | Timestamp |
| updated\_at | TIMESTAMP | No |  | Timestamp |

## **7.3.3 Constraint Penting**

1. Kombinasi (conversation\_id, user\_id) harus **unik** agar satu user tidak tercatat dua kali di conversation yang sama.  
2. Untuk MVP private chat, satu conversation\_id seharusnya memiliki **tepat dua participant**. Aturan ini lebih mudah dijaga di level aplikasi daripada dipaksa di constraint SQL.

## **7.3.4 Catatan Desain**

Tabel ini terlihat “berlebih” untuk MVP, tapi justru ini yang membuat sistem jauh lebih rapi.  
Kalau kamu menghapus tabel ini dan langsung menyimpan dua user di tabel conversations, kamu memang lebih cepat di awal, tapi lebih sulit saat:

* ingin group chat,  
* ingin unread state per user,  
* ingin mute/archive per participant,  
* ingin status baca per user.

---

# **7.4 Tabel messages**

## **7.4.1 Fungsi**

Menyimpan pesan asli yang dikirim pengirim ke dalam sebuah conversation.

## **7.4.2 Struktur Tabel**

| Kolom | Tipe Data | Null | Key | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | No | PK | Primary key message |
| conversation\_id | BIGINT UNSIGNED | No | FK \-\> conversations.id | Conversation tempat pesan dikirim |
| sender\_id | BIGINT UNSIGNED | No | FK \-\> users.id | Pengirim pesan |
| message\_type | ENUM('text') / VARCHAR(20) | No |  | Untuk MVP: text |
| original\_text | TEXT | No |  | Isi pesan asli dari pengirim |
| original\_language | VARCHAR(10) | Yes | INDEX | Bahasa sumber, misal id, en, th |
| translation\_status | ENUM('pending','done','failed','not\_needed') / VARCHAR(20) | No | INDEX | Status translation utama |
| sent\_at | TIMESTAMP | No | INDEX | Waktu pesan dikirim |
| created\_at | TIMESTAMP | No |  | Timestamp |
| updated\_at | TIMESTAMP | No |  | Timestamp |
| deleted\_at | TIMESTAMP | Yes |  | Untuk soft delete jika diperlukan |

## 

## 

## **7.4.3 Arti translation\_status**

Nilai yang direkomendasikan:

* pending → translation sedang diproses / belum selesai  
* done → translation berhasil  
* failed → translation gagal  
* not\_needed → translation tidak diperlukan, misalnya bahasa pengirim dan penerima sama

## **7.4.4 Catatan Desain**

1. original\_text disimpan di tabel utama karena ini adalah **sumber utama pesan**.  
2. original\_language bisa diisi dari:  
   * preferred\_language pengirim, atau  
   * hasil deteksi provider jika nanti menggunakan auto detect.  
3. sent\_at dipisahkan agar secara semantik lebih jelas untuk pesan chat, walaupun teknisnya mirip created\_at.

---

# **7.5 Tabel message\_translations**

## **7.5.1 Fungsi**

Menyimpan hasil translation untuk suatu pesan.

## **7.5.2 Kenapa translation dipisah dari tabel messages?**

Karena ini desain yang lebih sehat daripada menaruh semua kolom translation langsung di messages.  
Kalau translation ditaruh langsung di messages, memang lebih simpel untuk MVP, tapi cepat jadi sempit saat:

* satu pesan perlu dilihat oleh lebih dari satu penerima dengan bahasa berbeda,  
* ingin retry translation,  
* ingin menyimpan metadata provider,  
* ingin menyimpan lebih dari satu versi translation.

Memisahkan translation ke tabel sendiri membuat struktur lebih fleksibel.

## **7.5.3 Struktur Tabel**

| Kolom | Tipe Data | Null | Key | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | No | PK | Primary key translation |
| message\_id | BIGINT UNSIGNED | No | FK \-\> messages.id | ID pesan yang diterjemahkan |
| recipient\_id | BIGINT UNSIGNED | Yes | FK \-\> users.id | User penerima hasil translation |
| source\_language | VARCHAR(10) | Yes | INDEX | Bahasa sumber |
| target\_language | VARCHAR(10) | No | INDEX | Bahasa target |
| translated\_text | TEXT | Yes |  | Hasil terjemahan |
| provider\_name | VARCHAR(50) | Yes |  | Misal libretranslate |
| provider\_response | JSON / LONGTEXT | Yes |  | Respons mentah provider bila ingin disimpan |
| status | ENUM('pending','done','failed','not\_needed') / VARCHAR(20) | No | INDEX | Status translation record ini |
| translated\_at | TIMESTAMP | Yes |  | Waktu translation selesai |
| created\_at | TIMESTAMP | No |  | Timestamp |
| updated\_at | TIMESTAMP | No |  | Timestamp |

## **7.5.4 Constraint yang Direkomendasikan**

Tambahkan unique constraint:

* (message\_id, recipient\_id, target\_language)

Tujuannya agar satu pesan tidak punya translation ganda untuk recipient dan bahasa target yang sama, kecuali kamu memang ingin versioning translation.

## **7.5.5 Catatan Desain**

Pada MVP private chat, satu pesan biasanya hanya punya **satu translation record** untuk satu penerima.  
Tetapi memisahkannya ke tabel ini tetap lebih baik daripada menaruh semua hasil translation di tabel messages.

---

# **8\. Relasi Detail Antar Tabel**

## **8.1 Relasi users ke conversation\_participants**

* Satu user dapat menjadi participant di banyak conversation  
* Satu participant record hanya milik satu user

**Relasi:**  
users.id → conversation\_participants.user\_id

---

## **8.2 Relasi conversations ke conversation\_participants**

* Satu conversation memiliki banyak participant  
* Satu participant record hanya milik satu conversation

**Relasi:**  
conversations.id → conversation\_participants.conversation\_id

---

## **8.3 Relasi conversations ke messages**

* Satu conversation memiliki banyak message  
* Satu message hanya milik satu conversation

**Relasi:**  
conversations.id → messages.conversation\_id

---

## **8.4 Relasi users ke messages**

* Satu user dapat mengirim banyak message  
* Satu message hanya punya satu sender

**Relasi:**  
users.id → messages.sender\_id

---

## **8.5 Relasi messages ke message\_translations**

* Satu message dapat memiliki nol atau lebih translation  
* Satu translation hanya terkait ke satu message

**Relasi:**  
messages.id → message\_translations.message\_id

---

## **8.6 Relasi users ke message\_translations**

* Satu user dapat menjadi penerima banyak translation  
* Satu translation dapat dikaitkan ke satu recipient

**Relasi:**  
users.id → message\_translations.recipient\_id

---

# **9\. ERD Naratif per Skenario**

# **9.1 Skenario Membuat Percakapan Baru**

Misal:

* User A ingin chat dengan User B

Langkah data:

1. Sistem membuat 1 row di tabel conversations  
2. Sistem membuat 2 row di tabel conversation\_participants  
   * participant 1 \= User A  
   * participant 2 \= User B

Dengan begitu, satu ruang chat resmi terbentuk.

---

# **9.2 Skenario Mengirim Pesan**

Misal User A mengirim pesan ke User B:

“Halo, apa kabar?”

Langkah data:

1. Simpan row baru di messages  
   * conversation\_id \= X  
   * sender\_id \= A  
   * original\_text \= "Halo, apa kabar?"  
   * original\_language \= "id"  
   * translation\_status \= pending  
2. Sistem memanggil LibreTranslate untuk menerjemahkan ke bahasa preferensi User B, misalnya th  
3. Jika berhasil, simpan row di message\_translations  
   * message\_id \= \<id pesan\>  
   * recipient\_id \= B  
   * source\_language \= id  
   * target\_language \= th  
   * translated\_text \= ...  
   * status \= done  
4. Update messages.translation\_status \= done  
5. Update conversations.last\_message\_id dan last\_message\_at

---

# **10\. Index yang Direkomendasikan**

Agar query chat tidak lambat, saya sarankan index berikut:

## **10.1 Tabel users**

* unique index pada email  
* index pada preferred\_language

## **10.2 Tabel conversations**

* index pada last\_message\_at  
* index pada created\_by

## **10.3 Tabel conversation\_participants**

* unique (conversation\_id, user\_id)  
* index pada user\_id

## **10.4 Tabel messages**

* index pada conversation\_id  
* index pada sender\_id  
* index pada translation\_status  
* index pada sent\_at  
* composite index (conversation\_id, sent\_at)

## **10.5 Tabel message\_translations**

* index pada message\_id  
* index pada recipient\_id  
* index pada target\_language  
* index pada status  
* unique (message\_id, recipient\_id, target\_language)

---

# **11\. Aturan Integritas Data yang Direkomendasikan**

## **11.1 Aturan User**

1. Email user harus unik  
2. Preferred language tidak boleh kosong  
3. Password harus disimpan dalam bentuk hash

## **11.2 Aturan Conversation**

1. Conversation private harus memiliki dua participant aktif  
2. Participant yang sama tidak boleh tercatat dua kali di conversation yang sama

## **11.3 Aturan Message**

1. Sender harus merupakan participant dari conversation tersebut  
2. Original text tidak boleh kosong  
3. Message harus terkait ke conversation yang valid

## **11.4 Aturan Translation**

1. Translation tidak boleh berdiri tanpa message  
2. Target language wajib diisi  
3. Translation status wajib tercatat  
4. Translation gagal tidak boleh menghapus pesan utama

---

# **12\. Skema SQL Konseptual (DDL Level Desain)**

Catatan: ini **belum format migration Laravel final**, tapi sudah sangat dekat dengan implementasi.

---

## **13.1 Tabel users**

CREATE TABLE users (  
    id BIGINT UNSIGNED AUTO\_INCREMENT PRIMARY KEY,  
    name VARCHAR(100) NOT NULL,  
    email VARCHAR(150) NOT NULL UNIQUE,  
    password VARCHAR(255) NOT NULL,  
    preferred\_language VARCHAR(10) NOT NULL,  
    country\_code VARCHAR(10) NULL,  
    avatar VARCHAR(255) NULL,  
    is\_active BOOLEAN NOT NULL DEFAULT TRUE,  
    created\_at TIMESTAMP NULL,  
    updated\_at TIMESTAMP NULL  
);

---

## **13.2 Tabel conversations**

CREATE TABLE conversations (  
    id BIGINT UNSIGNED AUTO\_INCREMENT PRIMARY KEY,  
    type VARCHAR(20) NOT NULL DEFAULT 'private',  
    created\_by BIGINT UNSIGNED NULL,  
    last\_message\_id BIGINT UNSIGNED NULL,  
    last\_message\_at TIMESTAMP NULL,  
    created\_at TIMESTAMP NULL,  
    updated\_at TIMESTAMP NULL,  
    CONSTRAINT fk\_conversations\_created\_by  
        FOREIGN KEY (created\_by) REFERENCES users(id)  
        ON DELETE SET NULL  
);

**Catatan penting:**  
foreign key last\_message\_id ke messages.id bisa ditambahkan setelah tabel messages selesai dibuat, untuk menghindari circular dependency saat initial creation.

---

## **13.3 Tabel conversation\_participants**

CREATE TABLE conversation\_participants (  
    id BIGINT UNSIGNED AUTO\_INCREMENT PRIMARY KEY,  
    conversation\_id BIGINT UNSIGNED NOT NULL,  
    user\_id BIGINT UNSIGNED NOT NULL,  
    joined\_at TIMESTAMP NOT NULL,  
    last\_read\_message\_id BIGINT UNSIGNED NULL,  
    last\_read\_at TIMESTAMP NULL,  
    created\_at TIMESTAMP NULL,  
    updated\_at TIMESTAMP NULL,  
    CONSTRAINT fk\_cp\_conversation  
        FOREIGN KEY (conversation\_id) REFERENCES conversations(id)  
        ON DELETE CASCADE,  
    CONSTRAINT fk\_cp\_user  
        FOREIGN KEY (user\_id) REFERENCES users(id)  
        ON DELETE CASCADE,  
    UNIQUE KEY uq\_conversation\_user (conversation\_id, user\_id)  
);

---

## **13.4 Tabel messages**

CREATE TABLE messages (  
    id BIGINT UNSIGNED AUTO\_INCREMENT PRIMARY KEY,  
    conversation\_id BIGINT UNSIGNED NOT NULL,  
    sender\_id BIGINT UNSIGNED NOT NULL,  
    message\_type VARCHAR(20) NOT NULL DEFAULT 'text',  
    original\_text TEXT NOT NULL,  
    original\_language VARCHAR(10) NULL,  
    translation\_status VARCHAR(20) NOT NULL DEFAULT 'pending',  
    sent\_at TIMESTAMP NOT NULL,  
    created\_at TIMESTAMP NULL,  
    updated\_at TIMESTAMP NULL,  
    deleted\_at TIMESTAMP NULL,  
    CONSTRAINT fk\_messages\_conversation  
        FOREIGN KEY (conversation\_id) REFERENCES conversations(id)  
        ON DELETE CASCADE,  
    CONSTRAINT fk\_messages\_sender  
        FOREIGN KEY (sender\_id) REFERENCES users(id)  
        ON DELETE CASCADE  
);

---

## **13.5 Tabel message\_translations**

CREATE TABLE message\_translations (  
    id BIGINT UNSIGNED AUTO\_INCREMENT PRIMARY KEY,  
    message\_id BIGINT UNSIGNED NOT NULL,  
    recipient\_id BIGINT UNSIGNED NULL,  
    source\_language VARCHAR(10) NULL,  
    target\_language VARCHAR(10) NOT NULL,  
    translated\_text TEXT NULL,  
    provider\_name VARCHAR(50) NULL,  
    provider\_response JSON NULL,  
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  
    translated\_at TIMESTAMP NULL,  
    created\_at TIMESTAMP NULL,  
    updated\_at TIMESTAMP NULL,  
    CONSTRAINT fk\_mt\_message  
        FOREIGN KEY (message\_id) REFERENCES messages(id)  
        ON DELETE CASCADE,  
    CONSTRAINT fk\_mt\_recipient  
        FOREIGN KEY (recipient\_id) REFERENCES users(id)  
        ON DELETE CASCADE,  
    UNIQUE KEY uq\_message\_recipient\_target (message\_id, recipient\_id, target\_language)  
);

---

## **13.6 Alter Tambahan untuk conversations.last\_message\_id**

ALTER TABLE conversations  
ADD CONSTRAINT fk\_conversations\_last\_message  
FOREIGN KEY (last\_message\_id) REFERENCES messages(id)  
ON DELETE SET NULL;

---

# **14\. Kesimpulan**

ERD dan skema database LinguaChat dirancang untuk mendukung aplikasi chat 1-to-1 lintas bahasa dengan fitur auto-translation. Struktur utama terdiri dari tabel pengguna, percakapan, peserta percakapan, pesan, dan translation pesan. Pendekatan ini dipilih agar sistem tidak hanya bisa berjalan untuk MVP, tetapi juga tetap cukup rapi ketika dikembangkan ke fitur lanjutan seperti daftar percakapan, status baca, optimasi riwayat chat, retry translation, dan kemungkinan dukungan lebih dari satu provider translation.

Untuk implementasi Laravel, desain ini sudah cukup dekat dengan bentuk migration dan model relasi Eloquent. Dengan kata lain, dokumen ini bukan hanya cocok untuk kebutuhan analisis dan dokumentasi, tetapi juga sudah bisa langsung diturunkan ke tahap implementasi backend.

