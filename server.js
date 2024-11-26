const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

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

// Setting up Swagger for API Documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Image/URL Analysis APIs",
      version: "1.0.0",
      description: "APIs to upload/provide and analyze images/URLs using Azure Vision Studio",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//Route for uploading and analyzing color in an image
/**
 * @swagger
 * /image/colors:
 *   post:
 *     summary: Upload an image for color analysis
 *     description: Upload an image and get color analysis from Azure Vision Studio.
 *     tags: [Image Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Analysis of the uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 color: {}
 *       400:
 *         description: No file uploaded or invalid input
 *       500:
 *         description: Server error
 */
app.post("/image/colors", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded!" });
  }

  try {
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);

    const response = await axios.post(
      `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Color`,
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
    res.json({
      message: "Colors from the image successfully analyzed",
      colors: response.data.color,
  });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Error in analyzing the image" });
  }
});

//Route for uploading and analyzing categories in an image
/**
 * @swagger
 * /image/categories:
 *   post:
 *     summary: Upload an image for category analysis
 *     description: Upload an image and get category analysis from Azure Vision Studio.
 *     tags: [Image Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Analysis of the uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 categories: []
 *       400:
 *         description: No file uploaded or invalid input
 *       500:
 *         description: Server error
 */
app.post("/image/categories", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded!" });
  }

  try {
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);

    const response = await axios.post(
      `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Categories`,
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
    res.json({
      message: "Categories from the image successfully analyzed",
      categories: response.data.categories,
  });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Error in analyzing the image" });
  }
});

//Route for uploading and analyzing categories in an image
/**
 * @swagger
 * /image/captions:
 *   post:
 *     summary: Upload an image for caption analysis
 *     description: Upload an image and get caption analysis from Azure Vision Studio.
 *     tags: [Image Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Analysis of the uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 captions: []
 *       400:
 *         description: No file uploaded or invalid input
 *       500:
 *         description: Server error
 */
app.post("/image/captions", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded!" });
  }

  try {
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);

    const response = await axios.post(
      `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Description`,
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
    res.json({
      message: "Caption from the image successfully analyzed",
      caption: response.data.description.captions,
  });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Error in analyzing the image" });
  }
});

//Route for uploading and analyzing tags in an image
/**
 * @swagger
 * /image/tags:
 *   post:
 *     summary: Upload an image for tag analysis
 *     description: Upload an image and get tag analysis from Azure Vision Studio.
 *     tags: [Image Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Analysis of the uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 tags: []
 *       400:
 *         description: No file uploaded or invalid input
 *       500:
 *         description: Server error
 */
app.post("/image/tags", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded!" });
  }

  try {
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);

    const response = await axios.post(
      `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags`,
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
    res.json({
      message: "Tags from the image successfully analyzed",
      tags: response.data.tags,
  });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Error in analyzing the image" });
  }
});

//Route to analyze colors from an image URL
/**
 * @swagger
 * /link/colors:
 *   post:
 *     summary: Provide an image URL for color analysis 
 *     description: Provide an URL to analyze the colors of an image using Azure Vision Studio.
 *     tags: [Image Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageURL:
 *                 type: string
 *                 description: The URL of the image to analyze
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Analysis of the image from the provided URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 color: {}
 *       400:
 *         description: No URL provided or invalid input
 *       500:
 *         description: Server error
 */
app.post("/link/colors", async (req, res) => {
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
          visualFeatures: "Color",
        },
      }
    );
    res.json({
      message: "Color from the image URL successfully analyzed",
      color: response.data.color,
  });
  } catch (error) {
    console.error(
      "Error with analyzing the image: ",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error with analyzing the image" });
  }
});

//Route to analyze categories from an image URL
/**
 * @swagger
 * /link/categories:
 *   post:
 *     summary: Provide an image URL for category analysis 
 *     description: Provide an URL to analyze the categories of an image using Azure Vision Studio.
 *     tags: [Image Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageURL:
 *                 type: string
 *                 description: The URL of the image to analyze
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Analysis of the image from the provided URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 categories: []
 *       400:
 *         description: No URL provided or invalid input
 *       500:
 *         description: Server error
 */
app.post("/link/categories", async (req, res) => {
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
          visualFeatures: "Categories",
        },
      }
    );
    res.json({
      message: "Categories from the image URL successfully analyzed",
      categories: response.data.categories,
  });
  } catch (error) {
    console.error(
      "Error with analyzing the image: ",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error with analyzing the image" });
  }
});

//Route to analyze a caption from an image URL
/**
 * @swagger
 * /link/captions:
 *   post:
 *     summary: Provide an image URL for caption analysis  
 *     description: Provide an URL to analyze the caption of an image using Azure Vision Studio.
 *     tags: [Image Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageURL:
 *                 type: string
 *                 description: The URL of the image to analyze
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Analysis of the image from the provided URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 caption: {}
 *       400:
 *         description: No URL provided or invalid input
 *       500:
 *         description: Server error
 */
app.post("/link/captions", async (req, res) => {
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
          visualFeatures: "Description",
        },
      }
    );
    res.json({
      message: "Caption from the image URL successfully analyzed",
      caption: response.data.description.captions,
  });
  } catch (error) {
    console.error(
      "Error with analyzing the image: ",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error with analyzing the image" });
  }
});

//Route to analyze tags from an image URL
/**
 * @swagger
 * /link/tags:
 *   post:
 *     summary: Provide an image URL for tag analysis 
 *     description: Provide an URL to analyze the tags of an image using Azure Vision Studio.
 *     tags: [Image Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageURL:
 *                 type: string
 *                 description: The URL of the image to analyze
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Analysis of the image from the provided URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 tags: []
 *       400:
 *         description: No URL provided or invalid input
 *       500:
 *         description: Server error
 */
app.post("/link/tags", async (req, res) => {
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
          visualFeatures: "Tags",
        },
      }
    );
    res.json({
      message: "Tags from the image URL successfully analyzed",
      tags: response.data.tags,
  });
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
