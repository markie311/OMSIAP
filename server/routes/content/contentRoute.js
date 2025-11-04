const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const router = express.Router()

// Import the ArticleContent model and timestamps utility
const ArticleContentModel = require("../../models/contents/contentdatascheme.js")
const timestamps = require("../../lib/timestamps/timestamps")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../../view/public/images/contents")

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
        console.log("Created upload directory:", uploadDir)
      }

      console.log("Upload directory:", uploadDir)
      cb(null, uploadDir)
    } catch (error) {
      console.error("Error creating upload directory:", error)
      cb(error)
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10, // Maximum 10 files
  },
})

// POST route to add new content
router.post("/addcontent", upload.array("images", 10), async (req, res) => {
  try {
    const contentData = JSON.parse(req.body.contentData)

    if (!contentData.title || !contentData.content || !contentData.description || !contentData.data) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields: Title, Content, Description, and Category",
      })
    }

    let imageUrls = []
    let mainImage = ""

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => `/images/contents/${file.filename}`)
      mainImage = imageUrls[0]
    }

    const articleContent = new ArticleContentModel({
      id: contentData.id || Date.now(),
      image: mainImage,
      images: imageUrls,
      data: contentData.data,
      topic: contentData.topic || "",
      date: timestamps.getFormattedDate(),
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
        sad: [],
      },
      comments: [],
    })

    const savedContent = await articleContent.save()

    res.status(201).json({
      success: true,
      message: "Content added successfully!",
      contentId: savedContent.id,
      data: {
        id: savedContent.id,
        title: savedContent.title,
        mainImage: savedContent.image,
        totalImages: savedContent.images.length,
      },
    })
  } catch (error) {
    console.error("Error adding content:", error)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${validationErrors.join(", ")}`,
      })
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB per file.",
      })
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 10 files per upload.",
      })
    }

    if (error.message === "Only image files are allowed!") {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed!",
      })
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Content with this ID already exists",
      })
    }

    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return res.status(400).json({
        success: false,
        message: "Invalid content data format",
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error occurred while adding content",
    })
  }
})

// GET route to retrieve all content
router.get("/getallcontents", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const category = req.query.category
    const topic = req.query.topic
    const sortBy = req.query.sortBy || "date"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    const filter = {}
    if (category) {
      filter.data = category
    }
    if (topic) {
      filter.topic = { $regex: topic, $options: "i" }
    }

    const sort = {}
    sort[sortBy] = sortOrder

    const totalContents = await ArticleContentModel.countDocuments(filter)

    const contents = await ArticleContentModel.find(filter).sort(sort).skip(skip).limit(limit).select("-__v").lean()

    const totalPages = Math.ceil(totalContents / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    const transformedContents = contents.map((content) => ({
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
        exits: content.interactions?.exited?.length || 0,
      },
      interactions: content.interactions || {
        like: [],
        unlike: [],
        exited: [],
        wow: [],
        sad: [],
      },
      comments: content.comments || [],
      commentCount: content.comments ? content.comments.length : 0,
      totalReplies: content.comments
        ? content.comments.reduce((total, comment) => total + (comment.replies ? comment.replies.length : 0), 0)
        : 0,
    }))

    res.status(200).json({
      success: true,
      data: transformedContents,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalContents: totalContents,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        limit: limit,
      },
      filters: {
        category: category || null,
        topic: topic || null,
        sortBy: sortBy,
        sortOrder: sortOrder === 1 ? "asc" : "desc",
      },
    })
  } catch (error) {
    console.error("Error retrieving contents:", error)

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error occurred while retrieving contents",
    })
  }
})
// Route to handle article interactions
router.post('/article-interaction', async (req, res) => {
  try {
    const { 
      articleId, 
      interactionType, 
      userData, 
      action, 
      currentInteraction 
    } = req.body;

    // Validate required fields
    if (!articleId || !interactionType || !userData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: articleId, interactionType, and userData are required'
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
    if (!userData.phonenumber || !userData.name) {
      return res.status(400).json({
        success: false,
        message: 'User data must include phonenumber and name'
      });
    }

    // Find the article
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

    // Ensure all interaction arrays exist
    validInteractionTypes.forEach(type => {
      if (!article.interactions[type]) {
        article.interactions[type] = [];
      }
    });

    const userPhone = userData.phonenumber;

    // Remove user's previous interaction from all types
    validInteractionTypes.forEach(type => {
      article.interactions[type] = article.interactions[type].filter(
        interaction => interaction.phonenumber !== userPhone
      );
    });

    // If action is 'add', add the new interaction
    if (action === 'add') {
      article.interactions[interactionType].push({
        name: userData.name,
        phonenumber: userData.phonenumber,
        date: userData.date || new Date().toISOString()
      });
    }
    // If action is 'remove', we've already removed it above

    // Save the updated article
    await article.save();

    // Return success response
    res.json({
      success: true,
      message: action === 'add' ? 'Interaction added successfully' : 'Interaction removed successfully',
      data: {
        articleId: articleId,
        interactionType: interactionType,
        action: action,
        interactionCounts: {
          like: article.interactions.like.length,
          unlike: article.interactions.unlike.length,
          exited: article.interactions.exited.length,
          wow: article.interactions.wow.length,
          sad: article.interactions.sad.length
        }
      }
    });

  } catch (error) {
    console.error('Article interaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Optional: Route to get interaction counts for an article
router.get('/article-interactions/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findOne({ id: articleId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Initialize interactions if they don't exist
    const interactions = article.interactions || {
      like: [],
      unlike: [],
      exited: [],
      wow: [],
      sad: []
    };

    res.json({
      success: true,
      data: {
        articleId: articleId,
        interactionCounts: {
          like: interactions.like?.length || 0,
          unlike: interactions.unlike?.length || 0,
          exited: interactions.exited?.length || 0,
          wow: interactions.wow?.length || 0,
          sad: interactions.sad?.length || 0
        },
        totalInteractions: Object.values(interactions).reduce((total, arr) => total + (arr?.length || 0), 0)
      }
    });

  } catch (error) {
    console.error('Get article interactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Optional: Route to get user's interaction for a specific article
router.get('/user-article-interaction/:articleId/:phoneNumber', async (req, res) => {
  try {
    const { articleId, phoneNumber } = req.params;

    const article = await Article.findOne({ id: articleId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const interactions = article.interactions || {
      like: [],
      unlike: [],
      exited: [],
      wow: [],
      sad: []
    };

    // Find user's interaction
    let userInteraction = null;
    const validInteractionTypes = ['like', 'unlike', 'exited', 'wow', 'sad'];
    
    for (const type of validInteractionTypes) {
      if (interactions[type]?.some(interaction => interaction.phonenumber === phoneNumber)) {
        userInteraction = type;
        break;
      }
    }

    res.json({
      success: true,
      data: {
        articleId: articleId,
        phoneNumber: phoneNumber,
        userInteraction: userInteraction
      }
    });

  } catch (error) {
    console.error('Get user article interaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// Add Comment Route
router.post('/comment', async (req, res) => {
  try {
    const { articleId, comment, userData } = req.body;

    // Validate required fields
    if (!articleId || !comment || !userData?.name || !userData.phonenumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: articleId, comment, and userData (name, phonenumber) are required'
      });
    }

    // Find the article
    const article = await ArticleContentModel.findOne({ id: articleId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Create new comment object
    const newComment = {
      author: {
        name: userData.name
      },
      date: userData.date || new Date().toISOString(),
      comment: comment.trim(),
      replies: [],
      interactions: {
        like: [],
        unlike: [],
        exited: [],
        wow: [],
        sad: []
      }
    };

    // Initialize comments array if it doesn't exist
    if (!article.comments) {
      article.comments = [];
    }

    // Add comment to article
    article.comments.push(newComment);

    // Save the article
    await article.save();

    // Return success response with the new comment
    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
      totalComments: article.comments.length
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding comment'
    });
  }
});

// Add Reply Route
router.post('/reply', async (req, res) => {
  try {
    const { articleId, commentIndex, reply, userData } = req.body;

    // Validate required fields
    if (articleId === undefined || commentIndex === undefined || !reply || !userData?.name || !userData.phonenumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: articleId, commentIndex, reply, and userData (name, phonenumber) are required'
      });
    }

    // Find the article
    const article = await ArticleContentModel.findOne({ id: articleId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if comment exists
    if (!article.comments || !article.comments[commentIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Create new reply object
    const newReply = {
      name: userData.name,
      phonenumber: userData.phonenumber,
      date: userData.date || new Date().toISOString(),
      reply: reply.trim()
    };

    // Initialize replies array if it doesn't exist
    if (!article.comments[commentIndex].replies) {
      article.comments[commentIndex].replies = [];
    }

    // Add reply to comment
    article.comments[commentIndex].replies.push(newReply);

    // Save the article
    await article.save();

    // Return success response with the new reply
    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      reply: newReply,
      commentIndex: commentIndex,
      totalReplies: article.comments[commentIndex].replies.length
    });

  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding reply'
    });
  }
});

// Comment Interaction Route (for liking/unliking comments)
router.post('/comment-interaction', async (req, res) => {
  try {
    const { articleId, commentIndex, interactionType, userData, currentInteraction } = req.body;

    // Validate required fields
    if (articleId === undefined || commentIndex === undefined || !interactionType || !userData?.phonenumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find the article
    const article = await ArticleContentModel.findOne({ id: articleId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if comment exists
    if (!article.comments || !article.comments[commentIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const comment = article.comments[commentIndex];
    const userPhone = userData.phonenumber;

    // Initialize interactions if they don't exist
    if (!comment.interactions) {
      comment.interactions = {
        like: [],
        unlike: [],
        exited: [],
        wow: [],
        sad: []
      };
    }

    // Remove any existing interaction from this user
    const interactionTypes = ['like', 'unlike', 'exited', 'wow', 'sad'];
    interactionTypes.forEach(type => {
      if (comment.interactions[type]) {
        comment.interactions[type] = comment.interactions[type].filter(
          interaction => interaction.phonenumber !== userPhone
        );
      }
    });

    // Add new interaction if it's different from current
    if (interactionType !== currentInteraction) {
      if (!comment.interactions[interactionType]) {
        comment.interactions[interactionType] = [];
      }
      
      comment.interactions[interactionType].push({
        name: userData.name,
        phonenumber: userData.phonenumber,
        date: userData.date || new Date().toISOString()
      });
    }

    // Save the article
    await article.save();

    res.status(200).json({
      success: true,
      message: 'Comment interaction updated successfully'
    });

  } catch (error) {
    console.error('Comment interaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating comment interaction'
    });
  }
});


module.exports = router
