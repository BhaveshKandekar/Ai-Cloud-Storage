# Duplicate Detection Feature

## Overview

The Duplicate Detection feature automatically identifies when users attempt to upload files that already exist in their cloud storage. It provides a user-friendly popup asking whether to replace the existing file or skip the upload.

## Features

### 🔍 **Smart Detection**
- **Hash-based detection**: Identifies files with identical content using SHA-256 hashing
- **Filename detection**: Catches files with the same name (even if content differs)
- **User-scoped**: Only checks for duplicates within the same user's storage

### 🎯 **User Experience**
- **Clear popup**: Shows detailed information about the existing file
- **Two options**: Replace existing file or skip upload
- **File details**: Displays file size, upload date, and duplicate type
- **Progress feedback**: Shows status during file replacement

### 🛡️ **Safety Features**
- **User verification**: Ensures users can only replace their own files
- **Atomic operations**: File replacement is handled safely with proper cleanup
- **Error handling**: Graceful fallback if replacement fails

## Implementation Details

### Backend Changes

#### 1. Enhanced Upload Route (`/api/uploads`)
```javascript
// Check for hash duplicates
const existingFile = await File.findOne({ userId, hash });
if (existingFile) {
  return res.status(409).json({ 
    message: 'File already exists.', 
    file: existingFile,
    duplicateType: 'hash',
    canReplace: true
  });
}

// Check for filename duplicates
const existingFileName = await File.findOne({ userId, fileName: originalName });
if (existingFileName) {
  return res.status(409).json({ 
    message: 'File with same name already exists.', 
    file: existingFileName,
    duplicateType: 'filename',
    canReplace: true
  });
}
```

#### 2. New Replace Route (`/api/uploads/replace`)
```javascript
router.post('/uploads/replace', verifyToken, upload.single('file'), async (req, res) => {
  // Verify existing file belongs to user
  // Remove old file from MinIO
  // Upload new file
  // Update metadata in MongoDB
  // Apply AI categorization to new file
});
```

### Frontend Changes

#### 1. DuplicateFilePopup Component
- **Modal design**: Clean, responsive popup with dark mode support
- **File information**: Shows existing file details (name, size, upload date)
- **Action buttons**: Replace and Skip options with proper states
- **Progress feedback**: Loading states and success/error messages

#### 2. Enhanced Upload Page
- **Duplicate handling**: Catches 409 responses and shows popup
- **State management**: Tracks popup visibility and duplicate information
- **Success handling**: Refreshes file list after successful replacement

## API Responses

### Duplicate Detection (409 Status)
```json
{
  "message": "File already exists.",
  "file": {
    "_id": "file_id_here",
    "fileName": "example.txt",
    "size": 1024,
    "uploadDate": "2024-01-01T00:00:00.000Z",
    "category": "Documents"
  },
  "duplicateType": "hash",
  "canReplace": true
}
```

### Successful Replacement (200 Status)
```json
{
  "message": "✅ File replaced successfully",
  "file": {
    "_id": "file_id_here",
    "fileName": "example.txt",
    "size": 2048,
    "uploadDate": "2024-01-01T12:00:00.000Z",
    "category": "Documents"
  },
  "aiCategory": "Documents"
}
```

## Usage Flow

### 1. **User Uploads File**
- File is processed through the upload route
- SHA-256 hash is calculated
- Database is checked for duplicates

### 2. **Duplicate Detected**
- Backend returns 409 status with duplicate information
- Frontend shows popup with file details
- User sees "Replace" and "Skip" options

### 3. **User Choice**
- **Replace**: New file replaces old file, metadata updated
- **Skip**: Upload is cancelled, no changes made

### 4. **Result**
- File list is refreshed to show changes
- Success/error messages are displayed
- Popup closes automatically

## Testing

### Backend Testing
```bash
cd backend
node test-duplicate-detection.js
```

### Frontend Testing
1. Start the backend server: `npm start`
2. Start the frontend: `cd frontend && npm run dev`
3. Upload a file
4. Try uploading the same file again
5. Verify the popup appears
6. Test both Replace and Skip options

## Configuration

### Environment Variables
No additional environment variables are required. The feature uses existing:
- MongoDB connection
- MinIO configuration
- Firebase authentication
- AI categorization service

### Dependencies
The feature requires these existing packages:
- `crypto` (Node.js built-in)
- `multer` (file upload handling)
- `mongoose` (database operations)
- `minio` (object storage)

## Error Handling

### Common Scenarios
1. **Authentication failure**: Returns 401, user must re-login
2. **File not found**: Returns 404 if trying to replace non-existent file
3. **Storage errors**: Returns 500 with detailed error message
4. **Network issues**: Frontend shows appropriate error messages

### Fallback Behavior
- If duplicate detection fails, upload proceeds normally
- If replacement fails, original file remains unchanged
- If popup fails to load, user sees standard error message

## Performance Considerations

### Hash Calculation
- SHA-256 is calculated in-memory for small files
- Large files are processed as streams to minimize memory usage
- Hash calculation is fast and doesn't significantly impact upload time

### Database Queries
- Duplicate checks use indexed fields (userId, hash, fileName)
- Queries are optimized for single-user lookups
- No additional database connections required

## Security Features

### User Isolation
- Users can only see and replace their own files
- File IDs are verified against user authentication
- No cross-user file access possible

### Input Validation
- File size limits enforced by Multer
- File type validation through MIME type checking
- Malicious file names are sanitized

## Future Enhancements

### Potential Improvements
1. **Batch duplicate detection**: Check multiple files at once
2. **Duplicate suggestions**: Show similar files based on content analysis
3. **Version history**: Keep track of file versions when replacing
4. **Advanced matching**: Use fuzzy matching for similar filenames
5. **Duplicate cleanup**: Tools to find and remove duplicate files

### Integration Opportunities
1. **AI-powered deduplication**: Use AI to identify similar content
2. **Storage optimization**: Compress duplicate content
3. **Sync features**: Detect duplicates across multiple devices
4. **Collaboration**: Share duplicate detection across team members

## Troubleshooting

### Common Issues

#### Popup Not Showing
- Check browser console for JavaScript errors
- Verify backend is returning 409 status
- Ensure DuplicateFilePopup component is imported

#### Replace Not Working
- Check authentication token is valid
- Verify file ID is being passed correctly
- Check backend logs for error messages

#### Performance Issues
- Monitor file size limits
- Check database query performance
- Verify MinIO connection stability

### Debug Mode
Enable detailed logging by setting environment variable:
```bash
DEBUG=duplicate-detection npm start
```

## Support

For issues or questions about the Duplicate Detection feature:
1. Check the backend logs for error details
2. Verify the frontend console for JavaScript errors
3. Test with the provided test scripts
4. Review the API responses for unexpected data

---

**Note**: This feature maintains backward compatibility and doesn't affect existing upload functionality. All previous features continue to work as expected.

