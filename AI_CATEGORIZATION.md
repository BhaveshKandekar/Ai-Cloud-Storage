# AI Auto Categorization Feature

## Overview

This feature automatically categorizes uploaded files using AI-powered analysis. It combines traditional file type detection (based on MIME types and file extensions) with AI analysis for more accurate and contextual categorization.

## Features

### 1. File Type Detection
- **MIME Type Analysis**: Automatically detects file types based on MIME types
- **Extension Analysis**: Fallback detection based on file extensions
- **Comprehensive Coverage**: Supports images, videos, audio, documents, spreadsheets, presentations, archives, code files, and configuration files

### 2. AI-Powered Categorization
- **Content Analysis**: For text-based files, analyzes content for better categorization
- **Contextual Understanding**: AI considers file name, content, and detected type
- **Smart Categories**: Assigns categories like Personal, Work, Education, Entertainment, etc.

### 3. Fallback System
- **Graceful Degradation**: Continues upload even if AI categorization fails
- **Basic Categorization**: Falls back to detected file type if AI is unavailable
- **Error Handling**: Comprehensive error logging and handling

## Implementation

### File Structure

```
backend/
├── services/
│   └── aiCategorization.js    # AI categorization service
├── routes/
│   └── fileRoutes.js          # Updated upload route
└── models/
    └── File.js                # File model with category field
```

### Key Components

#### 1. AI Categorization Service (`services/aiCategorization.js`)

**Main Functions:**
- `detectFileType(mimetype, fileName)`: Basic file type detection
- `getAICategorization(fileName, fileContent, detectedType)`: AI-powered categorization
- `categorizeFile(fileInfo)`: Main categorization function

**Supported Categories:**
- Images (photos, graphics, icons)
- Videos (movies, clips, recordings)
- Audio (music, podcasts, sound files)
- Documents (text files, PDFs, manuscripts)
- Spreadsheets (data, tables, calculations)
- Presentations (slides, decks)
- Archives (compressed files, backups)
- Code (programming files, scripts)
- Configuration (settings, config files)
- Personal (personal documents, private files)
- Work (work-related files, projects)
- Education (learning materials, courses)
- Entertainment (games, media, fun content)
- Other (miscellaneous files)

#### 2. Updated Upload Route

The upload route now includes:
- Automatic category detection and assignment
- AI-powered categorization for enhanced accuracy
- Category storage in MongoDB
- Category information in API response

### API Integration

#### Upload Response Format

```json
{
  "message": "✅ File uploaded successfully",
  "file": {
    "userId": "user123",
    "fileName": "document.pdf",
    "filePath": "user123/document.pdf",
    "category": "Documents",
    "hash": "abc123...",
    "size": 1024,
    "uploadDate": "2024-01-01T00:00:00.000Z"
  },
  "aiCategory": "Documents"
}
```

## Configuration

### Environment Variables

Add these environment variables to your `.env` file:

```env
# AI API Configuration (Optional - defaults to basic categorization if not set)
AI_API_BASE_URL=https://api.openai.com/v1
AI_API_KEY=your-openai-api-key-here
AI_MODEL=gpt-3.5-turbo
```

### API Key Setup

1. **OpenAI API** (Recommended):
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Get your API key from the dashboard
   - Set `AI_API_KEY` in your environment variables

2. **Alternative AI Services**:
   - Modify `services/aiCategorization.js` to use your preferred AI service
   - Update the `AI_API_CONFIG` object and `getAICategorization` function

## Usage

### Automatic Categorization

Files are automatically categorized during upload:

1. **File Upload**: User uploads a file
2. **Type Detection**: System detects file type based on MIME/extension
3. **AI Analysis**: AI analyzes file for contextual categorization
4. **Category Assignment**: Final category is assigned and stored
5. **Response**: Category information is returned to user

### Example Usage

```javascript
// Frontend upload example
const formData = new FormData();
formData.append('file', file);

const response = await axios.post('/api/uploads', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
});

console.log('File category:', response.data.aiCategory);
```

## Error Handling

### AI Service Failures

- **No API Key**: Falls back to basic categorization
- **API Errors**: Logs error and uses detected type
- **Timeout**: 10-second timeout with fallback
- **Network Issues**: Graceful degradation

### Logging

The system provides comprehensive logging:
- `🤖 Starting AI categorization for: filename.ext`
- `✅ AI categorization completed: category`
- `⚠️ AI categorization failed: error message`
- `ℹ️ AI API key not configured, using basic categorization`

## Future Enhancements

### Potential Improvements

1. **Content Analysis**: Enhanced content analysis for various file types
2. **User Feedback**: Allow users to correct/improve categories
3. **Custom Categories**: User-defined category creation
4. **Bulk Processing**: Categorize existing files
5. **Category Learning**: Learn from user corrections
6. **Multi-language Support**: Support for various languages in content analysis

### Integration Opportunities

1. **Search Enhancement**: Category-based search and filtering
2. **Organization**: Automatic folder structure based on categories
3. **Analytics**: Category usage analytics and insights
4. **Sharing**: Category-based sharing permissions
5. **Backup**: Category-based backup strategies

## Testing

### Test Scenarios

1. **Basic File Types**: Test with common file types (images, documents, etc.)
2. **AI Integration**: Test with and without AI API key
3. **Error Handling**: Test with invalid files and network issues
4. **Performance**: Test with large files and high upload volumes
5. **Edge Cases**: Test with unusual file names and types

### Test Commands

```bash
# Install dependencies
cd backend
npm install

# Test upload with categorization
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-file.txt" \
  http://localhost:5000/api/uploads
```

## Troubleshooting

### Common Issues

1. **AI Categorization Not Working**:
   - Check if `AI_API_KEY` is set correctly
   - Verify API key has sufficient credits
   - Check network connectivity

2. **Categories Not Saving**:
   - Verify MongoDB connection
   - Check File model schema
   - Review error logs

3. **Performance Issues**:
   - Monitor AI API response times
   - Consider implementing caching
   - Review file size limits

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=ai-categorization
```

## Security Considerations

1. **API Key Security**: Store API keys securely in environment variables
2. **Content Privacy**: Ensure AI service privacy policy compliance
3. **Data Handling**: Follow data protection regulations
4. **Rate Limiting**: Implement appropriate rate limiting for AI API calls

## Support

For issues and questions:
1. Check the error logs in the console
2. Verify environment variable configuration
3. Test with basic categorization (no AI key)
4. Review the troubleshooting section above
