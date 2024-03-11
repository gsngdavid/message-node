const getPosts = (req, res, next) => {
  res.json({
    posts: [
      {
        _id: "1",
        title: "My feed",
        content: "This is a feed",
        creator: { name: "David" },
        createdAt: new Date(),
        imageUrl: "/images/duck.jpg",
      },
    ],
    totalItems: 1,
  });
};

const createPost = (req, res, next) => {
  const { title, content } = req.body;
  res.json({
    message: "Post successfully created!",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      createdAt: new Date(),
      creator: { name: "David" },
    },
  });
};

module.exports = { getPosts, createPost };
