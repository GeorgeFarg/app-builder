import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Multer upload
const upload = multer({ dest: 'uploads/' });

// Product interface
interface IProduct extends Document {
  name: string;
  price: number;
  from: string;
}

// Project interface
interface IProject extends Document {
  data: any; // Can be string, object, array, etc.
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const productSchema = new Schema<IProduct>({
  name: String,
  price: Number,
  from: String,
});

// Project Schema
const projectSchema = new Schema<IProject>(
  {
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Models
const Product = mongoose.model<IProduct>('Product', productSchema);
const Project = mongoose.model<IProject>('Project', projectSchema);

// ============================================
// PRODUCT ROUTES (Your existing code)
// ============================================

// Upload JSON endpoint
router.post('/upload-json', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '❌ No file uploaded' });
    }

    const filePath = path.join(process.cwd(), req.file.path);

    // Read JSON file
    const jsonContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(jsonContent);

    // Insert into MongoDB
    await Product.insertMany(jsonData);

    // Delete temp file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: '✅ JSON data saved successfully!',
      count: jsonData.length,
    });

  } catch (error) {
    console.error('❌ Error while saving data:', error);
    res.status(500).json({ message: '❌ Failed to save data', error });
  }
});

// ============================================
// PROJECT CRUD ROUTES
// ============================================

// CREATE - Add new project (with file upload support)
router.post('/projects', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let data;

    // If file is uploaded, read and parse it
    if (req.file) {
      const filePath = path.join(process.cwd(), req.file.path);
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Try to parse as JSON, if fails store as plain text
      try {
        data = JSON.parse(fileContent);
      } catch {
        data = fileContent;
      }

      // Delete temp file
      fs.unlinkSync(filePath);
    } 
    // If no file, get data from body
    else if (req.body.data) {
      data = req.body.data;
    } 
    else {
      return res.status(400).json({ message: '❌ Either file or data attribute is required' });
    }

    const newProject = new Project({ data });
    await newProject.save();

    res.status(201).json({
      message: '✅ Project created successfully!',
      project: newProject,
    });

  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({ message: '❌ Failed to create project', error });
  }
});

// READ - Get all projects
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: '✅ Projects fetched successfully!',
      count: projects.length,
      projects,
    });

  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ message: '❌ Failed to fetch projects', error });
  }
});

// READ - Get single project by ID
router.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '❌ Invalid project ID' });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: '❌ Project not found' });
    }

    res.status(200).json({
      message: '✅ Project fetched successfully!',
      project,
    });

  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(500).json({ message: '❌ Failed to fetch project', error });
  }
});

// UPDATE - Update project by ID (with file upload support)
router.put('/projects/:id', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let data;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '❌ Invalid project ID' });
    }

    // If file is uploaded, read and parse it
    if (req.file) {
      const filePath = path.join(process.cwd(), req.file.path);
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Try to parse as JSON, if fails store as plain text
      try {
        data = JSON.parse(fileContent);
      } catch {
        data = fileContent;
      }

      // Delete temp file
      fs.unlinkSync(filePath);
    } 
    // If no file, get data from body
    else if (req.body.data) {
      data = req.body.data;
    } 
    else {
      return res.status(400).json({ message: '❌ Either file or data attribute is required' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { data },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: '❌ Project not found' });
    }

    res.status(200).json({
      message: '✅ Project updated successfully!',
      project: updatedProject,
    });

  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({ message: '❌ Failed to update project', error });
  }
});

// DELETE - Delete project by ID
router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '❌ Invalid project ID' });
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: '❌ Project not found' });
    }

    res.status(200).json({
      message: '✅ Project deleted successfully!',
      project: deletedProject,
    });

  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ message: '❌ Failed to delete project', error });
  }
});

export default router;

// ============================================
// PRODUCT ROUTES
// ============================================

// READ - Get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      message: '✅ Products fetched successfully!',
      count: products.length,
      products,
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: '❌ Failed to fetch products', error });
  }
});