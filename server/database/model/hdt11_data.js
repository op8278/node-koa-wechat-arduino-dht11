export default (sequelize, DataTypes) => {
  return sequelize.define(
    'hdt11_data',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      temperature: {
        type: DataTypes.STRING,
      },
      humidity: {
        type: DataTypes.STRING,
      },
      create_time: {
        type: DataTypes.DATE,
      },
      update_time: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
    }
  );
};
