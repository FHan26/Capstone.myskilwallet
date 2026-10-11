import { useState, useEffect } from 'react';
import api from '../../api/client';
import { FiSun, FiSearch, FiCloudRain, FiWind, FiCompass } from 'react-icons/fi';

export default function WeatherPage() {
  const [city, setCity] = useState('Karawang');
  const [query, setQuery] = useState('Karawang');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = async (targetCity) => {
    setLoading(true);
    setError('');
    try {
      const [currRes, foreRes] = await Promise.all([
        api.get('/weather/current', { params: { city: targetCity } }),
        api.get('/weather/forecast', { params: { city: targetCity } }),
      ]);
      if (currRes.data?.success) setWeather(currRes.data.data);
      if (foreRes.data?.success) setForecast(foreRes.data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || 
        'Prakiraan cuaca gagal dimuat. Pastikan OPENWEATHER_API_KEY telah diisi di Backend/.env'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setCity(query);
    }
  };

  return (
    <div className="stack">
      <div className="row-between">
        <div>
          <h1>Prakiraan Cuaca Pertanian</h1>
          <p className="text-muted">Pantau kondisi suhu, curah hujan, dan angin untuk menentukan jadwal pemupukan dan panen.</p>
        </div>
      </div>

      <div className="toolbar">
        <form onSubmit={handleSearch} className="input-icon" style={{ maxWidth: 400 }}>
          <FiSearch />
          <input
            type="text"
            className="input"
            placeholder="Ketik nama kota/kabupaten..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <div className="loader-block">
          <div className="spinner" />
          <span>Memuat data cuaca untuk {city}...</span>
        </div>
      ) : error ? (
        <div className="alert alert-warning">
          <FiSun />
          <div>{error}</div>
        </div>
      ) : (
        <>
          {weather && (
            <div className="weather-hero">
              <div>
                <span className="badge badge-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                  Lokasi: {weather.location?.name}, {weather.location?.country}
                </span>
                <div className="weather-temp">{Math.round(weather.temperature)}°C</div>
                <div style={{ fontSize: '1.2rem', textTransform: 'capitalize', color: '#c9d7c7' }}>
                  {weather.description}
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.86rem', color: '#9fb39d' }}>
                  Terasa seperti {Math.round(weather.feelsLike)}°C • Tekanan udara {weather.pressure} hPa
                </p>
              </div>

              {weather.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                  alt="Ikon cuaca"
                  style={{ width: 120, height: 120 }}
                />
              )}
            </div>
          )}

          {/* Metrik Cuaca */}
          {weather && (
            <div className="card weather-metrics">
              <div className="metric">
                <div className="ic"><FiCloudRain /></div>
                <div>
                  <strong>{weather.humidity}%</strong>
                  <span>Kelembapan Udara</span>
                </div>
              </div>
              <div className="metric">
                <div className="ic"><FiWind /></div>
                <div>
                  <strong>{weather.windSpeed} m/s</strong>
                  <span>Kecepatan Angin</span>
                </div>
              </div>
              <div className="metric">
                <div className="ic"><FiCompass /></div>
                <div>
                  <strong>{weather.clouds}%</strong>
                  <span>Tutupan Awan</span>
                </div>
              </div>
              <div className="metric">
                <div className="ic"><FiSun /></div>
                <div>
                  <strong>{Math.round(weather.tempMax)}°C / {Math.round(weather.tempMin)}°C</strong>
                  <span>Suhu Maks / Min</span>
                </div>
              </div>
            </div>
          )}

          {/* Prakiraan 5 Hari */}
          {forecast && forecast.days && (
            <div className="card">
              <div className="card-header">
                <h3>Prakiraan Hari Mendatang</h3>
              </div>
              <div className="forecast">
                {forecast.days.map((d, idx) => (
                  <div key={idx} className="forecast-day">
                    <strong style={{ fontSize: '0.9rem', color: '#1f3d2b' }}>
                      {new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </strong>
                    {d.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                        alt={d.description}
                      />
                    )}
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {Math.round(d.tempMax)}° <span className="text-muted" style={{ fontWeight: 400 }}>{Math.round(d.tempMin)}°</span>
                    </div>
                    <span className="text-xs text-muted" style={{ textTransform: 'capitalize' }}>
                      {d.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
