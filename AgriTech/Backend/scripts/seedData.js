/**
 * DATA DEMONSTRASI AWAL.
 * Seluruh data di bawah ini hanya contoh untuk keperluan demonstrasi dan pengembangan.
 * Informasi budidaya bersifat umum dan perlu diverifikasi/diganti dengan sumber resmi
 * (mis. Kementerian Pertanian, BPTP, atau penyuluh setempat) sebelum dipakai di produksi.
 * Harga produk dan layanan adalah angka fiktif.
 */

export const cropInformation = [
  {
    cropName: 'Padi',
    scientificName: 'Oryza sativa',
    category: 'Tanaman Pangan',
    description: 'Padi adalah tanaman pangan utama di Indonesia yang menghasilkan beras. Dapat dibudidayakan di lahan sawah irigasi maupun lahan kering (padi gogo).',
    growingConditions: 'Tumbuh baik di dataran rendah hingga menengah (0–1.500 mdpl), suhu sekitar 22–30°C, dengan penyinaran matahari penuh dan ketersediaan air yang cukup.',
    soilRequirements: 'Tanah berlumpur yang subur dengan lapisan olah 18–22 cm dan pH sekitar 5,5–7,0. Tanah liat atau lempung berliat menahan air dengan baik.',
    plantingGuidance: 'Semai benih bermutu selama 15–21 hari, olah tanah dan genangi lahan, lalu pindah tanam bibit dengan jarak tanam misalnya 25 x 25 cm atau sistem jajar legowo.',
    growthStages: ['Persemaian (0–21 hari)', 'Vegetatif: anakan aktif (21–55 HST)', 'Generatif: primordia hingga berbunga (55–85 HST)', 'Pemasakan: masak susu hingga masak penuh (85–115 HST)'],
    commonPests: [
      { name: 'Wereng Batang Cokelat', type: 'Hama', symptoms: 'Tanaman menguning lalu mengering seperti terbakar (hopperburn), biasanya berkelompok.', prevention: 'Tanam serempak, gunakan varietas tahan, hindari pemupukan nitrogen berlebih.', treatment: 'Pantau populasi secara rutin; bila melewati ambang ekonomi, konsultasikan pengendalian dengan penyuluh dan gunakan insektisida terdaftar sesuai label.' },
      { name: 'Blas', type: 'Penyakit', symptoms: 'Bercak berbentuk belah ketupat berwarna abu-abu dengan tepi cokelat pada daun; leher malai dapat membusuk.', prevention: 'Gunakan benih sehat dan varietas tahan, atur jarak tanam, hindari nitrogen berlebih.', treatment: 'Buang bagian tanaman yang terinfeksi berat dan gunakan fungisida terdaftar sesuai anjuran penyuluh.' },
    ],
    careGuidance: {
      watering: 'Pertahankan genangan dangkal 2–5 cm pada fase vegetatif. Pengairan berselang (basah-kering) dapat menghemat air. Keringkan lahan sekitar 10–14 hari sebelum panen.',
      fertilization: 'Gunakan pupuk berimbang sesuai hasil uji tanah. Pupuk N umumnya diberikan bertahap (misal 3 kali) pada awal tanam, fase anakan, dan menjelang primordia.',
    },
    estimatedGrowingPeriod: '100–125 hari setelah semai (tergantung varietas)',
    harvestPeriod: 'Panen saat sekitar 90–95% gabah telah menguning.',
    isDemoData: true,
  },
  {
    cropName: 'Jagung',
    scientificName: 'Zea mays',
    category: 'Tanaman Pangan',
    description: 'Jagung merupakan sumber karbohidrat dan bahan pakan ternak yang banyak ditanam di lahan kering maupun sawah setelah padi.',
    growingConditions: 'Membutuhkan sinar matahari penuh, suhu sekitar 21–34°C, dan curah hujan merata selama pertumbuhan.',
    soilRequirements: 'Tanah gembur, subur, berdrainase baik dengan pH sekitar 5,6–7,5.',
    plantingGuidance: 'Tanam benih langsung 1–2 butir per lubang sedalam 3–5 cm dengan jarak tanam misalnya 75 x 20 cm.',
    growthStages: ['Perkecambahan (0–7 HST)', 'Vegetatif (7–50 HST)', 'Pembungaan & penyerbukan (50–65 HST)', 'Pengisian & pemasakan biji (65–100 HST)'],
    commonPests: [
      { name: 'Ulat Grayak Jagung (Spodoptera frugiperda)', type: 'Hama', symptoms: 'Daun berlubang tidak beraturan, terdapat kotoran seperti serbuk gergaji di pucuk tanaman.', prevention: 'Tanam serempak, rotasi tanaman, dan pemantauan sejak awal tanam.', treatment: 'Kumpulkan dan musnahkan kelompok telur/larva; gunakan agens hayati atau insektisida terdaftar sesuai anjuran.' },
      { name: 'Bulai', type: 'Penyakit', symptoms: 'Daun bergaris klorotik putih-kekuningan dan tanaman kerdil.', prevention: 'Gunakan benih bermutu dan varietas tahan, cabut tanaman terinfeksi.', treatment: 'Musnahkan tanaman sakit untuk mencegah penyebaran; konsultasikan dengan penyuluh.' },
    ],
    careGuidance: {
      watering: 'Kebutuhan air paling kritis pada fase pembungaan dan pengisian biji. Hindari genangan.',
      fertilization: 'Pupuk dasar saat tanam, lalu pemupukan susulan sekitar 21–30 HST dan 40–45 HST sesuai rekomendasi setempat.',
    },
    estimatedGrowingPeriod: '90–110 hari',
    harvestPeriod: 'Panen saat kelobot mengering dan biji keras dengan lapisan hitam (black layer) di pangkal biji.',
    isDemoData: true,
  },
  {
    cropName: 'Cabai Merah',
    scientificName: 'Capsicum annuum',
    category: 'Sayuran',
    description: 'Cabai merah adalah komoditas hortikultura bernilai ekonomi tinggi dengan permintaan yang stabil.',
    growingConditions: 'Dapat ditanam di dataran rendah hingga tinggi, suhu sekitar 24–28°C, membutuhkan sinar matahari penuh.',
    soilRequirements: 'Tanah gembur, kaya bahan organik, berdrainase baik dengan pH sekitar 6,0–7,0. Penggunaan mulsa plastik dianjurkan.',
    plantingGuidance: 'Semai benih 25–30 hari, siapkan bedengan bermulsa, pindah tanam bibit berdaun 4–5 helai dengan jarak sekitar 60 x 60 cm.',
    growthStages: ['Persemaian (0–30 hari)', 'Vegetatif (30–60 HST)', 'Pembungaan (60–75 HST)', 'Pembuahan & panen bertahap (75–180 HST)'],
    commonPests: [
      { name: 'Thrips', type: 'Hama', symptoms: 'Daun keriting ke atas dan berwarna keperakan.', prevention: 'Gunakan mulsa perak, perangkap lekat biru, sanitasi gulma.', treatment: 'Gunakan insektisida terdaftar secara bergilir bila populasi tinggi.' },
      { name: 'Antraknosa (Patek)', type: 'Penyakit', symptoms: 'Bercak cekung kehitaman pada buah yang meluas dan membusuk.', prevention: 'Gunakan benih sehat, jarak tanam cukup, petik dan musnahkan buah sakit.', treatment: 'Aplikasikan fungisida terdaftar sesuai dosis anjuran.' },
    ],
    careGuidance: {
      watering: 'Jaga kelembapan tanah tetap stabil; hindari kekeringan saat pembungaan dan genangan di bedengan.',
      fertilization: 'Pupuk dasar organik + NPK, dilanjutkan pemupukan susulan berkala sesuai fase pertumbuhan.',
    },
    estimatedGrowingPeriod: '75–90 hari hingga panen pertama',
    harvestPeriod: 'Panen bertahap setiap 3–7 hari selama beberapa bulan.',
    isDemoData: true,
  },
  {
    cropName: 'Tomat',
    scientificName: 'Solanum lycopersicum',
    category: 'Sayuran',
    description: 'Tomat dapat dikonsumsi segar maupun diolah, dan cocok dibudidayakan di lahan terbuka atau rumah tanam.',
    growingConditions: 'Suhu optimal sekitar 20–27°C, sinar matahari penuh, kelembapan udara tidak terlalu tinggi.',
    soilRequirements: 'Tanah lempung berpasir yang gembur dan subur, pH sekitar 5,5–7,0.',
    plantingGuidance: 'Semai 3–4 minggu, pindah tanam ke bedengan bermulsa dengan jarak sekitar 60 x 50 cm, pasang ajir sebagai penopang.',
    growthStages: ['Persemaian (0–25 hari)', 'Vegetatif (25–45 HST)', 'Pembungaan (45–60 HST)', 'Pembuahan & pemasakan (60–100 HST)'],
    commonPests: [
      { name: 'Kutu Kebul', type: 'Hama', symptoms: 'Serangga putih kecil di bawah daun; dapat menularkan virus kuning keriting.', prevention: 'Gunakan perangkap lekat kuning dan tanaman pembatas.', treatment: 'Kendalikan populasi dengan agens hayati atau insektisida terdaftar.' },
      { name: 'Busuk Daun (Late Blight)', type: 'Penyakit', symptoms: 'Bercak basah kecokelatan pada daun dan batang, cepat meluas saat lembap.', prevention: 'Atur jarak tanam, pangkas daun bawah, hindari penyiraman dari atas.', treatment: 'Gunakan fungisida terdaftar sesuai anjuran dan buang bagian terinfeksi.' },
    ],
    careGuidance: {
      watering: 'Siram secara teratur di pangkal tanaman; kelembapan yang tidak stabil dapat menyebabkan buah pecah.',
      fertilization: 'Pupuk organik saat olah tanah, NPK berimbang, serta tambahan kalium saat pembuahan.',
    },
    estimatedGrowingPeriod: '60–90 hari setelah pindah tanam',
    harvestPeriod: 'Panen saat buah mulai berubah warna; dapat dipanen 2–3 kali seminggu.',
    isDemoData: true,
  },
  {
    cropName: 'Kedelai',
    scientificName: 'Glycine max',
    category: 'Tanaman Pangan',
    description: 'Kedelai adalah sumber protein nabati utama untuk tahu dan tempe, sering ditanam setelah padi sawah.',
    growingConditions: 'Suhu sekitar 23–30°C dengan curah hujan cukup pada awal pertumbuhan dan cuaca kering menjelang panen.',
    soilRequirements: 'Tanah gembur berdrainase baik, pH sekitar 5,8–7,0.',
    plantingGuidance: 'Tanam 2–3 benih per lubang dengan jarak sekitar 40 x 15 cm. Inokulasi rhizobium dapat membantu fiksasi nitrogen.',
    growthStages: ['Perkecambahan (0–7 HST)', 'Vegetatif (7–35 HST)', 'Pembungaan (35–50 HST)', 'Pengisian polong & pemasakan (50–85 HST)'],
    commonPests: [
      { name: 'Ulat Penggerek Polong', type: 'Hama', symptoms: 'Polong berlubang dan biji rusak.', prevention: 'Tanam serempak dan rotasi tanaman.', treatment: 'Pemantauan berkala dan pengendalian sesuai anjuran penyuluh.' },
      { name: 'Karat Daun', type: 'Penyakit', symptoms: 'Bercak kecil cokelat kemerahan di permukaan bawah daun.', prevention: 'Gunakan varietas tahan dan atur waktu tanam.', treatment: 'Aplikasi fungisida terdaftar bila serangan meluas.' },
    ],
    careGuidance: {
      watering: 'Butuh air cukup saat perkecambahan, pembungaan, dan pengisian polong; hindari genangan.',
      fertilization: 'Kebutuhan nitrogen relatif rendah; fokus pada fosfor dan kalium sesuai uji tanah.',
    },
    estimatedGrowingPeriod: '75–90 hari',
    harvestPeriod: 'Panen saat sebagian besar polong berwarna cokelat dan daun telah rontok.',
    isDemoData: true,
  },
];

export const products = [
  { productName: 'Benih Padi Inpari 32 (5 kg)', category: 'Benih dan Bibit', price: 75000, stock: 120, unit: 'kantong', description: 'Benih padi bersertifikat untuk lahan sawah irigasi. (Data demonstrasi)' },
  { productName: 'Benih Jagung Hibrida (1 kg)', category: 'Benih dan Bibit', price: 95000, stock: 80, unit: 'kantong', description: 'Benih jagung hibrida dengan daya tumbuh tinggi. (Data demonstrasi)' },
  { productName: 'Bibit Cabai Merah (isi 50)', category: 'Benih dan Bibit', price: 40000, stock: 60, unit: 'paket', description: 'Bibit cabai merah siap tanam umur ±25 hari. (Data demonstrasi)' },
  { productName: 'Pupuk NPK 16-16-16 (25 kg)', category: 'Pupuk', price: 285000, stock: 45, unit: 'karung', description: 'Pupuk majemuk berimbang untuk berbagai tanaman. (Data demonstrasi)' },
  { productName: 'Pupuk Organik Kompos (20 kg)', category: 'Pupuk', price: 45000, stock: 200, unit: 'karung', description: 'Kompos matang untuk memperbaiki struktur tanah. (Data demonstrasi)' },
  { productName: 'Pestisida Nabati Ekstrak Mimba (1 L)', category: 'Pestisida dan Proteksi Tanaman', price: 65000, stock: 35, unit: 'botol', description: 'Pestisida nabati untuk membantu mengendalikan hama ringan. Gunakan sesuai label. (Data demonstrasi)' },
  { productName: 'Perangkap Lekat Kuning (isi 10)', category: 'Pestisida dan Proteksi Tanaman', price: 30000, stock: 8, unit: 'paket', description: 'Perangkap serangga untuk pemantauan kutu kebul dan hama terbang. (Data demonstrasi)' },
  { productName: 'Cangkul Baja', category: 'Peralatan Pertanian', price: 120000, stock: 25, unit: 'unit', description: 'Cangkul baja dengan gagang kayu kuat. (Data demonstrasi)' },
  { productName: 'Sprayer Elektrik 16 L', category: 'Peralatan Pertanian', price: 650000, stock: 10, unit: 'unit', description: 'Alat semprot tangki 16 liter dengan baterai isi ulang. (Data demonstrasi)' },
  { productName: 'Selang Irigasi Tetes (50 m)', category: 'Perlengkapan Irigasi', price: 180000, stock: 0, unit: 'rol', description: 'Selang irigasi tetes untuk bedengan sayuran. (Data demonstrasi)' },
];

export const services = [
  { name: 'Sewa Traktor Tangan', category: 'Sewa Alat Pertanian', description: 'Penyewaan traktor tangan beserta operator untuk pengolahan lahan. (Data demonstrasi)', estimatedPrice: 350000, priceUnit: 'per hari' },
  { name: 'Sewa Pompa Air', category: 'Sewa Alat Pertanian', description: 'Penyewaan pompa air untuk pengairan lahan saat musim kemarau. (Data demonstrasi)', estimatedPrice: 100000, priceUnit: 'per hari' },
  { name: 'Konsultasi Ahli Budidaya', category: 'Konsultasi Ahli', description: 'Pengajuan jadwal konsultasi budidaya. Fitur demonstrasi: belum terhubung dengan ahli pertanian sungguhan.', estimatedPrice: 0, priceUnit: 'per sesi' },
  { name: 'Konsultasi Hama & Penyakit', category: 'Konsultasi Ahli', description: 'Pengajuan kunjungan untuk identifikasi hama/penyakit. Fitur demonstrasi.', estimatedPrice: 0, priceUnit: 'per kunjungan' },
  { name: 'Bantuan Tenaga Panen', category: 'Bantuan Pertanian', description: 'Pengajuan bantuan tenaga kerja saat panen. (Data demonstrasi)', estimatedPrice: 150000, priceUnit: 'per orang/hari' },
];

export const articles = [
  {
    title: 'Mengenal Pengairan Berselang untuk Menghemat Air di Sawah',
    category: 'Budidaya',
    summary: 'Teknik pengairan basah-kering yang dapat membantu efisiensi air tanpa mengorbankan pertumbuhan padi.',
    content: 'Pengairan berselang (alternate wetting and drying) adalah teknik mengairi sawah secara bergantian antara kondisi tergenang dan kering.\n\nLangkah umum:\n1. Genangi lahan sekitar 3–5 cm.\n2. Biarkan air surut hingga permukaan tanah mulai kering.\n3. Genangi kembali.\n\nPertahankan genangan saat fase pembungaan. Sesuaikan penerapan dengan kondisi lahan dan anjuran penyuluh setempat.\n\n(Artikel demonstrasi — mohon verifikasi dengan sumber resmi.)',
    status: 'Terbit',
    isDemoData: true,
  },
  {
    title: 'Pentingnya Uji Tanah Sebelum Memupuk',
    category: 'Pengelolaan Tanah',
    summary: 'Uji tanah membantu petani menentukan jenis dan dosis pupuk yang tepat.',
    content: 'Uji tanah memberikan gambaran kadar unsur hara dan pH tanah. Dengan informasi ini, pemupukan dapat dilakukan lebih tepat sasaran sehingga biaya lebih efisien.\n\nPetani dapat menggunakan perangkat uji tanah sederhana (PUTS) atau mengirim sampel ke laboratorium. Catat hasilnya pada fitur Kondisi Tanah di AgriTech agar riwayatnya mudah dipantau.\n\n(Artikel demonstrasi — mohon verifikasi dengan sumber resmi.)',
    status: 'Terbit',
    isDemoData: true,
  },
  {
    title: 'Pengendalian Hama Terpadu (PHT) secara Sederhana',
    category: 'Pengendalian Hama',
    summary: 'Prinsip PHT: budidaya tanaman sehat, pemantauan rutin, pelestarian musuh alami, dan penggunaan pestisida sebagai pilihan terakhir.',
    content: 'Pengendalian Hama Terpadu (PHT) mengutamakan pencegahan.\n\n- Gunakan benih sehat dan varietas tahan.\n- Lakukan pemantauan hama secara rutin dan catat hasilnya.\n- Lestarikan musuh alami seperti laba-laba dan kepik predator.\n- Gunakan pestisida terdaftar hanya bila populasi hama melewati ambang ekonomi, sesuai label.\n\n(Artikel demonstrasi — mohon verifikasi dengan sumber resmi.)',
    status: 'Terbit',
    isDemoData: true,
  },
];

