const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// CSV file paths
const CSV_PATHS = {
  products: path.join(__dirname, '../assets/products.csv'),
  pincodes: path.join(__dirname, '../assets/pincodes.csv'),
  stock: path.join(__dirname, '../assets/stock.csv'),
};

// Load CSV data
let products = [];
let pincodes = [];
let stock = [];

const loadCSVData = () => {
  try {
    // Load products
    const productsCSV = fs.readFileSync(CSV_PATHS.products, 'utf8');
    products = Papa.parse(productsCSV, { header: true }).data;

    // Load pincodes
    const pincodesCSV = fs.readFileSync(CSV_PATHS.pincodes, 'utf8');
    pincodes = Papa.parse(pincodesCSV, { header: true }).data;

    // Load stock
    const stockCSV = fs.readFileSync(CSV_PATHS.stock, 'utf8');
    stock = Papa.parse(stockCSV, { header: true }).data;

    console.log('CSV data loaded successfully');
    console.log(`Products: ${products.length}`);
    console.log(`Pincodes: ${pincodes.length}`);
    console.log(`Stock entries: ${stock.length}`);
  } catch (error) {
    console.error('Error loading CSV data:', error);
  }
};

// Delivery estimation logic (from utils/DeliveryEstimation.js)
const estimateDelivery = (provider, currentTime, pincodeType) => {
  if (provider === 'Provider A') {
    return currentTime.getHours() < 17 ? 'Same-day' : 'Next-day';
  } else if (provider === 'Provider B') {
    return currentTime.getHours() < 9 ? 'Same-day' : 'Next-day';
  } else {
    // General Partners
    switch (pincodeType) {
      case 'metro':
        return '2 days';
      case 'non-metro':
        return '3 days';
      default:
        return '5 days';
    }
  }
};

// Get provider by pincode
const getProviderByPincode = (pincode) => {
  return pincodes.find(p => p.Pincode === pincode);
};

// Calculate delivery date (from App.js logic)
const calculateDeliveryDate = (providerName, regionType) => {
  const currentTime = moment();
  const cutoffTime = moment().set({ hour: 15, minute: 0 });

  if (currentTime.isBefore(cutoffTime)) {
    return {
      estimatedDate: currentTime.format('YYYY-MM-DD'),
      countdown: `${cutoffTime.diff(currentTime, 'minutes')} minutes left for same-day delivery`,
      isSameDay: true
    };
  }

  let estimated;

  if (providerName === "Provider A") {
    const cutoff = moment().set({ hour: 14, minute: 0 });
    if (currentTime.isBefore(cutoff)) {
      return {
        estimatedDate: currentTime.format('YYYY-MM-DD'),
        countdown: `${cutoff.diff(currentTime, 'minutes')} mins left for same-day delivery`,
        isSameDay: true
      };
    } else {
      estimated = currentTime.add(1, 'day').format('YYYY-MM-DD');
    }
  } else if (providerName === "Provider B") {
    const cutoff = moment().set({ hour: 14, minute: 0 });
    if (currentTime.isBefore(cutoff)) {
      return {
        estimatedDate: currentTime.format('YYYY-MM-DD'),
        countdown: `${cutoff.diff(currentTime, 'minutes')} mins left for same-day delivery`,
        isSameDay: true
      };
    } else {
      estimated = currentTime.add(1, 'day').format('YYYY-MM-DD');
    }
  } else {
    const deliveryRange = regionType === 'metro' ? 2 : regionType === 'non-metro' ? 3 : 5;
    estimated = currentTime.add(deliveryRange, 'days').format('YYYY-MM-DD');
  }

  return {
    estimatedDate: estimated,
    countdown: null,
    isSameDay: false
  };
};

// Check product stock
const checkProductStock = (productId) => {
  const stockEntry = stock.find(s => s['Product ID'] === productId.toString());
  return stockEntry ? stockEntry['Stock Available'] === 'True' : false;
};

// API Routes

// Get delivery estimate by pincode
app.get('/api/estimate', (req, res) => {
  try {
    const { pincode, productId } = req.query;
    
    if (!pincode) {
      return res.status(400).json({ error: 'Pincode is required' });
    }

    const providerData = getProviderByPincode(pincode);
    
    if (!providerData) {
      return res.status(404).json({ error: 'Invalid pincode' });
    }

    // Check product stock if productId is provided
    let stockAvailable = true;
    if (productId) {
      stockAvailable = checkProductStock(productId);
      if (!stockAvailable) {
        return res.status(400).json({ 
          error: 'Product is out of stock',
          pincode,
          provider: providerData['Logistics Provider'],
          tat: providerData.TAT
        });
      }
    }

    const deliveryInfo = calculateDeliveryDate(providerData['Logistics Provider'], 'metro');
    
    res.json({
      pincode,
      provider: providerData['Logistics Provider'],
      tat: providerData.TAT,
      estimatedDate: deliveryInfo.estimatedDate,
      countdown: deliveryInfo.countdown,
      isSameDay: deliveryInfo.isSameDay,
      stockAvailable
    });
  } catch (error) {
    console.error('Error in estimate endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const productsWithStock = products.map(product => ({
      ...product,
      stockAvailable: checkProductStock(product['Product ID'])
    }));
    
    res.json(productsWithStock);
  } catch (error) {
    console.error('Error in products endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = req.params.id;
    const product = products.find(p => p['Product ID'] === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productWithStock = {
      ...product,
      stockAvailable: checkProductStock(productId)
    };
    
    res.json(productWithStock);
  } catch (error) {
    console.error('Error in product endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pincode info
app.get('/api/pincodes/:pincode', (req, res) => {
  try {
    const pincode = req.params.pincode;
    const pincodeData = getProviderByPincode(pincode);
    
    if (!pincodeData) {
      return res.status(404).json({ error: 'Pincode not found' });
    }
    
    res.json(pincodeData);
  } catch (error) {
    console.error('Error in pincode endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    dataLoaded: {
      products: products.length,
      pincodes: pincodes.length,
      stock: stock.length
    }
  });
});

// Load data on startup
loadCSVData();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Available endpoints:');
  console.log('- GET /api/estimate?pincode=<pincode>&productId=<id>');
  console.log('- GET /api/products');
  console.log('- GET /api/products/:id');
  console.log('- GET /api/pincodes/:pincode');
  console.log('- GET /api/health');
});
