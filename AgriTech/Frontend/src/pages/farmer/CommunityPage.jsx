import { useState, useEffect } from 'react';
import api from '../../api/client';
import { FiUsers, FiMessageSquare, FiPlus, FiSend } from 'react-icons/fi';

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Tanya Ahli',
  });

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/discussions');
      if (res.data?.success) {
        setDiscussions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/discussions', formData);
      setShowModal(false);
      setFormData({ title: '', content: '', category: 'Tanya Ahli' });
      fetchDiscussions();
    } catch (err) {
      alert(err?.response?.data?.message || 'Gagal memposting pertanyaan');
    }
  };

  return (
    <div className="stack">
      <div className="row-between">
        <div>
          <h1>Konsultasi & Komunitas Petani</h1>
          <p className="text-muted">Ruang berbagi pengalaman, solusi penyakit tanaman, dan konsultasi budidaya.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <FiPlus /> Buat Pertanyaan Baru
        </button>
      </div>

      <div className="alert alert-info">
        <FiUsers />
        <div>
          <strong>Catatan Demonstrasi:</strong> Layanan tanya ahli pada platform saat ini merupakan sarana demonstrasi request-submission dan ruang diskusi antar anggota komunitas.
        </div>
      </div>

      {loading ? (
        <div className="loader-block">
          <div className="spinner" />
          <span>Memuat forum diskusi...</span>
        </div>
      ) : discussions.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon"><FiMessageSquare /></div>
          <h3>Belum Ada Topik Diskusi</h3>
          <p>Jadilah yang pertama mengajukan pertanyaan atau memulai diskusi budidaya.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Buat Pertanyaan Pertama
          </button>
        </div>
      ) : (
        <div className="stack">
          {discussions.map((d) => (
            <div key={d._id} className="card stack">
              <div className="row-between">
                <div>
                  <h3 style={{ margin: 0 }}>{d.title}</h3>
                  <span className="text-xs text-muted">
                    Ditanyakan oleh <strong>{d.userId?.name || 'Petani'}</strong> • {new Date(d.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <span className="badge badge-outline">{d.category}</span>
              </div>

              <p className="text-muted" style={{ fontSize: '0.92rem', margin: 0 }}>
                {d.content}
              </p>

              <div className="row-between" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <span className="text-xs text-soft">
                  <FiMessageSquare /> {d.replyCount || 0} Tanggapan
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Buat Topik */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Tulis Pertanyaan / Topik Diskusi</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body stack">
                <div className="field">
                  <label>Kategori Diskusi</label>
                  <select
                    className="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Tanya Ahli">Tanya Ahli</option>
                    <option value="Diskusi Umum">Diskusi Umum</option>
                    <option value="Hama dan Penyakit">Hama dan Penyakit</option>
                    <option value="Budidaya">Budidaya</option>
                    <option value="Pemasaran Hasil">Pemasaran Hasil</option>
                    <option value="Teknologi Pertanian">Teknologi Pertanian</option>
                  </select>
                </div>

                <div className="field">
                  <label>Judul Pertanyaan <span className="req">*</span></label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: Daun cabai menguning dan keriting di musim hujan"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Detail Kendala / Pertanyaan <span className="req">*</span></label>
                  <textarea
                    className="textarea"
                    placeholder="Jelaskan kondisi tanaman, gejala, varietas yang ditanam, dan upaya yang sudah dicoba..."
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiSend /> Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
