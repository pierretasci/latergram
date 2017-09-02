const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../tmp/uploads'));
    },
    filename: (req, file, cb) => {
      let extension = '';
      switch (file.mimetype) {
        case 'image/png': {
          extension = '.png';
          break;
        }
        case 'image/jpeg': {
          extension = '.jpg';
          break;
        }
        default:
          cb(new Error('Could not understand mimetype'));
      }

      cb(null, `${file.fieldname}-${Date.now()}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' || file.mimetype !== 'image/jpeg') {
      cb(null, false);
    }
    cb(null, true);
  },
});
