# Analisis Kebutuhan Sistem — Aplikasi Konsinyasi UMKM (Frontend)

Dokumen ini merangkum kebutuhan fungsional dan non-fungsional berdasarkan analisis kode frontend pada folder `frontend`.

---

## Ringkasan Proyek
Aplikasi Frontend React (Vite) untuk sistem konsinyasi yang memungkinkan:
- Penitip (pemilik barang) mendaftarkan barang titipan, melihat ringkasan dan statistik barang terjual, serta melihat riwayat penjualan.
- Penjual (reseller) melihat katalog barang yang tersedia, mencatat penjualan, melihat riwayat penjualan, dan mengirim informasi ke penitip.
- Autentikasi (login/register) dan role-based dashboard.
- Backend API terhubung via `axios` pada `src/services/api.js`.

---

## Aktor
- Penitip (role = `penitip`)
- Penjual (role = `penjual`)
- Sistem / Backend API
- (Opsional) Admin

---

## Konteks Sistem
- Frontend menggunakan React (Vite), Axios, React Router
- State & hooks custom di `src/hooks/`
- Komunikasi API di `src/services/api.js` dengan `API_BASE_URL` yang saat ini hard-coded
- Token dan user disimpan di `localStorage`
- Polling default 5000ms (`usePenitipData`, `usePenjualData`)

---

## Estimasi Data Model
- User: id, name, email, role, phone, address
- Item: id, name, description, quantity, price, status, penitip_id, penitip_name
- Sale: id, item_id, penitip_id, penjual_id, quantity_sold, unit_price, total_price, commission_percentage, commission_amount, penjual_income, sale_date
- Information: id, content, created_at

---

## Kebutuhan Fungsional
### Autentikasi & Autorisasi
- FR-A1: Register (`POST /auth/register`) — input: name, email, password, phone, address (opsional), role.
- FR-A2: Login (`POST /auth/login`) — menyimpan token & user ke `localStorage`.
- FR-A3: Routing berdasarkan role (penitip vs penjual).

### Item Management (Penitip)
- FR-I1: Create item (`POST /items`) — form di `AddItemModal.jsx`.
- FR-I2: Retrieve own items (`GET /items/my`).
- FR-I3: Update item (`PUT /items/{id}`).
- FR-I4: Delete item (`DELETE /items/{id}`).
- FR-I5: Display item status & stock.

### Catalog & Sales (Penjual)
- FR-K1: Katalog items (`GET /items`) — show only quantity > 0.
- FR-K2: Record sale (`POST /sales`) — `SaleModal.jsx` handles recording.
- FR-K3: List penjual sales (`GET /sales/my`) — with pagination via `usePagination`.
- FR-K4: Restore sale (delete) (`DELETE /sales/{saleId}`) as "undo"; confirmed in UI.
- FR-K5: Delete item permanently (`DELETE /items/{id}`).

### Reporting & Statistics
- FR-R1: View total income — `GET /sales/{penjual|penitip}/income`.
- FR-R2: Monthly report — `GET /sales/{penjual|penitip}/monthly-report?year&month`.
- FR-R3: Sold items summary & statistics — `GET /items/sold/summary`, `GET /items/sold/detail`, `GET /items/sold/statistics?year&month`.

### Information & Notifications
- FR-N1: Penjual create information to penitip (`POST /information`).
- FR-N2: UI notifications via `useNotification`.

### System Actions
- FR-S1: Reset all sales (`DELETE /sales/reset`) — must require confirmation and strict authorization.
- FR-S2: Polling updates every 5s (default). Replaceable by WebSocket/SSE.

---

## Kebutuhan Non-Fungsional
### Keamanan & Privasi
- NFR-S1: HTTPS required.
- NFR-S2: Token di `localStorage` (pertimbangan: risks XSS, prefer `HttpOnly` cookie).
- NFR-S3: Backend harus enforce role-based access control.

### Performa
- NFR-P1: Polling interval default 5000ms. Consider WebSocket/SSE for scale.
- NFR-P2: Implement pagination & server-side filtering for large datasets.

### Ketersediaan & Keandalan
- NFR-A1: UI must show loading & error states.
- NFR-A2: Endpoints should be idempotent for operations where applicable.

### UX
- NFR-U1: Responsive & mobile friendly.
- NFR-U2: Form validations & friendly error messages (localization: Bahasa Indonesia).

### Maintainability
- NFR-M1: Make API base URL configurable via env (e.g., Vite `import.meta.env.VITE_API_URL`).
- NFR-M2: Hooks & components are modular; maintain tests.

---

## Business Rules
- BR-1: Penjual cannot sell more than available stock.
- BR-2: Selling price minimal equals penitip price (validated in UI as min).
- BR-3: Recording sale reduces stock (server-side).
- BR-4: Deleting sale restores stock (server-side).
- BR-5: Commission calculation handled server-side.

---

## Acceptance Criteria & Test Cases
- AC-1: Register -> Login -> redirect by role.
- AC-2: Penitip add item -> appears in `GET /items/my` and `Katalog` if stok > 0.
- AC-3: Penjual record sale with valid quantity -> stock reduced, sale appears in `GET /sales/my`.
- AC-4: Attempt to sell > stock -> blocked by UI & server.
- AC-5: Reset sales deletes all sales for authorized user only.

---

## API Endpoint Quick Reference
See `src/services/api.js` for implemented endpoints:
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/profile`, `GET /auth/penitips`, `GET /auth/penjuals`
- Items: `POST /items`, `GET /items/my`, `GET /items`, `GET /items/{id}`, `PUT /items/{id}`, `DELETE /items/{id}`, `GET /items/sold/summary`, `GET /items/sold/detail`, `GET /items/sold/statistics`
- Sales: `POST /sales`, `GET /sales/my`, `GET /sales/penitip`, `GET /sales/penjual/income`, `GET /sales/penitip/income`, `GET /sales/{role}/monthly-report`, `DELETE /sales/{id}`, `DELETE /sales/reset`
- Information: `POST /information`, `GET /information`

---

## Deployment & Operational Notes
- Current `Dockerfile` builds the app and serves via `vite preview` on port 3000.
- Recommendation: use env var for API base URL; adjust Dockerfile for production static serving (nginx).

---

## Recommendations & Improvements
- Use `import.meta.env.VITE_API_URL` instead of hard-coded URL.
- Consider moving token storage to `HttpOnly` cookie.
- Refactor polling to configurable interval or implement WebSocket/SSE.
- Add tests: unit & E2E for critical flows.
- Add role-based server-side checks and safe admin operations for destructive endpoints like `reset`.

---

## Next Steps (If you want me to continue)
- Create an environment variable integration for `API_BASE_URL`.
- Add sample E2E tests for authentication & recording sales.
- Add `SYSTEM_REQUIREMENTS.md` to repo (done) and add a `README.md` summary.

---

## Alur Hashing & Penanganan Plaintext Password
Bagian ini menjelaskan alur penanganan password dalam bentuk plaintext (di sisi klien) sampai penyimpanan aman di server, serta verifikasi saat login. Semua komunikasi harus dilakukan melalui HTTPS.

1) Registrasi (Register)
	- Klien (frontend) menampilkan form registrasi dengan field: `name`, `email`, `password`, `confirmPassword`, `phone`, `address`, `role`.
	- User memasukkan password dalam bentuk plaintext pada form.
	- Validasi sisi-klien: `password.length >= 6` (atau sesuai policy), dan `password === confirmPassword`.
	- Payload dikirim ke server (HTTPS):
	  - Request: POST /auth/register
	  - Body (JSON): { name, email, password, phone, address, role }
	- Server menerima payload plaintext, lalu:
	  - Membuat random salt per-user (cryptographically secure random bytes).
	  - Menggunakan algoritma hashing yang aman (disarankan: Argon2 atau Bcrypt dengan cost factor sesuai best practice) untuk menghasilkan `hash = HASH(password + salt)`.
	  - (Opsional) Menambahkan pepper (server-side secret) pada string: `hash = HASH(password + salt + pepper)` untuk menambah lapisan keamanan.
	  - Menyimpan ke database: `user { name, email, password_hash, salt, role, ... }` (tidak menyimpan plaintext password).
	- Server mengembalikan response sukses, dan (opsional) token saat ini.

2) Login (Verify credentials)
	- Klien mengirim login request: POST /auth/login
	  - Body (JSON): { email, password }
	- Server menerima plaintext password, mencari user berdasarkan email, mengambil `stored_hash` & `salt`.
	- Server menghitung `hashCandidate = HASH(password + salt [+ pepper])`, lalu membandingkan `hashCandidate` dengan `stored_hash` menggunakan fungsi aman `constant-time comparison`.
	- Jika cocok: server mengeluarkan token (JWT atau token session), menyimpan atau mengirim refresh token (opsional) dan mengembalikan `200 OK` + user data dan `token`.
	- Jika gagal: server mengembalikan status `401 Unauthorized` dengan pesan error yang umum (hindari memberikan informasi spesifik seperti "password salah" vs "email tidak ditemukan" untuk mengurangi user enumeration).

3) Penyimpanan & Token Management di Frontend
	- Setelah login berhasil, server akan mengembalikan token akses (mis. JWT) dan mungkin refresh token.
	- Token akses disimpan menggunakan `HttpOnly` / `Secure` cookie pada server-side (direkomendasikan) untuk mengurangi risiko XSS. Jika harus menggunakan `localStorage`, pastikan mitigasi XSS dan lifetime token pendek.
	- Refresh token memiliki scoping & path yang aman, disarankan menggunakan `HttpOnly` cookie.

4) Reset Password / Change Password
	- Jika user meng-request reset password, server mengirim token reset melalui email (link with short-lived token).
	- Ketika user submit password baru, backend mengulangi flow hashing (salt + hash) dan mengganti `stored_hash`.

5) Logout & Invalidasi
	- Ketika user logout, server invalidates token (server side blacklisting cara jika menggunakan short lived JWT or rotate refresh token), dan client menghapus cookie atau `localStorage` token.

6) Contoh Pseudocode (Server-side)
	- Register:
	  - salt = randomBytes(16)
	  - hashed = bcrypt.hash(password + salt, costFactor)
	  - store user with `salt` & `hashed`

	- Login:
	  - user = findUserByEmail(email)
	  - if not user: return 401
	  - candidate = bcrypt.hash(password + user.salt, costFactor) // or bcrypt.compare(password+salt, user.hashed)
	  - if compare(candidate, user.hashed) succeed: issue token
	  - else: 401

7) Best Practices & Rekomendasi
	- Algoritma hashing: Gunakan Argon2 (disarankan) atau Bcrypt (bcrypt dengan `cost` >= 12) / PBKDF2 minimal 100k iterations.
	- Salt per-user: random unique per-user, disimpan dalam DB.
	- Pepper: server-side secret, tidak disimpan di DB (opsional, meningkatkan protection against DB leaks).
	- Password policy: minimal 8-12 characters, at least letters & numbers; gunakan validasi dan insight UX untuk password strength.
	- Rate limiting: limit login attempts per IP/user untuk mencegah brute-force.
	- Account lockout & password reset policy.
	- Use HTTPS only (TLS) and HSTS.
	- Log security-relevant events but avoid logging plaintext passwords.

8) Catatan tentang Client-side Hashing
	- Client-side hashing (meng-hash password di browser sebelum mengirim) bukanlah pengganti hashing server; server tetap harus melakukan salting + hashing. Client-side hashing dapat menambah lapisan proteksi terhadap man-in-the-middle jika TLS gagal, namun TLS harus selalu ada. Jangan pernah hanya mengandalkan client-side hashing.

9) Contoh Payloads (contoh sederhana)
	- Register (Request)
	  - POST /auth/register
	  - Body: {
			"name": "Ahmad",
			"email": "ahmad@example.com",
			"password": "passwordPlain123",
			"phone": "08123456789",
			"role": "penitip"
		 }
	- Login (Request)
	  - POST /auth/login
	  - Body: { "email": "ahmad@example.com", "password": "passwordPlain123" }

---

Jika Anda mau, saya bisa menambahkan skema sequence diagram dengan teks ASCII (mis. login register flow), menambahkan contoh implementasi server-side (Node.js + bcrypt/argon2), atau menambahkan sample curl commands untuk QA. Mau saya tambahkan contoh implementasi server-side?

---

*Dokumen dibuat berdasarkan analisis kode frontend pada repository.*
