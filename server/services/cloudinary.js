const cloudinary = require('cloudinary').v2;

const REQUIRED_ENV = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const ALLOWED_FOLDERS = new Set([
  'balochdev/blog',
  'balochdev/members',
  'balochdev/site',
  'balochdev/ads',
]);

function validateConfig() {
  const missing = REQUIRED_ENV.filter((key) => !String(process.env[key] || '').trim());
  if (missing.length) {
    console.error('[cloudinary] Missing required environment variables:');
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error('[cloudinary] Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET before starting the server.');
    process.exit(1);
  }
}

validateConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * @param {Buffer} fileBuffer
 * @param {{ folder?: string, publicId?: string }} options
 * @returns {Promise<{ secureUrl: string, publicId: string, width: number, height: number, format: string }>}
 */
function uploadImage(fileBuffer, { folder, publicId } = {}) {
  if (!fileBuffer?.length) {
    return Promise.reject(new Error('Empty file buffer'));
  }
  if (!folder || !ALLOWED_FOLDERS.has(folder)) {
    return Promise.reject(new Error(`Invalid folder. Allowed: ${[...ALLOWED_FOLDERS].join(', ')}`));
  }

  const options = {
    folder,
    resource_type: 'image',
  };
  if (publicId) options.public_id = publicId;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({
        secureUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    });
    stream.end(fileBuffer);
  });
}

/**
 * @param {string} publicId
 */
async function deleteImage(publicId) {
  if (!publicId?.trim()) {
    throw new Error('publicId is required');
  }
  return cloudinary.uploader.destroy(publicId.trim());
}

/**
 * @param {string} publicId
 * @returns {string}
 */
function optimizedUrl(publicId) {
  if (!publicId?.trim()) {
    throw new Error('publicId is required');
  }
  return cloudinary.url(publicId.trim(), {
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  });
}

module.exports = {
  uploadImage,
  deleteImage,
  optimizedUrl,
  ALLOWED_FOLDERS,
};
