import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js'


const SocialMediaLinks = sequelize.define('SocialMediaLinks',{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    url:{
        type: DataTypes.STRING,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    
    updatedBy:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
},
{
    timestamps: true,
    tableName:'socialmedialinks'       
}
);

SocialMediaLinks.belongsTo(User, { foreignKey: 'createdBy' });
SocialMediaLinks.belongsTo(User, { foreignKey: 'updatedBy' });

export default SocialMediaLinks;