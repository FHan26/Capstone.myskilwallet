import CropInformation from '../models/CropInformation.js';
import { ApiError, assertObjectId, asyncHandler, buildPagination, escapeRegex, getPagination, pick, sendSuccess } from '../utils/http.js';

const FIELDS = ['cropName', 'scientificName', 'category', 'description', 'imageUrl', 'growingConditions', 'soilRequirements', 'plantingGuidance', 'growthStages', 'commonPests', 'careGuidance', 'estimatedGrowingPeriod', 'harvestPeriod'];

function sanitize(body) {
  const data = pick(body, FIELDS);
  if (data.growthStages && !Array.isArray(data.growthStages)) throw new ApiError(400, 'Tahapan pertumbuhan harus berupa daftar.');
  if (data.growthStages) data.growthStages = data.growthStages.map((s) => String(s).trim()).filter(Boolean).slice(0, 20);
  if (data.commonPests && !Array.isArray(data.commonPests)) throw new ApiError(400, 'Data hama/penyakit harus berupa daftar.');
  if (data.commonPests) {
    data.commonPests = data.commonPests
      .filter((p) => p && String(p.name || '').trim())
      .slice(0, 30)
      .map((p) => pick(p, ['name', 'type', 'symptoms', 'prevention', 'treatment']));
  }
  if (data.careGuidance) data.careGuidance = pick(data.careGuidance, ['watering', 'fertilization']);
  return data;
}

/** GET /api/crop-information?q=&category=&page=&limit= (publik) */
export const listCropInfo = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 12);
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ cropName: rx }, { description: rx }, { 'commonPests.name': rx }];
  }
  if (req.query.category) filter.category = String(req.query.category);
  const [items, total] = await Promise.all([
    CropInformation.find(filter).sort({ cropName: 1 }).skip(skip).limit(limit).lean(),
    CropInformation.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, pagination: buildPagination(page, limit, total) });
});

/** GET /api/crop-information/pests?q= - daftar hama & penyakit dari seluruh data tanaman */
export const listPests = asyncHandler(async (req, res) => {
  const items = await CropInformation.find({}, 'cropName category commonPests').sort({ cropName: 1 }).lean();
  const rx = req.query.q ? new RegExp(escapeRegex(req.query.q), 'i') : null;
  const pests = items.flatMap((c) => (c.commonPests || []).map((p) => ({ ...p, cropId: c._id, cropName: c.cropName })))
    .filter((p) => !rx || rx.test(p.name) || rx.test(p.cropName) || rx.test(p.symptoms || ''))
    .filter((p) => !req.query.type || p.type === req.query.type);
  sendSuccess(res, { data: pests });
});

/** GET /api/crop-information/:id */
export const getCropInfo = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID informasi tanaman');
  const item = await CropInformation.findById(req.params.id).lean();
  if (!item) throw new ApiError(404, 'Informasi tanaman tidak ditemukan.');
  sendSuccess(res, { data: item });
});

/** POST /api/crop-information (admin) */
export const createCropInfo = asyncHandler(async (req, res) => {
  const item = await CropInformation.create(sanitize(req.body));
  sendSuccess(res, { status: 201, data: item, message: 'Informasi tanaman berhasil ditambahkan.' });
});

/** PUT /api/crop-information/:id (admin) */
export const updateCropInfo = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID informasi tanaman');
  const item = await CropInformation.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Informasi tanaman tidak ditemukan.');
  Object.assign(item, sanitize(req.body));
  item.isDemoData = false; // telah ditinjau/diubah admin
  await item.save();
  sendSuccess(res, { data: item, message: 'Informasi tanaman berhasil diperbarui.' });
});

/** DELETE /api/crop-information/:id (admin) */
export const deleteCropInfo = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID informasi tanaman');
  const item = await CropInformation.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Informasi tanaman tidak ditemukan.');
  sendSuccess(res, { message: `Informasi "${item.cropName}" berhasil dihapus.` });
});

