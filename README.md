Image/URL Analysis API Documentation
Overview:
These APIs allow you to upload images or provide image URLs for analysis using Azure Vision Studio. The available image analyses include color, categories, captions, and tags.
Base URL:
http:// 167.71.187.111:3000
________________________________________
1. Upload an Image for Color Analysis
•	Endpoint: /image/colors
•	Method: POST
•	Description: Upload an image for color analysis.
Request Body:
•	Content-Type: multipart/form-data
•	Body Parameters:
o	image: The image file to upload (required).
Responses:
•	200 OK:
o	Description: Successfully analyzed the colors from the image.
o	Example Using Postman:

 
•	400 Bad Request: No file uploaded or invalid input.
•	500 Internal Server Error: If there is an error during analysis.
________________________________________
2. Upload an Image for Category Analysis
•	Endpoint: /image/categories
•	Method: POST
•	Description: Upload an image for category analysis.
Request Body:
•	Content-Type: multipart/form-data
•	Body Parameters:
o	image: The image file to upload (required).
Responses:
•	200 OK:
o	Description: Successfully analyzed the categories from the image.
o	Example Using Postman:
 
•	400 Bad Request: No file uploaded or invalid input.
•	500 Internal Server Error: If there is an error during analysis.
________________________________________
3. Upload an Image for Caption Analysis
•	Endpoint: /image/captions
•	Method: POST
•	Description: Upload an image for caption analysis.
Request Body:
•	Content-Type: multipart/form-data
•	Body Parameters:
o	image: The image file to upload (required).
Responses:
•	200 OK:
o	Description: Successfully analyzed the captions from the image.
o	Example Using Postman:


 
•	400 Bad Request: No file uploaded or invalid input.
•	500 Internal Server Error: If there is an error during analysis.
________________________________________
4. Upload an Image for Tag Analysis
•	Endpoint: /image/tags
•	Method: POST
•	Description: Upload an image for tag analysis.
Request Body:
•	Content-Type: multipart/form-data
•	Body Parameters:
o	image: The image file to upload (required).
Responses:
•	200 OK:
o	Description: Successfully analyzed the tags from the image.
o	Example Using Postman:

 
•	400 Bad Request: No file uploaded or invalid input.
•	500 Internal Server Error: If there is an error during analysis.
________________________________________
5. Analyze Color from an Image URL
•	Endpoint: /link/colors
•	Method: POST
•	Description: Provide an image URL for color analysis.
Request Body:
•	Content-Type: application/json
•	Body Parameters:
o	imageURL: The URL of the image to analyze (required).
Responses:
•	200 OK:
o	Description: Successfully analyzed the colors from the image URL.
o	Example Using Postman:
 
•	400 Bad Request: No URL provided or invalid input.
•	500 Internal Server Error: If there is an error during analysis.
________________________________________
6. Analyze Categories from an Image URL
•	Endpoint: /link/categories
•	Method: POST
•	Description: Provide an image URL for category analysis.
Request Body:
•	Content-Type: application/json
•	Body Parameters:
o	imageURL: The URL of the image to analyze (required).
Responses:
•	200 OK:
o	Description: Successfully analyzed the categories from the image URL.
o	Example Using Postman:
 
•	400 Bad Request: No URL provided or invalid input.
•	500 Internal Server Error: If there is an error during analysis.
________________________________________
7. Analyze Caption from an Image URL
•	Endpoint: /link/captions
•	Method: POST
•	Description: Provide an image URL for caption analysis.
Request Body:
•	Content-Type: application/json
•	Body Parameters:
o	imageURL: The URL of the image to analyze (required).
Responses:
•	200 OK:
o	Description: Successfully analyzed the captions from the image URL.
o	Example Using Postman:
 
•	400 Bad Request: No URL provided or invalid input.
•	500 Internal Server Error: If there is an error during analysis.
________________________________________
8. Analyze Tags from an Image URL
•	Endpoint: /link/tags
•	Method: POST
•	Description: Provide an image URL for tag analysis.
Request Body:
•	Content-Type: application/json
•	Body Parameters:
o	imageURL: The URL of the image to analyze (required).
Responses:
•	200 OK:
o	Description: Successfully analyzed the tags from the image URL.
o	Example Using Postman:
 
•	400 Bad Request: No URL provided or invalid input.
•	500 Internal Server Error: If there is an error during analysis.
________________________________________
Error Responses:
The APIs return appropriate error responses:
•	400 Bad Request: Invalid input/file type or missing required parameters.
•	500 Internal Server Error: Server-side errors (unexpected errors during processing).
________________________________________
Swagger UI Documentation:
To interactively explore and test the APIs, navigate to http://167.71.187.111:3000/api-docs in your browser.
________________________________________
Deployment Notes:
•	Ensure the uploads directory exists and is writable to store uploaded images temporarily
•	Azure credentials must be set in the .env file
o	AZURE_CV_ENDPOINT
o	AZURE-CV-KEY
•	Limit the maximum file size to 5MB for uploads
•	Add the .env file to your .gitignore to secure variables and Azure authorization credentials
________________________________________
Development Dependencies:
•	Node.js and npm for server setup
•	Environment variables defined in .env
•	Swagger for API documentation
•	Npm install the following:
o	Axios
o	Body-parser
o	Cors
o	Dotenv
o	Express
o	Multer
o	Swagger-jsdoc
o	Swagger-ui-express
o	Pm2
