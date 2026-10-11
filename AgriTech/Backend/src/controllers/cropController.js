import Crop from '../models/Crop.js';
import { ApiError, assertObjectId, asyncHandler, escapeRegex, pick, sendSuccess } from '../utils/http.js';
import { findOwnFarm } from './farmController.js';

const CROP_FIELDS = ['farmId', 'cropName', 'cropType', 'plantingDate', 'estimatedHarvestDate', 'growthStage', 'status', 'notes'];
const ACTIVITY_FIELDS = ['activityType', 'activityDate', 'description', 'quantity', 'unit'];

async function findOwnCrop(id, userId) {
  assertObjectId(id, 'ID tanaman');
  const crop = await Crop.findOne({ _id: id, userId });
  if (!crop) throw new ApiError(404, 'Data tanaman tidak ditemukan.');
  return crop;
}

function normalize(data) {
  if (data.estimatedHarvestDate === '' || data.estimatedHarvestDate === null) data.estimatedHarvestDate = undefined;
  return data;
}

/** GET /api/crops?q=&status=&farmId= */
export const listCrops = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ cropName: rx }, { cropType: rx }];
  }
  if (req.query.status) filter.status = String(req.query.status);
  if (req.query.farmId) {
    assertObjectId(req.query.farmId, 'ID kebun');
    filter.farmId = req.query.farmId;
  }
  const crops = await Crop.find(filter).populate('farmId', 'farmName location').sort({ createdAt: -1 }).lean();
  sendSuccess(res, {
    data: crops.map(({ activityHistory = [], ...c }) => ({
      ...c,
      activityCount: activityHistory.length,
      lastActivity: activityHistory.slice().sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate))[0] || null,
    })),
  });
});

/** GET /api/crops/:id */
export const getCrop = asyncHandler(async (req, res) => {
  const crop = await findOwnCrop(req.params.id, req.user._id);
  await crop.populate('farmId', 'farmName location city');
  const data = crop.toObject();
  data.activityHistory.sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate));
  sendSuccess(res, { data });
});

/** POST /api/crops */
export const createCrop = asyncHandler(async (req, res) => {
  const data = normalize(pick(req.body, CROP_FIELDS));
  if (!data.farmId) throw new ApiError(400, 'Kebun wajib dipilih.', { farmId: 'Kebun wajib dipilih.' });
  await findOwnFarm(data.farmId, req.user._id); // memastikan kebun milik user
  const crop = await Crop.create({ ...data, userId: req.user._id });
  sendSuccess(res, { status: 201, data: crop, message: 'Tanaman berhasil ditambahkan.' });
});

/** PUT /api/crops/:id */
export const updateCrop = asyncHandler(async (req, res) => {
  const crop = await findOwnCrop(req.params.id, req.user._id);
  const data = normalize(pick(req.body, CROP_FIELDS));
  if (data.farmId && String(data.farmId) !== String(crop.farmId)) await findOwnFarm(data.farmId, req.user._id);
  Object.assign(crop, data);
  await crop.save();
  sendSuccess(res, { data: crop, message: 'Data tanaman berhasil diperbarui.' });
});

/** DELETE /api/crops/:id */
export const deleteCrop = asyncHandler(async (req, res) => {
  const crop = await findOwnCrop(req.params.id, req.user._id);
  await crop.deleteOne();
  sendSuccess(res, { message: `Tanaman "${crop.cropName}" berhasil dihapus.` });
});

/** POST /api/crops/:id/activities */
export const addActivity = asyncHandler(async (req, res) => {
  const crop = await findOwnCrop(req.params.id, req.user._id);
  const data = pick(req.body, ACTIVITY_FIELDS);
  if (data.quantity === '' || data.quantity === null) delete data.quantity;
  if (data.activityDate && new Date(data.activityDate) > new Date(Date.now() + 864e5)) {
    throw new ApiError(400, 'Tanggal aktivitas tidak boleh di masa depan.', { activityDate: 'Tanggal aktivitas tidak boleh di masa depan.' });
  }
  crop.activityHistory.push(data);
  // Pencatatan panen menandai tanaman selesai panen
  if (data.activityType === 'Panen' && req.body.markHarvested) {
    crop.status = 'Selesai Panen';
    crop.growthStage = 'Panen';
  }
  await crop.save();
  sendSuccess(res, { status: 201, data: crop, message: 'Aktivitas berhasil dicatat.' });
});

/** DELETE /api/crops/:id/activities/:activityId */
export const deleteActivity = asyncHandler(async (req, res) => {
  const crop = await findOwnCrop(req.params.id, req.user._id);
  const act = crop.activityHistory.id(req.params.activityId);
  if (!act) throw new ApiError(404, 'Aktivitas tidak ditemukan.');
  act.deleteOne();
  await crop.save();
  sendSuccess(res, { data: crop, message: 'Aktivitas dihapus.' });
});

