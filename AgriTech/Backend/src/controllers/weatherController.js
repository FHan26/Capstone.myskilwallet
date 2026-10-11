import { asyncHandler, sendSuccess } from '../utils/http.js';
import { getCurrentWeather, getForecast, isWeatherConfigured } from '../services/weatherService.js';

/** GET /api/weather/status */
export const weatherStatus = (req, res) => sendSuccess(res, { data: { configured: isWeatherConfigured() } });

/** GET /api/weather/current?city= | ?lat=&lon= */
export const currentWeather = asyncHandler(async (req, res) => {
  const { city, lat, lon } = req.query;
  sendSuccess(res, { data: await getCurrentWeather({ city, lat, lon }) });
});

/** GET /api/weather/forecast?city= | ?lat=&lon= */
export const forecastWeather = asyncHandler(async (req, res) => {
  const { city, lat, lon } = req.query;
  sendSuccess(res, { data: await getForecast({ city, lat, lon }) });
});

