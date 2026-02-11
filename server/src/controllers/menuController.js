
const { query } = require('../config/db');

const getCategories = async (req, res) => {
    try {
        const result = await query('SELECT * FROM Categories ORDER BY OrderIndex');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const result = await query('SELECT p.*, c.Name as CategoryName FROM Products p JOIN Categories c ON p.CategoryId = c.Id WHERE p.IsActive = 1 ORDER BY p.OrderIndex');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    console.log('--- Create Product Request Received ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    // Safe destructuring
    const body = req.body || {};
    const { Name, Description, Price, CategoryId } = body;
    let { ImageUrl } = body;

    if (req.file) {
        ImageUrl = `/uploads/${req.file.filename}`;
    }

    // Ensure Price is a number for SQL
    const safePrice = parseFloat(Price);
    if (isNaN(safePrice)) {
        console.error('Invalid Price:', Price);
        return res.status(400).json({ error: 'Invalid Price' });
    }

    try {
        const q = `
      INSERT INTO Products (Name, Description, Price, ImageUrl, CategoryId)
      VALUES ('${Name}', '${Description}', ${safePrice}, '${ImageUrl}', ${CategoryId})
    `;
        console.log('Executing Query:', q);

        await query(q);
        console.log('Product created successfully');
        res.status(201).json({ message: 'Product created' });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { Name, Description, Price, ImageUrl, CategoryId, IsActive } = req.body;
    try {
        await query(`
      UPDATE Products 
      SET Name='${Name}', Description='${Description}', Price=${Price}, ImageUrl='${ImageUrl}', CategoryId=${CategoryId}, IsActive=${IsActive ? 1 : 0}
      WHERE Id = ${id}
    `);
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCategories,
    getProducts,
    createProduct,
    updateProduct
};
