# Installing Testing Dependencies

Karena aplikasi menggunakan **React 19.2.3** dan **Expo SDK 56**, ada beberapa cara untuk install testing dependencies:

## Step 1: Install @react-native/jest-preset (REQUIRED)

React Native preset sudah pindah ke package terpisah. Install ini dulu:

```bash
npm install --save-dev @react-native/jest-preset --legacy-peer-deps
```

## Step 2: Install Testing Libraries

### Option A: Install dengan --legacy-peer-deps (Recommended)

Jalankan command ini di terminal:

```bash
npm install --save-dev jest@^29.7.0 @testing-library/react-native@^12.4.0 @testing-library/jest-native@^5.4.3 react-test-renderer --legacy-peer-deps
```

Flag `--legacy-peer-deps` akan mengabaikan peer dependency conflicts dan tetap install dependencies yang diperlukan.

## Option 2: Install dengan --force

Alternatif lain jika option 1 tidak berhasil:

```bash
npm install --save-dev jest@^29.7.0 @testing-library/react-native@^12.4.0 @testing-library/jest-native@^5.4.3 --force
```

## Option 3: Manual Install (jika option 1 & 2 gagal)

Install satu per satu:

```bash
npm install --save-dev jest@^29.7.0 --legacy-peer-deps
npm install --save-dev @testing-library/react-native@^12.4.0 --legacy-peer-deps
npm install --save-dev @testing-library/jest-native@^5.4.3 --legacy-peer-deps
```

## Verifikasi Installation

Setelah install berhasil, cek apakah dependencies sudah ada:

```bash
npm list jest @testing-library/react-native @testing-library/jest-native
```

## Run Tests

Setelah dependencies terinstall, jalankan tests:

```bash
npm test
```

## Catatan

- Conflict terjadi karena React 19.2.3 masih cukup baru
- Testing libraries mungkin belum full support React 19
- Menggunakan `--legacy-peer-deps` adalah solusi yang aman untuk development
- Tests tetap akan berjalan dengan baik meskipun ada peer dependency warning

---

Silakan jalankan salah satu command di atas di terminal kamu!
