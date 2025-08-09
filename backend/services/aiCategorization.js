const axios = require('axios');

// Configuration for AI API (you can replace this with your preferred AI service)
const AI_API_CONFIG = {
  baseURL: process.env.AI_API_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.AI_API_KEY || 'your-api-key-here',
  model: process.env.AI_MODEL || 'gpt-3.5-turbo'
};

/**
 * Detect file type based on MIME type and file extension
 * @param {string} mimetype - MIME type of the file
 * @param {string} fileName - Original file name
 * @returns {string} - Detected file type category
 */
function detectFileType(mimetype, fileName) {
  const extension = fileName.toLowerCase().split('.').pop();
  
  // Image files
  if (mimetype.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
    return 'Images';
  }
  
  // Video files
  if (mimetype.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension)) {
    return 'Videos';
  }
  
  // Audio files
  if (mimetype.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(extension)) {
    return 'Audio';
  }
  
  // Document files
  if (mimetype.includes('pdf') || ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) {
    return 'Documents';
  }
  
  // Spreadsheet files
  if (['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
    return 'Spreadsheets';
  }
  
  // Presentation files
  if (['ppt', 'pptx', 'odp'].includes(extension)) {
    return 'Presentations';
  }
  
  // Archive files
  if (mimetype.includes('zip') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return 'Archives';
  }
  
  // Code files
  if (['js', 'ts', 'py', 'java', 'cpp', 'c', 'html', 'css', 'php', 'rb', 'go', 'rs'].includes(extension)) {
    return 'Code';
  }
  
  // Configuration files
  if (['json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'conf'].includes(extension)) {
    return 'Configuration';
  }
  
  return 'Other';
}

/**
 * Call AI API to get refined categorization
 * @param {string} fileName - Original file name
 * @param {string} fileContent - File content (for text-based files)
 * @param {string} detectedType - Initially detected file type
 * @returns {Promise<string>} - AI-refined category
 */
async function getAICategorization(fileName, fileContent = null, detectedType = 'Other') {
  try {
    // If no AI API key is configured, return the detected type
    if (!AI_API_CONFIG.apiKey || AI_API_CONFIG.apiKey === 'your-api-key-here') {
      console.log('ℹ️ AI API key not configured, using basic categorization');
      return detectedType;
    }

    const prompt = `
      Analyze this file and provide a specific category for it.
      
      File name: ${fileName}
      Detected type: ${detectedType}
      ${fileContent ? `File content (first 500 chars): ${fileContent.substring(0, 500)}` : 'No content available'}
      
      Please return only the category name from the following options or a relevant custom category:
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
      
      Return only the category name, nothing else.
    `;

    const response = await axios.post(
      `${AI_API_CONFIG.baseURL}/chat/completions`,
      {
        model: AI_API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are a file categorization assistant. Respond with only the category name.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${AI_API_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    const aiCategory = response.data.choices[0].message.content.trim();
    console.log(`🤖 AI categorized "${fileName}" as: ${aiCategory}`);
    return aiCategory;

  } catch (error) {
    console.error('❌ AI categorization failed:', error.message);
    // Return the detected type if AI fails
    return detectedType;
  }
}

/**
 * Main function to categorize a file
 * @param {Object} fileInfo - File information object
 * @param {string} fileInfo.mimetype - MIME type
 * @param {string} fileInfo.fileName - Original file name
 * @param {Buffer} fileInfo.buffer - File buffer (optional, for content analysis)
 * @returns {Promise<string>} - Final category
 */
async function categorizeFile(fileInfo) {
  const { mimetype, fileName, buffer } = fileInfo;
  
  // Step 1: Detect file type based on MIME and extension
  const detectedType = detectFileType(mimetype, fileName);
  
  // Step 2: Try to get AI categorization if it's a text-based file
  let fileContent = null;
  const extension = fileName.toLowerCase().split('.').pop();
  const textExtensions = ['txt', 'md', 'json', 'xml', 'yaml', 'yml', 'csv', 'log'];
  
  if (buffer && (mimetype.startsWith('text/') || textExtensions.includes(extension))) {
    try {
      fileContent = buffer.toString('utf8');
    } catch (error) {
      console.log('⚠️ Could not read file content for AI analysis');
    }
  }
  
  // Step 3: Get AI categorization
  const finalCategory = await getAICategorization(fileName, fileContent, detectedType);
  
  return finalCategory;
}

module.exports = {
  detectFileType,
  getAICategorization,
  categorizeFile
};
