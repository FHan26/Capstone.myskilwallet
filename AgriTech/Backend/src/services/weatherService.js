import { ApiError } from '../utils/http.js';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map();

export function isWeatherConfigured() {
  const key = process.env.OPENWEATHER_API_KEY;
  return Boolean(key && key.trim() && key !== 'your_api_key_here');
}

function weatherError(status, message, code) {
  const err = new ApiError(status, message);
  err.errors = { code };
  return err;
}

async function callOpenWeather(path, params) {
  if (!isWeatherConfigured()) {
    throw weatherError(503, 'Layanan cuaca belum dikonfigurasi. Administrator perlu mengisi OPENWEATHER_API_KEY pada server.', 'WEATHER_NOT_CONFIGURED');
  }
  const query = new URLSearchParams({ ...params, units: 'metric', lang: 'id', appid: process.env.OPENWEATHER_API_KEY });
  const cacheKey = `${path}?${new URLSearchParams(params).toString()}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}?${query}`, { signal: AbortSignal.timeout(8000) });
  } catch {
    throw weatherError(502, 'Tidak dapat terhubung ke layanan cuaca. Periksa koneksi internet server lalu coba lagi.', 'WEATHER_UNREACHABLE');
  }
  if (response.status === 401) throw weatherError(502, 'API key OpenWeatherMap tidak valid atau belum aktif.', 'WEATHER_INVALID_KEY');
  if (response.status === 404) throw weatherError(404, 'Lokasi tidak ditemukan. Periksa kembali nama kota.', 'WEATHER_CITY_NOT_FOUND');
  if (response.status === 429) throw weatherError(503, 'Batas permintaan layanan cuaca tercapai. Coba beberapa saat lagi.', 'WEATHER_RATE_LIMIT');
  if (!response.ok) throw weatherError(502, 'Layanan cuaca sedang bermasalah. Coba lagi nanti.', 'WEATHER_UPSTREAM_ERROR');

  const data = await response.json();
  cache.set(cacheKey, { at: Date.now(), data });
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  return data;
}

function locationParams({ city, lat, lon }) {
  if (lat !== undefined && lon !== undefined && lat !== '' && lon !== '') {
    const la = Number(lat);
    const lo = Number(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo) || la < -90 || la > 90 || lo < -180 || lo > 180) {
      throw new ApiError(400, 'Koordinat lokasi tidak valid.');
    }
    return { lat: la.toFixed(4), lon: lo.toFixed(4) };
  }
  const q = String(city || '').trim();
  if (!q) throw new ApiError(400, 'Masukkan nama kota atau izinkan akses lokasi.');
  if (q.length > 80) throw new ApiError(400, 'Nama kota terlalu panjang.');
  return { q };
}

/** Cuaca saat ini dalam format yang sudah dinormalisasi. */
export async function getCurrentWeather(location) {
  const d = await callOpenWeather('/weather', locationParams(location));
  return {
    source: 'OpenWeatherMap',
    location: { name: d.name, country: d.sys?.country, lat: d.coord?.lat, lon: d.coord?.lon },
    temperature: d.main?.temp,
    feelsLike: d.main?.feels_like,
    tempMin: d.main?.temp_min,
    tempMax: d.main?.temp_max,
    humidity: d.main?.humidity,
    pressure: d.main?.pressure,
    windSpeed: d.wind?.speed,
    clouds: d.clouds?.all,
    rain1h: d.rain?.['1h'] || 0,
    description: d.weather?.[0]?.description,
    main: d.weather?.[0]?.main,
    icon: d.weather?.[0]?.icon,
    sunrise: d.sys?.sunrise ? new Date(d.sys.sunrise * 1000) : null,
    sunset: d.sys?.sunset ? new Date(d.sys.sunset * 1000) : null,
    observedAt: new Date(d.dt * 1000),
  };
}

/** Prakiraan 5 hari (interval 3 jam) yang diringkas per hari. */
export async function getForecast(location) {
  const d = await callOpenWeather('/forecast', locationParams(location));
  const days = new Map();
  for (const item of d.list || []) {
    const local = new Date((item.dt + (d.city?.timezone || 0)) * 1000);
    const key = local.toISOString().slice(0, 10);
    const day = days.get(key) || { date: key, tempMin: Infinity, tempMax: -Infinity, humidity: [], pop: 0, rain: 0, icons: {}, descriptions: {} };
    day.tempMin = Math.min(day.tempMin, item.main.temp_min);
    day.tempMax = Math.max(day.tempMax, item.main.temp_max);
    day.humidity.push(item.main.humidity);
    day.pop = Math.max(day.pop, item.pop || 0);
    day.rain += item.rain?.['3h'] || 0;
    const w = item.weather?.[0];
    if (w) {
      day.icons[w.icon.replace('n', 'd')] = (day.icons[w.icon.replace('n', 'd')] || 0) + 1;
      day.descriptions[w.description] = (day.descriptions[w.description] || 0) + 1;
    }
    days.set(key, day);
  }
  const top = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0];
  return {
    source: 'OpenWeatherMap',
    location: { name: d.city?.name, country: d.city?.country },
    days: [...days.values()].slice(0, 6).map((x) => ({
      date: x.date,
      tempMin: Math.round(x.tempMin * 10) / 10,
      tempMax: Math.round(x.tempMax * 10) / 10,
      humidity: Math.round(x.humidity.reduce((a, b) => a + b, 0) / x.humidity.length),
      rainChance: Math.round(x.pop * 100),
      rainMm: Math.round(x.rain * 10) / 10,
      icon: top(x.icons),
      description: top(x.descriptions),
    })),
  };
}

