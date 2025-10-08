'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_events', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      event_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      product_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      product_name: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for common query patterns
    await queryInterface.addIndex('product_events', ['event_id']);
    await queryInterface.addIndex('product_events', ['user_id']);
    await queryInterface.addIndex('product_events', ['event_type']);
    await queryInterface.addIndex('product_events', ['timestamp']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_events');
  },
};
