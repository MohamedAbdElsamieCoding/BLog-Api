import sequelize from "../config/db.js";
import Post from "./post.model.js";
import User from "./user.model.js";
import Comment from "./comment.model.js";
import logger from "../config/logger.js";

const initAssociation = () => {
  User.hasMany(Post, {
    foreignKey: "userId",
    sourceKey: "id",
    onDelete: "CASCADE",
  });
  Post.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

  User.hasMany(Comment, {
    foreignKey: "userId",
    sourceKey: "id",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

  Post.hasMany(Comment, {
    foreignKey: "postId",
    sourceKey: "id",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(Post, { foreignKey: "postId", targetKey: "id" });
};

initAssociation();

sequelize
  .sync({ alter: true })
  .then(() => {
    logger.info("All models synced successfully");
  })
  .catch((err) => {
    logger.error(`Error syncing models ${err}`);
  });

export { User, Post, Comment };
export default sequelize;
