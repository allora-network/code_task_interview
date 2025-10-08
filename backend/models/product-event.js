const { Sequelize, DataTypes } = require('sequelize');

class ProductEvent {
  constructor(sequelize) {
    this.model = sequelize.define('product_events', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      eventId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'event_id',
      },
      eventType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'event_type',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'user_id',
      },
      productId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'product_id',
      },
      productName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'product_name',
      },
      category: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    }, {
      tableName: 'product_events',
      timestamps: true,
      underscored: true,
    });
  }

  async create(eventData) {
    return await this.model.create({
      eventId: eventData.eventId,
      eventType: eventData.eventType,
      timestamp: eventData.timestamp,
      userId: eventData.userId,
      productId: eventData.productId,
      productName: eventData.productName,
      category: eventData.category,
      price: eventData.price,
      currency: eventData.currency,
      quantity: eventData.quantity,
      metadata: eventData.metadata,
    });
  }
}

module.exports = ProductEvent;
