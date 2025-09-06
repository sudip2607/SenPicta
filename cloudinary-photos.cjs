const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/api/cloudinary-photos', async (req, res) => {
  try {
    const folder = req.query.folder || '';
    let expression = 'resource_type:image';
    if (folder && folder !== 'all') {
      expression += ` AND folder:${folder}`;
    }
    const { resources } = await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(60)
      .execute();

    const images = resources.map(img => ({
      id: img.asset_id,
      image_url: img.secure_url,
      title: img.public_id.split('/').pop(),
      description: img.context?.custom?.caption || '',
      genre: img.folder || '',
      uploaded_at: img.created_at,
    }));

    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Cloudinary API running on http://localhost:${PORT}/api/cloudinary-photos`));