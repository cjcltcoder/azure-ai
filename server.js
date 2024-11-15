const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

//Configs from Azure
const AZURE_CV_ENDPOINT = process.env.AZURE_CV_ENDPOINT;
const AZURE_CV_KEY = process.env.AZURE_CV_KEY;

//Multer middleware to upload images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir);

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed!"), false);
    }
    cb(null, true);
  },
});

//Route for uploading and analyzing image
app.post("/image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded!" });
  }

  try {
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);

    const response = await axios.post(
      `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Categories,Description,Tags`,
      imageBuffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_CV_KEY,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    //Clean uploaded file
    fs.unlinkSync(filePath);

    //Return image analysis to client
    res.json(response.data);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Error in analyzing the image" });
  }
});

//Route to analyze image from a link
app.post("/link", async (req, res) => {
  const { imageURL } = req.body;
  if (!imageURL) {
    return res.status(400).json({ error: "Image URL is required" });
  }
  try {
    const response = await axios.post(
      `${AZURE_CV_ENDPOINT}/vision/v3.2/analyze`,
      {
        url: imageURL,
      },
      {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_CV_KEY,
          "Content-Type": "application/json",
        },
        params: {
          visualFeatures: "Categories,Description,Color",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error with analyzing the image: ",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error with analyzing the image" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
