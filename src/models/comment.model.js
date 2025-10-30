import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Post from "./post.model.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  { timestamps: true }
);

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

export default Comment;
