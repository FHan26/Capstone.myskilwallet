import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Booking from '../models/Booking.js';
import { ApiError, assertObjectId, asyncHandler, escapeRegex, pick, sendSuccess } from '../utils/http.js';

const FARM_FIELDS = ['farmName', 'location', 'city', 'farmSize', 'areaUnit', 'irrigationMethod', 'soilType', 'notes'];
const SOIL_FIELDS = ['recordDate', 'ph', 'moisture', 'fertility', 'observation'];

/** Mengambil kebun milik user yang sedang login; 404 bila bukan miliknya (tidak membocorkan keberadaan data). */
export async function findOwnFarm(id, userId) {
  assertObjectId(id, 'ID kebun');
  const farm = await Farm.findOne({ _id: id, userId });
  if (!farm) throw new ApiError(404, 'Kebun tidak ditemukan.');
  return farm;
}

/** GET /api/farms?q=&irrigationMethod= */
export const listFarms = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ farmName: rx }, { location: rx }, { city: rx }];
  }
  if (req.query.irrigationMethod) filter.irrigationMethod = String(req.query.irrigationMethod);
  const farms = await Farm.find(filter).sort({ createdAt: -1 }).lean();
  const counts = await Crop.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: '$farmId', total: { $sum: 1 }, active: { $sum: { $cond: [{ $ne: ['$status', 'Selesai Panen'] }, 1, 0] } } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [c._id.toString(), c]));
  sendSuccess(res, {
    data: farms.map((f) => ({ ...f, cropCount: map[f._id]?.total || 0, activeCropCount: map[f._id]?.active || 0 })),
  });
});

/** GET /api/farms/:id */
export const getFarm = asyncHandler(async (req, res) => {
  const farm = await findOwnFarm(req.params.id, req.user._id);
  const crops = await Crop.find({ farmId: farm._id, userId: req.user._id }).select('-activityHistory').sort({ plantingDate: -1 }).lean();
  sendSuccess(res, { data: { ...farm.toObject(), crops } });
});

/** POST /api/farms */
export const createFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.create({ ...pick(req.body, FARM_FIELDS), userId: req.user._id });
  sendSuccess(res, { status: 201, data: farm, message: 'Kebun berhasil ditambahkan.' });
});

/** PUT /api/farms/:id */
export const updateFarm = asyncHandler(async (req, res) => {
  const farm = await findOwnFarm(req.params.id, req.user._id);
  Object.assign(farm, pick(req.body, FARM_FIELDS));
  await farm.save();
  sendSuccess(res, { data: farm, message: 'Data kebun berhasil diperbarui.' });
});

/** DELETE /api/farms/:id - menghapus kebun beserta data tanamannya. */
export const deleteFarm = asyncHandler(async (req, res) => {
  const farm = await findOwnFarm(req.params.id, req.user._id);
  const { deletedCount } = await Crop.deleteMany({ farmId: farm._id, userId: req.user._id });
  await Booking.updateMany({ farmId: farm._id, userId: req.user._id }, { $unset: { farmId: 1 }, $set: { location: `${farm.farmName} - ${farm.location}` } });
  await farm.deleteOne();
  sendSuccess(res, { data: { deletedCrops: deletedCount }, message: `Kebun "${farm.farmName}" berhasil dihapus.` });
});

/** POST /api/farms/:id/soil-records */
export const addSoilRecord = asyncHandler(async (req, res) => {
  const farm = await findOwnFarm(req.params.id, req.user._id);
  const data = pick(req.body, SOIL_FIELDS);
  if (data.ph === '' || data.ph === null) delete data.ph;
  if (!data.moisture) delete data.moisture;
  if (data.recordDate && new Date(data.recordDate) > new Date()) throw new ApiError(400, 'Tanggal pengamatan tidak boleh di masa depan.', { recordDate: 'Tanggal pengamatan tidak boleh di masa depan.' });
  farm.soilRecords.push(data);
  await farm.save();
  sendSuccess(res, { status: 201, data: farm, message: 'Catatan kondisi tanah berhasil disimpan.' });
});

/** DELETE /api/farms/:id/soil-records/:recordId */
export const deleteSoilRecord = asyncHandler(async (req, res) => {
  const farm = await findOwnFarm(req.params.id, req.user._id);
  const record = farm.soilRecords.id(req.params.recordId);
  if (!record) throw new ApiError(404, 'Catatan tanah tidak ditemukan.');
  record.deleteOne();
  await farm.save();
  sendSuccess(res, { data: farm, message: 'Catatan kondisi tanah dihapus.' });
});

