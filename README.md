Image/URL Analysis APIs
________________________________________
Overview
These APIs enable image analysis by allowing users to upload images or provide image URLs. The APIs interact with Azure Vision Studio for visual analysis. Each one supports the following functionalities:
•	Upload Image: Analyze an image by uploading a file.
•	Analyze URL: Analyze an image from a given URL.
________________________________________
Base URL
The API server is deployed at:
•	http://167.71.187.111:3000
________________________________________
Authentication
These APIs require Azure Cognitive Services credentials. Configure the following environment variables:
•	AZURE_CV_ENDPOINT: Azure Computer Vision endpoint. Given to you when you register with Azure
•	AZURE_CV_KEY: Azure Computer Vision API key. Given to you when you create the Computer Vision Resource in Azure
________________________________________
Swagger Documentation
Interactive API documentation is available at:
•	http://167.71.187.111:3000/api-docs
________________________________________
Endpoints
1. Upload Image for Analysis
POST /image
Description
Upload an image to analyze its content using Azure Vision Studio.
Request Body
Content-Type: multipart/form-data
Parameter
Image
Type
File
Description
The image file to upload
Response
•	200 OK: Successfully analyzed the image.
{
  "categories": [],
  "description": {},
  "tags": []
}
•	400 Bad Request: No file uploaded or invalid file type.
•	500 Internal Server Error: Server error during image analysis.
Example URL Request
curl -X 'POST' \
  'http://167.71.187.111:3000/image' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'image=@barca.jpg;type=image/jpeg'
________________________________________
2. Analyze Image from URL
POST /link
Description
Analyze an image by providing its URL.
Request Body
Content-Type: application/json
Parameter
ImageURL
Type
String
Description
The URL of the image
Example:
{
  "imageURL": "https://example.com/image.jpg"
}
Response
•	200 OK: Successfully analyzed the image.
{
  "categories": [],
  "description": {},
  "tags": []
}
•	400 Bad Request: No URL provided or invalid input.
•	500 Internal Server Error: Server error during image analysis.
Example URL Request
curl -X 'POST' \
  'http://167.71.187.111:3000/link' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "imageURL": "https://example.com/image.jpg"
}'
________________________________________
Error Handling
The APIs return appropriate error responses:
•	400 Bad Request: Invalid input, missing required fields, or invalid file type.
•	500 Internal Server Error: Unexpected errors during processing.
________________________________________
Deployment Notes
•	Ensure the uploads directory exists and is writable.
•	Azure credentials must be set in the .env file.
•	PORT = 
•	AZURE_CV_ENDPOINT = 
•	AZURE_CV_KEY = 
•	Limit the maximum file size to 5MB for uploads.
•	Add the .env file to your .gitignore to secure variables.
________________________________________
Development Dependencies
•	Node.js and npm for server setup.
•	Environment variables defined in .env.
•	Swagger for API documentation.
Run the following to install dependencies:
npm install:
•	Axios
•	Body-parser
•	Cors
•	Dotenv
•	Express
•	Multer
•	Swagger-jsdoc
•	Swagger-ui-express
•	Pm2
