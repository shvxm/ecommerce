const {
  getProductReviews,
  createReview,
} = require("./review.service");

const getProductReviewsController =
  async (req, res, next) => {
    try {
      const reviews =
        await getProductReviews(
          req.params.productId
        );

      res.status(200).json({
        success: true,
        message:
          "Reviews fetched successfully",
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  };

const createReviewController =
  async (req, res, next) => {
    try {
      const {
        rating,
        comment,
      } = req.body;

      if (!rating) {
        return res.status(400).json({
          success: false,
          message: "Rating is required",
        });
      }

      if (!comment?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Review comment is required",
        });
      }

      if (
        Number(rating) < 1 ||
        Number(rating) > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 1 and 5",
        });
      }

      const review =
        await createReview(
          req.user.userId,
          req.params.productId,
          Number(rating),
          comment
        );

      res.status(201).json({
        success: true,
        message:
          "Review submitted successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getProductReviewsController,
  createReviewController,
};