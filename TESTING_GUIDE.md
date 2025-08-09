# AI Categorization Testing Guide

## 🎯 **How to Test AI Auto Categorization**

### **Method 1: Quick Test (Basic Categorization)**

Run the test file to verify basic functionality:

```bash
# Navigate to backend directory
cd backend

# Run the test
node test-ai-categorization.js
```

**Expected Output:**
```
🧪 Testing AI Categorization Service...

1. Testing file type detection:
   photo.jpg (image/jpeg) -> Images
   document.pdf (application/pdf) -> Documents
   video.mp4 (video/mp4) -> Videos
   music.mp3 (audio/mpeg) -> Audio
   notes.txt (text/plain) -> Documents
   config.json (application/json) -> Configuration
   archive.zip (application/zip) -> Archives
   script.js (text/javascript) -> Code

✅ Test completed!
```

### **Method 2: Real Upload Test**

#### **Step 1: Start Your Backend Server**
```bash
cd backend
npm start
# or
node server.js
```

#### **Step 2: Test with Different File Types**

**Test 1: Image File**
- Upload: `photo.jpg`, `screenshot.png`, `icon.svg`
- Expected Category: `Images`

**Test 2: Document File**
- Upload: `report.pdf`, `notes.txt`, `document.docx`
- Expected Category: `Documents`

**Test 3: Code File**
- Upload: `script.js`, `app.py`, `index.html`
- Expected Category: `Code`

**Test 4: Configuration File**
- Upload: `config.json`, `settings.yaml`, `package.json`
- Expected Category: `Configuration`

### **Method 3: AI Integration Test**

#### **Step 1: Configure AI API (Optional)**
Add to your `.env` file:
```env
AI_API_BASE_URL=https://api.openai.com/v1
AI_API_KEY=your-openai-api-key-here
AI_MODEL=gpt-3.5-turbo
```

#### **Step 2: Test AI Categorization**
Upload a text file with content like:
```
# work-report.txt
This is a quarterly financial report for Q4 2024.
Contains revenue analysis, expense breakdown, and projections.
Team performance metrics and project updates included.
```

**Expected AI Category:** `Work` (instead of just `Documents`)

### **Method 4: Check API Response**

#### **Upload a File and Check Response**

1. **Make a POST request to upload endpoint:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -F "file=@test-file.txt" \
  http://localhost:5000/api/uploads
```

2. **Check the response:**
```json
{
  "message": "✅ File uploaded successfully",
  "file": {
    "userId": "user123",
    "fileName": "test-file.txt",
    "filePath": "user123/test-file.txt",
    "category": "Documents",  // ← AI-assigned category
    "hash": "abc123...",
    "size": 1024,
    "uploadDate": "2024-01-01T00:00:00.000Z"
  },
  "aiCategory": "Documents"  // ← Category info in response
}
```

### **Method 5: Check Database**

#### **Verify Category is Saved**

1. **Check MongoDB collection:**
```javascript
// In MongoDB shell or Compass
db.files.findOne({ fileName: "test-file.txt" })
```

2. **Expected result:**
```json
{
  "_id": ObjectId("..."),
  "userId": "user123",
  "fileName": "test-file.txt",
  "filePath": "user123/test-file.txt",
  "category": "Documents",  // ← Should have category
  "hash": "abc123...",
  "size": 1024,
  "uploadDate": ISODate("2024-01-01T00:00:00.000Z")
}
```

### **Method 6: Frontend Integration Test**

#### **Test Upload Through Frontend**

1. **Start both backend and frontend:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

2. **Upload files through the UI and check:**
- File appears in the list
- Category is displayed (if frontend shows categories)
- No errors in browser console

### **Method 7: Error Handling Test**

#### **Test Fallback Behavior**

1. **Disable AI API (remove API key):**
```env
AI_API_KEY=your-api-key-here  # Comment out or remove
```

2. **Upload a file:**
- Should still work with basic categorization
- Check console logs for: `ℹ️ AI API key not configured, using basic categorization`

3. **Test with invalid AI API key:**
```env
AI_API_KEY=invalid-key
```
- Should fall back to basic categorization
- Check console logs for: `⚠️ AI categorization failed:`

### **Method 8: Performance Test**

#### **Test with Different File Sizes**

1. **Small files (< 1MB):**
- Text files, images, documents
- Should categorize quickly

2. **Large files (> 10MB):**
- Videos, archives, large documents
- Should still categorize (may take longer for content analysis)

3. **Check response times:**
- Monitor upload time
- Check console logs for categorization duration

## 🔍 **What to Look For**

### **✅ Success Indicators**

1. **Console Logs:**
   - `🤖 Starting AI categorization for: filename.ext`
   - `✅ AI categorization completed: category`
   - `ℹ️ AI API key not configured, using basic categorization` (if no AI key)

2. **API Response:**
   - `category` field populated in response
   - `aiCategory` field included
   - No errors in response

3. **Database:**
   - `category` field saved in MongoDB
   - Consistent categories for similar files

4. **Frontend:**
   - Files upload successfully
   - No UI errors
   - Categories displayed (if implemented)

### **⚠️ Common Issues**

1. **AI Categorization Not Working:**
   - Check if `AI_API_KEY` is set
   - Verify API key has credits
   - Check network connectivity

2. **Categories Not Saving:**
   - Verify MongoDB connection
   - Check File model schema
   - Review error logs

3. **Upload Fails:**
   - Check file size limits
   - Verify authentication token
   - Check MinIO connection

## 🎯 **Test Checklist**

- [ ] Basic file type detection works
- [ ] AI categorization works (if API key configured)
- [ ] Fallback categorization works (if no AI key)
- [ ] Categories are saved to database
- [ ] API response includes category information
- [ ] Error handling works gracefully
- [ ] Large files are handled properly
- [ ] Frontend integration works
- [ ] Console logging is informative

## 🚀 **Quick Test Commands**

```bash
# Test basic categorization
cd backend && node test-ai-categorization.js

# Test upload with curl (replace TOKEN and FILE_PATH)
curl -X POST -H "Authorization: Bearer TOKEN" -F "file=@FILE_PATH" http://localhost:5000/api/uploads

# Check MongoDB for saved categories
mongo ai-cloud-storage --eval "db.files.find({}, {fileName: 1, category: 1})"
```

## 📊 **Expected Categories**

| File Type | Expected Category |
|-----------|------------------|
| Images (jpg, png, gif) | Images |
| Videos (mp4, avi, mov) | Videos |
| Audio (mp3, wav) | Audio |
| Documents (pdf, doc, txt) | Documents |
| Spreadsheets (xls, csv) | Spreadsheets |
| Presentations (ppt, pptx) | Presentations |
| Archives (zip, rar) | Archives |
| Code (js, py, html) | Code |
| Config (json, yaml) | Configuration |
| Work files | Work |
| Personal files | Personal |
| Educational content | Education |
| Entertainment | Entertainment |
