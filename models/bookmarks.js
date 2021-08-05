const bookmark = (sequelize, DataTypes) => {
    const Bookmark = sequelize.define('bookmark', {
        url: {
            type: DataTypes.STRING(30)
        }
    },{
        timestamps: false
    })
    return Bookmark
}

module.exports = bookmark; 
