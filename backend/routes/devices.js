import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all devices
router.get('/devices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM devices ORDER BY id DESC');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single device
router.get('/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM devices WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching device:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed database with 50 items
router.post('/devices/seed', async (req, res) => {
  try {
    // Start transaction
    await pool.query('BEGIN');
    
    // Clear existing
    await pool.query('DELETE FROM devices');
    
    const sampleDevices = [
      ['MacBook Pro 16"', 'Laptop', 'In Use', 'Boston, US', 'Jane Smith', 'Excellent'],
      ['iPhone 14 Pro', 'Mobile', 'Active', 'New York, US', 'John Doe', 'Excellent'],
      ['iPad Air 5th Gen', 'Tablet', 'Active', 'San Francisco, US', 'Mike Johnson', 'Good'],
      ['Dell UltraSharp 27"', 'Monitor', 'Available', 'New York, US', 'Unassigned', 'Good'],
      ['Sony WH-1000XM5', 'Audio', 'In Use', 'Chicago, US', 'Sarah Wilson', 'Fair'],
      ['ThinkPad X1 Carbon', 'Laptop', 'In Use', 'San Francisco, US', 'Emily Davis', 'Good'],
      ['Google Pixel 7 Pro', 'Mobile', 'Available', 'Boston, US', 'Unassigned', 'Excellent'],
      ['iPad Pro 12.9"', 'Tablet', 'In Use', 'Chicago, US', 'David Brown', 'Excellent'],
      ['HP EliteBook 840', 'Laptop', 'Inactive', 'New York, US', 'James Wilson', 'Poor'],
      ['Logitech MX Master 3S', 'Accessory', 'Active', 'Boston, US', 'Linda Martinez', 'Good'],
      ['Bose QuietComfort 45', 'Audio', 'In Use', 'London, UK', 'Robert Taylor', 'Good'],
      ['Samsung Galaxy S23', 'Mobile', 'Active', 'Munich, DE', 'Hans Schmidt', 'Good'],
      ['LG UltraFine 5K', 'Monitor', 'Available', 'London, UK', 'Unassigned', 'Excellent'],
      ['Apple Magic Keyboard', 'Accessory', 'Available', 'San Francisco, US', 'Unassigned', 'Good'],
      ['AirPods Pro 2nd Gen', 'Audio', 'In Use', 'Tokyo, JP', 'Yuki Tanaka', 'Excellent'],
      ['Dell XPS 15', 'Laptop', 'In Use', 'Austin, US', 'Chris Evans', 'Good'],
      ['Samsung Galaxy Tab S8', 'Tablet', 'Available', 'Austin, US', 'Unassigned', 'Good'],
      ['Anker USB-C Hub', 'Accessory', 'Active', 'New York, US', 'John Doe', 'Good'],
      ['Focusrite Scarlett 2i2', 'Audio', 'Available', 'Boston, US', 'Unassigned', 'Fair'],
      ['Asus ProArt 32"', 'Monitor', 'In Use', 'San Francisco, US', 'Mike Johnson', 'Excellent'],
      ['Lenovo Yoga Book', 'Laptop', 'Active', 'Seattle, US', 'Alice Green', 'Good'],
      ['OnePlus 11', 'Mobile', 'Available', 'Seattle, US', 'Unassigned', 'Good'],
      ['Surface Pro 9', 'Tablet', 'In Use', 'Denver, US', 'Bob Miller', 'Excellent'],
      ['SteelSeries Headset', 'Audio', 'Active', 'Denver, US', 'Bob Miller', 'Fair'],
      ['Keychron K2 Keyboard', 'Accessory', 'Active', 'Austin, US', 'Chris Evans', 'Excellent'],
      ['Mac Studio', 'Desktop', 'In Use', 'Los Angeles, US', 'Tom Holland', 'Excellent'],
      ['Apple Studio Display', 'Monitor', 'In Use', 'Los Angeles, US', 'Tom Holland', 'Excellent'],
      ['iPhone SE', 'Mobile', 'Active', 'Los Angeles, US', 'Zendaya Coleman', 'Good'],
      ['Kindle Paperwhite', 'Tablet', 'Available', 'New York, US', 'Unassigned', 'Excellent'],
      ['Blue Yeti Microphone', 'Audio', 'Available', 'Chicago, US', 'Unassigned', 'Good'],
      ['Wacom Intuos Pro', 'Accessory', 'In Use', 'London, UK', 'Robert Taylor', 'Fair'],
      ['Razer Blade 16', 'Laptop', 'In Use', 'Tokyo, JP', 'Kenji Sato', 'Excellent'],
      ['Samsung Odyssey G9', 'Monitor', 'Available', 'Tokyo, JP', 'Unassigned', 'Good'],
      ['Sony LinkBuds S', 'Audio', 'Inactive', 'Munich, DE', 'Hans Schmidt', 'Poor'],
      ['Elgato Stream Deck', 'Accessory', 'Active', 'San Francisco, US', 'Emily Davis', 'Excellent'],
      ['Mac mini M2', 'Desktop', 'Available', 'Boston, US', 'Unassigned', 'Good'],
      ['Logitech C920 Webcam', 'Accessory', 'Active', 'Chicago, US', 'Sarah Wilson', 'Good'],
      ['iPad Mini 6', 'Tablet', 'In Use', 'New York, US', 'John Doe', 'Good'],
      ['Google Pixel Fold', 'Mobile', 'Inactive', 'San Francisco, US', 'Emily Davis', 'Poor'],
      ['Jabra Evolve2 65', 'Audio', 'In Use', 'Boston, US', 'Linda Martinez', 'Good'],
      ['CalDigit TS4 Dock', 'Accessory', 'In Use', 'Austin, US', 'Chris Evans', 'Excellent'],
      ['Dell OptiPlex 7090', 'Desktop', 'Active', 'New York, US', 'Unassigned', 'Good'],
      ['HP ZBook Studio', 'Laptop', 'In Use', 'Munich, DE', 'Dieter Meyer', 'Good'],
      ['Garmin Venu 3', 'Wearable', 'Active', 'Munich, DE', 'Dieter Meyer', 'Excellent'],
      ['Apple Watch Series 9', 'Wearable', 'In Use', 'Boston, US', 'Jane Smith', 'Excellent'],
      ['Samsung Galaxy Watch 6', 'Wearable', 'Active', 'Seattle, US', 'Alice Green', 'Good'],
      ['Shure SM7B Mic', 'Audio', 'In Use', 'Los Angeles, US', 'Tom Holland', 'Excellent'],
      ['Sennheiser HD 600', 'Audio', 'Active', 'London, UK', 'Robert Taylor', 'Good'],
      ['Ubiquiti UniFi Switch', 'Networking', 'Active', 'New York, US', 'System Admin', 'Excellent'],
      ['Synology NAS 4-Bay', 'Storage', 'Active', 'New York, US', 'System Admin', 'Good']
    ];

    for (const dev of sampleDevices) {
      await pool.query(
        'INSERT INTO devices (name, type, status, location, assigned_to, condition, last_updated) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
        dev
      );
    }
    
    await pool.query('COMMIT');
    
    const result = await pool.query('SELECT * FROM devices ORDER BY id DESC');
    res.json({
      success: true,
      message: 'Database seeded with 50 devices successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error seeding database:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
