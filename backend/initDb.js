import pool from './db.js';

const initializeDatabase = async () => {
  try {
    // Create devices table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS devices (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        location VARCHAR(100) NOT NULL,
        assigned_to VARCHAR(100) NOT NULL,
        condition VARCHAR(50) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log(' Devices table created successfully');

    // Check if table has data
    const result = await pool.query('SELECT COUNT(*) FROM devices');
    
    if (result.rows[0].count === 0) {
      // Insert sample data
      await pool.query(`
        INSERT INTO devices (name, type, status, location, assigned_to, condition, last_updated)
        VALUES
          ('iPhone 12', 'Mobile', 'Active', 'New York, US', 'John Doe', 'Good', NOW()),
          ('MacBook Pro', 'Laptop', 'In Use', 'Boston, US', 'Jane Smith', 'Excellent', NOW()),
          ('iPad Air', 'Tablet', 'Active', 'San Francisco, US', 'Mike Johnson', 'Good', NOW()),
          ('Dell Monitor', 'Monitor', 'Available', 'New York, US', 'Unassigned', 'Good', NOW()),
          ('Sony Headphones', 'Audio', 'In Use', 'Chicago, US', 'Sarah Wilson', 'Fair', NOW());
      `);
      console.log(' Sample data inserted successfully');
    } else {
      console.log(' Database already has data');
    }

  } catch (err) {
    console.error(' Database initialization error:', err);
    process.exit(1);
  }
};

export default initializeDatabase;
