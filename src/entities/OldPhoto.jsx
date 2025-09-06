{
  "name": "Photo",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Photo title"
    },
    "description": {
      "type": "string",
      "description": "Photo description"
    },
    "image_url": {
      "type": "string",
      "description": "URL to the photo"
    },
    "category": {
      "type": "string",
      "enum": [
        "portrait",
        "wedding",
        "landscape",
        "street",
        "commercial",
        "fashion"
      ],
      "description": "Photo category"
    },
    "location": {
      "type": "string",
      "description": "Where the photo was taken"
    },
    "camera_settings": {
      "type": "string",
      "description": "Camera settings used"
    },
    "featured": {
      "type": "boolean",
      "default": false,
      "description": "Whether this photo is featured"
    }
  },
  "required": [
    "title",
    "image_url",
    "category"
  ]
}