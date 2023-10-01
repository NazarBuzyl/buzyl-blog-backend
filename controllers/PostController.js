import PostModel from "../models/Post.js";

// ---------------------------------------------------------------- Tags action (Last Tags - One Tag) ----------------------------------------------------------------
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .reduce((uniqueTags, tag) => {
        if (uniqueTags.length < 5 && !uniqueTags.includes(tag)) {
          uniqueTags.push(tag);
        }
        return uniqueTags;
      }, []);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error with tags",
    });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const posts = await PostModel.find({ tags: { $in: tagId } })
      .populate("user")
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error one tag",
    });
  }
};

// ---------------------------------------------------------------- Get posts (All - One - Popularity)  ----------------------------------------------------------------
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error with posts",
    });
  }
};

export const getPopularity = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ viewsCount: -1 })
      .populate("user")
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error with posts - popularity",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).populate("user");
    // const doc = await PostModel.findById(postId);
    // const decodedUser = await authMiddleware.decodeToken(req);

    // if (doc.user.toString() !== decodedUser._id.toString()) {
    //   await PostModel.findByIdAndUpdate(
    //     {
    //       _id: postId,
    //     },
    //     { $inc: { viewsCount: 1 } },
    //     { returnDocument: "after" }
    //   ).populate("user");
    // }

    if (!doc) {
      return res.status(404).json({ message: "Post didn`t found" });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error find post",
    });
  }
};

// ---------------------------------------------------------------- Action with posts ----------------------------------------------------------------
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndDelete({
      _id: postId,
    });

    if (!doc) {
      return res.status(404).json({ message: "Post didn`t found" });
    }

    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error delate post",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error with creating post",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags
          .split(/[,#.&]+/)
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error with update",
    });
  }
};
