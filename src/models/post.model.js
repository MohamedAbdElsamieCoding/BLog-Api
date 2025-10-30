import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);
User.hasMany(Post, {
  foreignKey: "userId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
Post.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

export default Post;
