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

// POST /content/interaction - Handle article interactions
router.post("/interaction", async (req, res) => {
  try {
    const { articleId, interactionType, userData, currentInteraction } = req.body

    // Validation
    if (!articleId || !interactionType || !userData) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    const validInteractionTypes = ["like", "unlike", "exited", "wow", "sad"]
    if (!validInteractionTypes.includes(interactionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interaction type",
      })
    }

    if (!userData.name || !userData.phonenumber) {
      return res.status(400).json({
        success: false,
        message: "User data incomplete",
      })
    }

    // Find the article by id field (not _id)
    const article = await ArticleContentModel.findOne({ id: articleId })
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      })
    }

    // Initialize interactions object if it doesn't exist
    if (!article.interactions) {
      article.interactions = {
        like: [],
        unlike: [],
        exited: [],
        wow: [],
        sad: [],
      }
    }

    // Helper function to remove user from all interaction types
    const removeUserFromAllInteractions = (phoneNumber) => {
      const interactionTypes = ["like", "unlike", "exited", "wow", "sad"]
      interactionTypes.forEach((type) => {
        if (article.interactions[type]) {
          article.interactions[type] = article.interactions[type].filter(
            (interaction) => interaction.phonenumber !== phoneNumber,
          )
        }
      })
    }

    // Check if user already has an interaction
    const userPhone = userData.phonenumber
    let hasExistingInteraction = false
    let existingInteractionType = null

    // Find existing interaction
    const interactionTypes = ["like", "unlike", "exited", "wow", "sad"]
    for (const type of interactionTypes) {
      if (article.interactions[type]) {
        const existingIndex = article.interactions[type].findIndex(
          (interaction) => interaction.phonenumber === userPhone,
        )
        if (existingIndex !== -1) {
          hasExistingInteraction = true
          existingInteractionType = type
          break
        }
      }
    }

    // Logic for handling interactions
    if (hasExistingInteraction && existingInteractionType === interactionType) {
      // User is removing their current interaction (toggle off)
      removeUserFromAllInteractions(userPhone)
    } else {
      // User is adding new interaction or changing existing one
      removeUserFromAllInteractions(userPhone)

      // Add to the new interaction type
      if (!article.interactions[interactionType]) {
        article.interactions[interactionType] = []
      }

      article.interactions[interactionType].push({
        name: userData.name,
        phonenumber: userData.phonenumber,
        date: userData.date || new Date().toISOString(),
      })
    }

    // Save the updated article
    await article.save()

    // Return updated article with interaction counts
    const interactionCounts = {}
    interactionTypes.forEach((type) => {
      interactionCounts[getInteractionMappedType(type)] = article.interactions[type]
        ? article.interactions[type].length
        : 0
    })

    // Determine user's current interaction after update
    let newUserInteraction = null
    for (const type of interactionTypes) {
      if (article.interactions[type]) {
        const hasInteraction = article.interactions[type].some((interaction) => interaction.phonenumber === userPhone)
        if (hasInteraction) {
          newUserInteraction = type
          break
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Interaction updated successfully",
      data: {
        articleId: article.id,
        interactionCounts: interactionCounts,
        userInteraction: newUserInteraction,
        totalInteractions: Object.values(interactionCounts).reduce((sum, count) => sum + count, 0),
      },
    })
  } catch (error) {
    console.error("Error updating article interaction:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
})

// GET user's interaction for a specific article
router.get("/user-interaction/:articleId/:phoneNumber", async (req, res) => {
  try {
    const { articleId, phoneNumber } = req.params

    if (!articleId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Article ID and phone number are required",
      })
    }

    // Find the article and check user's interaction
    const article = await ArticleContentModel.findOne({ id: articleId })

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      })
    }

    let userInteraction = null
    const interactionTypes = ["like", "unlike", "exited", "wow", "sad"]

    for (const type of interactionTypes) {
      if (article.interactions?.[type]) {
        const hasInteraction = article.interactions[type].some((interaction) => interaction.phonenumber === phoneNumber)
        if (hasInteraction) {
          userInteraction = {
            type: type,
            date: article.interactions[type].find((interaction) => interaction.phonenumber === phoneNumber)?.date,
          }
          break
        }
      }
    }

    return res.json({
      success: true,
      interaction: userInteraction,
      message: userInteraction ? "User interaction found" : "No interaction found for this user and article",
    })
  } catch (error) {
    console.error("Error fetching user interaction:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// GET all interactions for a specific article
router.get("/article-interactions/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: "Article ID is required",
      })
    }

    const article = await ArticleContentModel.findOne({ id: articleId })

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      })
    }

    const interactionCounts = {
      likes: article.interactions?.like?.length || 0,
      unlikes: article.interactions?.unlike?.length || 0,
      wows: article.interactions?.wow?.length || 0,
      exits: article.interactions?.exited?.length || 0,
      sads: article.interactions?.sad?.length || 0,
    }

    return res.json({
      success: true,
      interactionCounts: interactionCounts,
      totalInteractions: Object.values(interactionCounts).reduce((sum, count) => sum + count, 0),
    })
  } catch (error) {
    console.error("Error fetching article interactions:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Helper function to map interaction types
function getInteractionMappedType(type) {
  const typeMapping = {
    like: "likes",
    wow: "wows",
    exited: "exits",
    sad: "sads",
    unlike: "unlikes",
  }
  return typeMapping[type] || type
}

module.exports = router
