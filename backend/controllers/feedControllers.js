const getFeeds = (req, res, next) => {
  res.json([{ id: "1", title: "My feed", content: "This is a feed" }]);
};

const createPost = (req, res, next) => {
  const { title, content } = req.body;
  res.json({
    message: "Post successfully created!",
    post: { id: new Date().toISOString(), title, content },
  });
};

module.exports = { getFeeds, createPost };
