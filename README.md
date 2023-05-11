# **Data Viz**  
  
## **The project**
This is a group industry project for BCIT's Software System Development program.  
The objective was to build a system which:
- queries log data (with different characteristics) from a DynamoDB database, and
- displays data visualization through charts, providing a way to envision the "overall system health" of all automated processes behind the logs.  

Some of the tools used in this project:

- [SST](https://sst.dev/)  
- NodeJs
- ReactJs
- Vite
- [Victory](https://www.npmjs.com/package/victory)
- [AWS-SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)


 ## **How to install**
 **- Development mode**  
  `# git clone https://github.com/renzgabrinao/Agilitek-Group1.git`  
  `# cd Agilitek-Group1\data-viz`  
  `# npm install`  -- it installs all backend dependencies  
  `# npx sst dev`  -- it will create the whole AWS structure for the application, which depends on an AWS user profile  
  `# cd frontend`  (in another terminal)  
  `# npm install`  -- it installs all frontend dependencies      
  `# npm run dev` 
  * on a browser, http://localhost:5173/ (or the port number provided by Vite)
  
  **- Production mode**  
  `# git clone https://github.com/renzgabrinao/Agilitek-Group1.git`  
  `# cd Agilitek-Group1\data-viz`  
  `# npm install`  -- it installs all backend dependencies  
  `# npx sst deploy --stage prod`  -- it will deploy both backend and frontend, providing at the end the real address for its access.

