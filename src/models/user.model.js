import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import userRoles from "../utils/userRoles.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(userRoles.ADMIN, userRoles.USER),
      defaultValue: userRoles.USER,
    },
  },
  { timestamps: true }
);

export default User;
