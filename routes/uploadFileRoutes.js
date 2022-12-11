const requireLogin = require('../middlewares/requireLogin');
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');
const keys = require('../config/keys');
const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});

module.exports = (app) => {
  app.get('/api/upload', requireLogin, (req, res) => {
    // File name format: userId/randomkeys.jpeg
    const fileName = `${req.user.id}/${uuid()}.jpeg`;
    const uploadedFileUrl = `https://${keys.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: keys.BUCKET_NAME,
        ContentType: 'image/jpeg',
        Key: fileName,
      },
      (err, url) => {
        if (err) {
          res.status(422).send({ error: err });
        }
        console.log('url', url);
        res.send({ uploadedFileUrl, url });
      }
    );
  });
};

// AWS S3 Bucket CORS Configuration:
// [
//   {
//       "AllowedHeaders": [
//           "*"
//       ],
//       "AllowedMethods": [
//           "PUT",
//           "POST",
//           "DELETE"
//       ],
//       "AllowedOrigins": [
//           "*"
//       ],
//       "ExposeHeaders": [],
//       "MaxAgeSeconds": 3000
//   }
// ]
