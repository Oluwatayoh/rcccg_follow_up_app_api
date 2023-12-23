const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://motopay:Greatperson1@motopay.ml5ginx.mongodb.net/rccg', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// BioData schema
const bioDataSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  program: String,
  date: Date,
});

const BioData = mongoose.model('BioData', bioDataSchema);

// Program schema
const programSchema = new mongoose.Schema({
    name: String,
  });
  
  const Program = mongoose.model('Program', programSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BioData API',
      version: '1.0.0',
    },
  },
  apis: ['app.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /biodata:
 *   post:
 *     summary: Create BioData
 *     description: Add new BioData to the database
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BioData'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               message: BioData created successfully
 */
app.post('/biodata', async (req, res) => {
  try {
    const { name, phoneNumber, program, date } = req.body;
    const bioData = new BioData({ name, phoneNumber, program, date });
    await bioData.save();
    res.json({ message: 'BioData created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /biodata:
 *   get:
 *     summary: Get all BioData
 *     description: Retrieve a list of all saved BioData
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               biodata: []
 */
app.get('/biodata', async (req, res) => {
  try {
    const biodata = await BioData.find();
    res.json({ biodata });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /biodata/program/{program}:
 *   get:
 *     summary: Get BioData by Program
 *     description: Retrieve BioData filtered by program
 *     parameters:
 *       - in: path
 *         name: program
 *         required: true
 *         description: Program name for filtering BioData
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               biodata: []
 */
app.get('/biodata/program/:program', async (req, res) => {
  try {
    const { program } = req.params;
    const biodata = await BioData.find({ program });
    res.json({ biodata });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     BioData:
 *       type: object
 *       required:
 *         - name
 *         - phoneNumber
 *         - program
 *         - date
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the person
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the person
 *         program:
 *           type: string
 *           description: Program name
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the BioData
 */


// ... (previous code)

/**
 * @swagger
 * /biodata/{id}:
 *   get:
 *     summary: Get BioData by ID
 *     description: Retrieve BioData by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: BioData ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               biodata: {}
 */
app.get('/biodata/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const bioData = await BioData.findById(id);
      if (!bioData) {
        return res.status(404).json({ error: 'BioData not found' });
      }
      res.json({ biodata: bioData });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  /**
   * @swagger
   * /biodata/{id}:
   *   put:
   *     summary: Update BioData by ID
   *     description: Update BioData's information by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: BioData ID
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BioData'
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             example:
   *               message: BioData updated successfully
   */
  app.put('/biodata/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phoneNumber, program, date } = req.body;
      const bioData = await BioData.findByIdAndUpdate(id, { name, phoneNumber, program, date }, { new: true });
      if (!bioData) {
        return res.status(404).json({ error: 'BioData not found' });
      }
      res.json({ message: 'BioData updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  /**
   * @swagger
   * /biodata/{id}:
   *   delete:
   *     summary: Delete BioData by ID
   *     description: Delete BioData by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: BioData ID
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             example:
   *               message: BioData deleted successfully
   */
  app.delete('/biodata/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const bioData = await BioData.findByIdAndDelete(id);
      if (!bioData) {
        return res.status(404).json({ error: 'BioData not found' });
      }
      res.json({ message: 'BioData deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  /**
   * @swagger
   * /program:
   *   post:
   *     summary: Create Program
   *     description: Add new Program to the database
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Program'
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             example:
   *               message: Program created successfully
   */
  app.post('/program', async (req, res) => {
    try {
      const { name } = req.body;
      // Check if program with the same name already exists
      const existingProgram = await Program.findOne({ name });
      if (existingProgram) {
        return res.status(400).json({ error: 'Program with the same name already exists' });
      }
      const program = new Program({ name });
      await program.save();
      res.json({ message: 'Program created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  /**
   * @swagger
   * /program:
   *   get:
   *     summary: Get all Programs
   *     description: Retrieve a list of all saved Programs
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             example:
   *               programs: []
   */
  app.get('/program', async (req, res) => {
    try {
      const programs = await Program.find();
      res.json({ programs });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  /**
   * @swagger
   * /program/{id}:
   *   delete:
   *     summary: Delete Program by ID
   *     description: Delete Program by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Program ID
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             example:
   *               message: Program deleted successfully
   */
  app.delete('/program/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const program = await Program.findByIdAndDelete(id);
      if (!program) {
        return res.status(404).json({ error: 'Program not found' });
      }
      res.json({ message: 'Program deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

/**
 * @swagger
 * /biodata/date/{date}:
 *   get:
 *     summary: Get BioData by Date
 *     description: Retrieve BioData filtered by date
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: Date for filtering BioData
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               biodata: []
 */
app.get('/biodata/date/:date', async (req, res) => {
    try {
      const { date } = req.params;
      const bioData = await BioData.find({ date: { $gte: new Date(date) } });
      res.json({ biodata });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
