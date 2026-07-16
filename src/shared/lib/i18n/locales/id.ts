export default {
  // ── Common ──────────────────────────────────────────────────
  // Shared across ALL features — single source of truth
  common: {
    // App
    app_name: "Passandi",
    tagline: "Melawan Rumitnya Keamanan",

    // Actions
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    confirm: "Konfirmasi",
    edit: "Edit",
    add: "Tambah",
    ok: "OK",
    or: "atau",
    back: "Kembali",
    coming_soon: "Coming Soon",

    // States
    loading: "Memuat...",
    error: "Terjadi kesalahan",
    success: "Berhasil",
    info: "Informasi",

    // Visibility
    hide: "Sembunyikan",
    show: "Tampilkan",

    // Auth fields
    email: "Email",
    password: "Password",
    username: "Username",
    name: "Nama Lengkap",
    pin: "PIN",
    notes: "Catatan",
    phone: "Nomor Telepon",
    url: "Website",

    // Field labels
    holder: "Nama Pemegang",
    expiry_date: "Tanggal Expired",
    custom_fields: "Custom Field",
    account_info: "Informasi Akun",
    extra_info: "Informasi Tambahan",

    // Vault
    all: "Semua",
    favorite: "Favorit",

    // Plans
    free_plan: "Free Plan",
    premium: "Premium",

    // Navigation
    choose_icon: "Pilih Ikon",
    choose_color: "Pilih Warna",

    // Auth messages
    logout: "Logout",
    logout_confirm: "Yakin ingin keluar?",
    error_empty: "Semua field wajib diisi.",
    error_not_match: "Kata sandi tidak cocok.",
    error_min_length: "Minimal 8 karakter.",

    // Misc
    default_username: "Pengguna",
  },

  // ── Auth ────────────────────────────────────────────────────
  auth: {
    login: "Masuk ke Akun",
    register: "Buat Akun Baru",
    email_placeholder: "nama@email.com",
    password_placeholder: "Minimal 8 karakter",
    btn_login: "Masuk",
    btn_register: "Daftar",
    btn_google: "Lanjutkan dengan Google",
    have_account: "Sudah punya akun?",
    no_account: "Belum punya akun?",
    go_login: "Masuk",
    go_register: "Daftar",
    name_placeholder: "Masukkan nama lengkap",
    confirm_password: "Konfirmasi Kata Sandi",
    confirm_password_placeholder: "Ulangi kata sandi",
    register_success: "Akun berhasil dibuat! Silakan masuk.",
    master_password: "Kata Sandi Utama",
  },

  // ── Vault ───────────────────────────────────────────────────
  vault: {
    title: "Brankas",
    search: "Cari akun...",
    greeting: "Selamat datang,",
    empty_title: "Belum ada akun",
    empty_sub: "Tap + untuk menambahkan akun pertamamu",
    section_all: "SEMUA AKUN",
    items_count: "item",
    add_item: "Tambah Akun",
    edit_item: "Edit Akun",
    section_main: "Info Utama",
    section_extra: "Info Tambahan",
    section_account_info: "Informasi Akun",
    section_extra_info: "Informasi Tambahan",
    field_title: "Nama Akun",
    field_title_placeholder: "contoh: BCA Mobile",
    field_category: "Kategori",
    field_username_placeholder: "username / email",
    field_email_placeholder: "email@domain.com",
    field_password_placeholder: "••••••••",
    field_pin_placeholder: "••••",
    field_phone_placeholder: "08xxxxxxxxxx",
    field_url_placeholder: "https://...",
    field_holder_name_placeholder: "Nama pemegang",
    field_expired_date_placeholder: "MM/YYYY",
    field_notes_placeholder: "Catatan...",
    add_custom_field: "Tambah Custom Field",
    mark_favorite: "Tandai Favorit",
    error_title_required: "Nama akun wajib diisi.",
    error_save: "Gagal menyimpan",
    custom_field_label: "Label Field",
    custom_field_label_placeholder: "contoh: Kode Recovery",
    custom_field_value: "Nilai",
    custom_field_value_placeholder: "Isi nilai field",
    custom_field_hide_value: "Sembunyikan nilai",
    icon_bg_color: "Warna Background",
    icon_pick_color: "Pilih Warna Solid",
    icon_group_finance: "Keuangan",
    icon_group_social: "Sosial Media",
    icon_group_security: "Keamanan",
    icon_group_shopping: "Shopping",
    icon_group_other: "Lainnya",
    icon_group_communication: "Komunikasi",
    icon_group_general: "Umum",
  },

  // ── Settings ────────────────────────────────────────────────
  settings: {
    title: "Pengaturan",
    section_display: "Tampilan",
    section_security: "Keamanan",
    section_other: "Lainnya",
    section_danger: "Danger Zone",
    dark_mode: "Tema Gelap",
    language: "Bahasa",
    biometric: "Biometrik",
    biometric_sub: "FaceID / Sidik Jari",
    master_password: "Ganti Master Password",
    about: "Tentang Aplikasi",
    wipe: "Hapus Semua Data",
    wipe_sub: "Wipe data di perangkat ini",
    wipe_confirm:
      "Seluruh data di perangkat ini akan dihapus permanen. Lanjutkan?",
    delete_account: "Hapus Akun Permanen",
    delete_account_sub: "Tidak dapat dibatalkan",
    delete_confirm:
      "Akun dan seluruh data kamu akan dihapus selamanya. Tindakan ini tidak dapat dibatalkan.",
    section_app: "Aplikasi",
    section_account: "Akun",
    section_support: "Support & Dukungan",
    theme: "Tema",
    theme_dark: "Gelap",
    theme_light: "Terang",
    theme_system: "Sistem",
    language_id: "Indonesia",
    language_en: "English",
    notification: "Notifikasi",
    notification_sub: "Pengingat keamanan",
    change_pin: "Ganti PIN",
    two_factor: "Two-Factor Authentication",
    two_factor_sub: "Keamanan login tambahan",
    two_factor_already: "2FA sudah aktif. Nonaktifkan?",
    two_factor_setup: "Scan QR code ini di aplikasi authenticator:\n\n{{code}}",
    two_factor_verify: "Setelah scan, masukkan 6-digit kode dari aplikasi authenticator untuk verifikasi.",
    two_factor_activated: "2FA berhasil diaktifkan!",
    two_factor_disabled: "2FA berhasil dinonaktifkan.",
    auto_lock: "Auto-Lock",
    auto_lock_sub: "Kunci otomatis setelah tidak aktif",
    clear_clipboard: "Hapus Clipboard Otomatis",
    clear_clipboard_sub: "Setelah copy password",
    lock_immediately: "Segera",
    lock_1min: "1 menit",
    lock_5min: "5 menit",
    lock_15min: "15 menit",
    lock_never: "Tidak pernah",
    clip_15s: "15 detik",
    clip_30s: "30 detik",
    clip_60s: "1 menit",
    clip_never: "Tidak pernah",
    active_sessions: "Sesi Aktif",
    active_sessions_sub: "{{count}} device terhubung",
    export_data: "Export Data",
    export_data_sub: "Ekspor vault ke file terenkripsi",
    export_success: "Vault berhasil diekspor",
    wipe_data: "Hapus Semua Data",
    wipe_data_sub: "Wipe lokal, akun tetap ada",
    contact_us: "Hubungi Kami",
    contact_us_sub: "Email support",
    terms: "Syarat & Ketentuan",
    privacy: "Kebijakan Privasi",
    about_sub: "v1.0.0 · Build 1",
    premium_feature: "Fitur Premium",
    premium_feature_desc: "Fitur ini tersedia di Passandi Premium.",
    upgrade: "Upgrade",
    danger_warning: "⚠️ Tindakan di halaman ini bersifat permanen dan tidak dapat dibatalkan.",
  },

  // ── Security (Setup Flow) ───────────────────────────────────
  security: {
    step_of: "Langkah {{current}} dari {{total}}",
    master_password_title: "Buat Master Password",
    master_password_subtitle:
      "Kata sandi utama untuk mengunci seluruh datamu. Jangan sampai lupa.",
    master_password_label: "Master Password",
    master_password_confirm: "Konfirmasi Master Password",
    master_placeholder: "Minimal 8 karakter",
    master_confirm_placeholder: "Ulangi master password",
    strength_weak: "Lemah",
    strength_fair: "Cukup",
    strength_good: "Kuat",
    strength_strong: "Sangat Kuat",
    btn_continue: "Lanjutkan →",
    pin_title: "Buat PIN 6 Digit",
    pin_subtitle: "Untuk masuk lebih cepat setiap harinya",
    pin_confirm_title: "Konfirmasi PIN",
    pin_confirm_subtitle: "Masukkan ulang PIN kamu",
    pin_error_not_match: "PIN tidak cocok. Coba lagi.",
    success_title: "Siap!",
    success_subtitle:
      "Akun kamu sudah terlindungi. Selamat datang di Passandi.",
    btn_enter_vault: "Masuk ke Brankas",
  },

  // ── Unlock ──────────────────────────────────────────────────
  unlock: {
    title: "Masukkan PIN",
    greeting: "Halo, {{name}} 👋",
    use_biometric: "Gunakan Biometrik",
    use_pin: "Gunakan PIN",
    biometric_prompt: "Konfirmasi identitas kamu",
    switch_account: "Ganti Akun",
  },

  // ── Category ────────────────────────────────────────────────
  category: {
    title: "Kategori",
    bank: "Bank",
    sosmed: "Sosmed",
    ewallet: "E-Wallet",
    work: "Work",
    hiburan: "Hiburan",
    shopping: "Shopping",
    edit: "Edit Kategori",
    btn_add: "Buat Kategori",
    section_default: "Bawaan",
    section_custom: "Kustom",
    name_label: "Nama Kategori",
    name_placeholder: "contoh: Keuangan",
    delete_title: "Hapus Kategori",
    delete_confirm: "Hapus kategori \"{{name}}\"? Item di dalamnya tidak akan terhapus.",
    info_guide: "Gunakan kategori untuk mengelompokkan kata sandi kamu. Tap + Tambah untuk membuat kategori baru.",
    add_first: "Buat kategori pertamamu",
  },

  // ── Detail ──────────────────────────────────────────────────
  detail: {
    title: "Detail Akun",
    section_account: "Informasi Akun",
    section_extra: "Informasi Tambahan",
    copy_success: "Disalin!",
    copied: "{{field}} disalin ke clipboard",
    open_url: "Buka Website",
    delete_confirm: "Hapus akun \"{{name}}\"? Tindakan ini tidak dapat dibatalkan.",
    error_not_found: "Item tidak ditemukan",
    error_open_url: "Tidak bisa membuka URL ini.",
    created_at: "Dibuat:",
    updated_at: "Diperbarui:",
  },

  // ── Profile ─────────────────────────────────────────────────
  profile: {
    title: "Profil",
    full_name: "Nama Lengkap",
    full_name_placeholder: "Masukkan nama lengkap",
    email_note: "Email tidak dapat diubah",
    member_since: "Bergabung sejak",
    save: "Simpan Perubahan",
    save_success: "Profil berhasil diperbarui",
    plan_title: "Plan Kamu",
    plan_free_sub: "Akses fitur dasar Passandi",
    plan_premium_sub: "Semua fitur tanpa batas",
    upgrade_btn: "Upgrade ke Premium",
    upgrade_desc: "Dapatkan 2FA, Export Data, dan lebih banyak lagi",
  },

  // ── Change PIN ──────────────────────────────────────────────
  change_pin: {
    title: "Ganti PIN",
    current_pin: "PIN Saat Ini",
    current_hint: "Masukkan PIN lama kamu",
    new_pin: "PIN Baru",
    confirm_pin: "Konfirmasi PIN Baru",
    btn_save: "Simpan PIN Baru",
    success: "PIN berhasil diubah",
    error_wrong: "PIN saat ini salah",
    error_match: "PIN baru tidak cocok",
    step_current: "Verifikasi PIN Lama",
    step_current_sub: "Masukkan PIN saat ini",
    step_new: "Buat PIN Baru",
    step_new_sub: "Masukkan 6 digit PIN baru",
    step_confirm: "Konfirmasi PIN Baru",
    step_confirm_sub: "Ulangi PIN baru kamu",
  },

  // ── Sessions ────────────────────────────────────────────────
  sessions: {
    coming_soon_title: "Multi-Device Support",
    coming_soon_desc: "Fitur ini sedang dalam pengembangan.\nKamu akan bisa melihat semua device yang login, mencabut akses, dan scan QR untuk buka Passandi di browser laptop.",
    coming_soon_badge: "Coming Soon",
    info_text: "Saat ini Passandi mendukung login di beberapa perangkat mobile sekaligus menggunakan akun yang sama.",
    current_device: "PERANGKAT SAAT INI",
    this_device: "Perangkat Ini",
    since_date: "Sejak {{date}}",
    active: "Aktif",
    revoke_others: "Logout Semua Perangkat Lain",
    revoke_title: "Cabut Sesi",
    revoke_confirm: "Ini akan logout dari semua perangkat lain. Lanjutkan?",
    revoke_btn: "Logout Perangkat Lain",
    revoke_success: "Perangkat lain sudah di-logout.",
  },

  // ── Sync ────────────────────────────────────────────────────
  sync: {
    offline: "Offline",
    syncing: "Menyinkron...",
    synced: "Tersinkron",
    error: "Gagal sync",
    pending: "pending",
  },

  // ── About ───────────────────────────────────────────────────
  about: {
    title: "Tentang Passandi",
    version: "Versi",
    build: "Build",
    description: "Passandi adalah aplikasi pengelola kata sandi yang mengutamakan keamanan dan kemudahan. Data kamu tersimpan terenkripsi dan selalu tersinkronisasi.",
    made_with: "Dibuat dengan ❤️ di Indonesia",
    section_info: "Informasi Aplikasi",
    section_legal: "Legal",
    platform: "Platform",
    platform_val: "iOS & Android",
    open_source: "Open Source Libraries",
    changelog: "Catatan Pembaruan",
  },

  // ── Premium ─────────────────────────────────────────────────
  premium: {
    badge_pro: "PRO",
    badge_locked: "TERKUNCI",
    upgrade_to_premium: "Upgrade ke Premium",

    // Feature names
    feature_unlimited_items: "Item Vault Tak Terbatas",
    feature_custom_categories: "Kategori Kustom",
    feature_custom_fields: "Field Kustom",
    feature_biometric_lock: "Kunci Biometrik",
    feature_cloud_sync: "Sinkronisasi Cloud Otomatis",
    feature_export_vault: "Ekspor Vault",
    feature_password_generator: "Generator Password Lanjutan",

    // Messages
    limit_reached_title: "Batas Tercapai",
    limit_reached_message: "Kamu sudah menambahkan {{count}} item! Upgrade ke Premium untuk penyimpanan tak terbatas.",
    custom_categories_message: "Buat kategori kustom dengan Premium",
    custom_fields_message: "Tambahkan field kustom tak terbatas dengan Premium",
    biometric_message: "Buka lebih cepat dengan Face ID atau Sidik Jari. Tersedia di Premium.",
    cloud_sync_message: "Backup otomatis ke cloud dengan Premium",
    export_message: "Ekspor vault kamu dengan Premium",

    // Pricing
    price_idr: "Rp 49.000",
    price_usd: "$3.49",
    lifetime_access: "Akses Seumur Hidup",
    one_time_purchase: "Beli Sekali, Pakai Selamanya",

    // Benefits
    benefit_unlimited: "Item vault tak terbatas",
    benefit_categories: "Kategori kustom",
    benefit_fields: "Field kustom tak terbatas",
    benefit_biometric: "Unlock dengan Face ID/Sidik Jari",
    benefit_sync: "Sinkronisasi cloud otomatis",
    benefit_export: "Ekspor vault (CSV/JSON)",
    benefit_generator: "Generator password lanjutan",
    benefit_updates: "Update prioritas",

    // Screen
    title: "Upgrade ke Premium",
    subtitle: "Buka semua fitur dan dapatkan pengalaman terbaik",
    current_plan: "Plan Saat Ini",
    free_plan: "Free",
    premium_plan: "Premium",
    upgrade_button: "Upgrade Sekarang",
    restore_purchase: "Pulihkan Pembelian",

    // Status
    loading: "Memuat...",
    processing: "Memproses pembelian...",
    success: "Berhasil! Selamat datang di Premium",
    error: "Gagal melakukan pembelian",
    already_premium: "Kamu sudah Premium!",
  },

  // ── Maintenance ─────────────────────────────────────────────
  maintenance: {
    title: "Sedang Pemeliharaan",
    message: "Kami sedang melakukan pemeliharaan.\nSilakan coba lagi dalam beberapa saat.",
    retry: "Coba Lagi",
    status: "Status Sistem",
  },
} as const;
