const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Import the ArticleContent model and timestamps utility
const ArticleContentModel = require('../../models/contents/contentdatascheme.js'); // Adjust path as needed
const timestamps = require('../../lib/timestamps/timestamps');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Construct the path to view/public/images/contents
    // Assuming your folder structure is:
    // project-root/
    //   ├── server/
    //   │   ├── routes/
    //   │   │   └── content/
    //   │   │       └── contentRoute.js (this file)
    //   │   └── server.js
    //   └── view/
    //       └── public/
    //           └── images/
    //               └── contents/
    
    const uploadDir = path.join(__dirname, '../../../view/public/images/contents');
    
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created upload directory:', uploadDir);
      }
      
      console.log('Upload directory:', uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      console.error('Error creating upload directory:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files
  }
});

// POST route to add new content
router.post('/addcontent', upload.array('images', 10), async (req, res) => {
  try {
    // Parse the content data from the form
    const contentData = JSON.parse(req.body.contentData);
    
    // Validate required fields
    if (!contentData.title || !contentData.content || !contentData.description || !contentData.data) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields: Title, Content, Description, and Category"
      });
    }

    // Process uploaded images
    let imageUrls = [];
    let mainImage = "";
    
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/images/contents/${file.filename}`);
      mainImage = imageUrls[0]; // Use first image as main image
    }

    // Create the article content object
    const articleContent = new ArticleContentModel({
      id: contentData.id || Date.now(),
      image: mainImage,
      images: imageUrls,
      data: contentData.data,
      topic: contentData.topic || "",
      date: timestamps.getFormattedDate(), // Use the timestamps utility
      title: contentData.title,
      readTime: contentData.readTime || "5 min read",
      content: contentData.content,
      description: contentData.description,
      keytakeaways: contentData.keytakeaways || [],
      expertopinion: contentData.expertopinion || "",
      interactions: {
        like: [],
        unlike: [],
        exited: [],
        wow: [],
        sad: []
      },
      comments: []
    });

    // Save to database
    const savedContent = await articleContent.save();

    res.status(201).json({
      success: true,
      message: "Content added successfully!",
      contentId: savedContent.id,
      data: {
        id: savedContent.id,
        title: savedContent.title,
        mainImage: savedContent.image,
        totalImages: savedContent.images.length
      }
    });

  } catch (error) {
    console.error('Error adding content:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${validationErrors.join(', ')}`
      });
    }

    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB per file."
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 10 files per upload."
      });
    }

    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed!"
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Content with this ID already exists"
      });
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return res.status(400).json({
        success: false,
        message: "Invalid content data format"
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while adding content"
    });
  }
});

// GET route to retrieve all content
router.get('/getallcontents', async (req, res) => {

  try {
    // Extract query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Extract filtering parameters
    const category = req.query.category;
    const topic = req.query.topic;
    const sortBy = req.query.sortBy || 'date'; // Default sort by date
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; // Default to descending

    // Build filter object
    let filter = {};
    if (category) {
      filter.data = category;
    }
    if (topic) {
      filter.topic = { $regex: topic, $options: 'i' }; // Case-insensitive search
    }

    // Build sort object
    let sort = {};
    sort[sortBy] = sortOrder;

    // Get total count for pagination
    const totalContents = await ArticleContentModel.countDocuments(filter);
    
    // Fetch contents with pagination, filtering, and sorting
    const contents = await ArticleContentModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v') // Exclude version field
      .lean(); // Convert to plain JavaScript objects for better performance

    // Calculate pagination info
    const totalPages = Math.ceil(totalContents / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Transform data for response (optional - customize based on your needs)
    const transformedContents = contents.map(content => ({
      id: content.id,
      title: content.title,
      description: content.description,
      image: content.image,
      images: content.images,
      data: content.data,
      topic: content.topic,
      date: content.date,
      readTime: content.readTime,
      totalImages: content.images ? content.images.length : 0,
      keytakeaways: content.keytakeaways || [],
      expertopinion: content.expertopinion || "",
      interactionCounts: {
        likes: content.interactions?.like?.length || 0,
        unlikes: content.interactions?.unlike?.length || 0,
        wows: content.interactions?.wow?.length || 0,
        sads: content.interactions?.sad?.length || 0,
        exits: content.interactions?.exited?.length || 0
      },
      commentCount: content.comments ? content.comments.length : 0,
      // Calculate total replies across all comments
      totalReplies: content.comments ? content.comments.reduce((total, comment) => 
        total + (comment.replies ? comment.replies.length : 0), 0) : 0
    }));

    res.status(200).json({
      success: true,
      data: transformedContents,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalContents: totalContents,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        limit: limit
      },
      filters: {
        category: category || null,
        topic: topic || null,
        sortBy: sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc'
      }
    });

  } catch (error) {
    console.error('Error retrieving contents:', error);

    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters"
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while retrieving contents"
    });
  }
});

// POST /api/articles/interaction
router.post('/interaction', async (req, res) => {
  try {
    const { articleId, interactionType, userData, currentInteraction } = req.body;

    // Validation
    if (!articleId || !interactionType || !userData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate interaction type
    const validInteractionTypes = ['like', 'unlike', 'exited', 'wow', 'sad'];
    if (!validInteractionTypes.includes(interactionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interaction type'
      });
    }

    // Validate user data
    if (!userData.name || !userData.phonenumber) {
      return res.status(400).json({
        success: false,
        message: 'User data incomplete'
      });
    }

    // Find the article by id field (not _id)
    const article = await ArticleContentModel.findOne({ id: articleId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Initialize interactions object if it doesn't exist
    if (!article.interactions) {
      article.interactions = {
        like: [],
        unlike: [],
        exited: [],
        wow: [],
        sad: []
      };
    }

    // Helper function to remove user from all interaction types
    const removeUserFromAllInteractions = (phoneNumber) => {
      const interactionTypes = ['like', 'unlike', 'exited', 'wow', 'sad'];
      interactionTypes.forEach(type => {
        if (article.interactions[type]) {
          article.interactions[type] = article.interactions[type].filter(
            interaction => interaction.phonenumber !== phoneNumber
          );
        }
      });
    };

    // Check if user already has an interaction
    const userPhone = userData.phonenumber;
    let hasExistingInteraction = false;
    let existingInteractionType = null;

    // Find existing interaction
    const interactionTypes = ['like', 'unlike', 'exited', 'wow', 'sad'];
    for (const type of interactionTypes) {
      if (article.interactions[type]) {
        const existingIndex = article.interactions[type].findIndex(
          interaction => interaction.phonenumber === userPhone
        );
        if (existingIndex !== -1) {
          hasExistingInteraction = true;
          existingInteractionType = type;
          break;
        }
      }
    }

    // Logic for handling interactions
    if (hasExistingInteraction && existingInteractionType === interactionType) {
      // User is removing their current interaction (toggle off)
      removeUserFromAllInteractions(userPhone);
    } else {
      // User is adding new interaction or changing existing one
      // First remove user from all interactions
      removeUserFromAllInteractions(userPhone);
      
      // Then add to the new interaction type
      if (!article.interactions[interactionType]) {
        article.interactions[interactionType] = [];
      }
      
      article.interactions[interactionType].push({
        name: userData.name,
        phonenumber: userData.phonenumber,
        date: userData.date || new Date().toISOString()
      });
    }

    // Save the updated article
    await article.save();

    // Return updated article with interaction counts
    const interactionCounts = {};
    interactionTypes.forEach(type => {
      interactionCounts[type] = article.interactions[type] ? article.interactions[type].length : 0;
    });

    // Determine user's current interaction after update
    let newUserInteraction = null;
    for (const type of interactionTypes) {
      if (article.interactions[type]) {
        const hasInteraction = article.interactions[type].some(
          interaction => interaction.phonenumber === userPhone
        );
        if (hasInteraction) {
          newUserInteraction = type;
          break;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Interaction updated successfully',
      data: {
        articleId: article.id, // Return the regular id, not _id
        interactionCounts: interactionCounts,
        userInteraction: newUserInteraction,
        totalInteractions: Object.values(interactionCounts).reduce((sum, count) => sum + count, 0)
      }
    });

  } catch (error) {
    console.error('Error updating article interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});


// GET user's interaction for a specific article
router.get('/user-interaction/:articleId/:phoneNumber', async (req, res) => {
  try {
    const { articleId, phoneNumber } = req.params;

    // Validate parameters
    if (!articleId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Article ID and phone number are required'
      });
    }

    // Database query - adjust according to your database setup
    // Example for MongoDB with Mongoose:
    /*
    const interaction = await InteractionModel.findOne({
      articleId: articleId,
      'userData.phonenumber': phoneNumber
    }).sort({ createdAt: -1 }); // Get the most recent interaction
    */

    // Example for MySQL/PostgreSQL with a query builder or raw SQL:
    /*
    const query = `
      SELECT interaction_type, created_at 
      FROM article_interactions 
      WHERE article_id = ? AND phone_number = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const [rows] = await db.query(query, [articleId, phoneNumber]);
    const interaction = rows[0];
    */

    // Example implementation - replace with your actual database logic
    let interaction = null;
    
    // If using MongoDB/Mongoose:
    if (global.db && global.db.collection) {
      interaction = await global.db.collection('article_interactions').findOne(
        {
          articleId: articleId,
          'userData.phonenumber': phoneNumber
        },
        { sort: { createdAt: -1 } }
      );
    }
    
    // If using SQL database, replace with your query logic:
    // interaction = await yourDatabase.query(yourSQLQuery, [articleId, phoneNumber]);

    if (interaction) {
      return res.json({
        success: true,
        interaction: {
          type: interaction.interactionType,
          date: interaction.createdAt || interaction.userData?.date
        }
      });
    } else {
      return res.json({
        success: true,
        interaction: null,
        message: 'No interaction found for this user and article'
      });
    }

  } catch (error) {
    console.error('Error fetching user interaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Alternative route if you prefer to use POST with request body
router.post('/get-user-interaction', async (req, res) => {
  try {
    const { articleId, phoneNumber } = req.body;

    // Validate request body
    if (!articleId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Article ID and phone number are required'
      });
    }

    // Same database logic as above
    let interaction = null;
    
    // Replace with your actual database query
    if (global.db && global.db.collection) {
      interaction = await global.db.collection('article_interactions').findOne(
        {
          articleId: articleId,
          'userData.phonenumber': phoneNumber
        },
        { sort: { createdAt: -1 } }
      );
    }

    if (interaction) {
      return res.json({
        success: true,
        interaction: {
          type: interaction.interactionType,
          date: interaction.createdAt || interaction.userData?.date
        }
      });
    } else {
      return res.json({
        success: true,
        interaction: null,
        message: 'No interaction found for this user and article'
      });
    }

  } catch (error) {
    console.error('Error fetching user interaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Optional: Get all interactions for a specific article (for analytics)
router.get('/article-interactions/:articleId', async (req, res) => {

  console.log('Synced')
  
  try {
    const { articleId } = req.params;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'Article ID is required'
      });
    }

    // Get interaction counts for the article
    // Replace with your actual database aggregation logic
    let interactionCounts = {
      likes: 0,
      unlikes: 0,
      wows: 0,
      exits: 0,
      sads: 0
    };

    // Example MongoDB aggregation:
    /*
    const pipeline = [
      { $match: { articleId: articleId } },
      { $group: { 
        _id: '$interactionType', 
        count: { $sum: 1 } 
      }}
    ];
    const results = await global.db.collection('article_interactions').aggregate(pipeline).toArray();
    
    results.forEach(result => {
      const mappedType = getInteractionMappedType(result._id);
      if (interactionCounts.hasOwnProperty(mappedType)) {
        interactionCounts[mappedType] = result.count;
      }
    });
    */

    return res.json({
      success: true,
      interactionCounts: interactionCounts
    });

  } catch (error) {
    console.error('Error fetching article interactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to map interaction types (same as in your frontend)
function getInteractionMappedType(type) {
  const typeMapping = {
    'like': 'likes',
    'wow': 'wows',
    'exited': 'exits',
    'sad': 'sads',
    'unlike': 'unlikes'
  };
  return typeMapping[type] || type;
}


module.exports = router;