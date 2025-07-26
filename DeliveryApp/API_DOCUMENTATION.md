# Delivery Estimation API Documentation

## Overview
The Delivery Estimation API provides real-time delivery estimates based on pincode, product availability, and logistics provider data. The API integrates with CSV data sources for products, pincodes, and stock information.

## Base URL
- **Development**: `http://localhost:3001`
- **Production**: Configure via environment variables

## API Endpoints

### 1. Health Check
**GET** `/api/health`

Returns the health status of the API and data loading information.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-26T04:14:12.975Z",
  "dataLoaded": {
    "products": 5001,
    "pincodes": 25002,
    "stock": 5001
  }
}
```

### 2. Delivery Estimation
**GET** `/api/estimate`

Get delivery estimation based on pincode and optional product ID.

**Query Parameters:**
- `pincode` (required): 6-digit pincode
- `productId` (optional): Product ID to check stock availability

**Example Request:**
```
GET /api/estimate?pincode=100001&productId=1
```

**Success Response (200):**
```json
{
  "pincode": "100001",
  "provider": "Provider A",
  "tat": "5",
  "estimatedDate": "2025-07-26",
  "countdown": "316 minutes left for same-day delivery",
  "isSameDay": true,
  "stockAvailable": true
}
```

**Error Responses:**
- `400 Bad Request`: Missing pincode
- `404 Not Found`: Invalid pincode
- `400 Bad Request`: Product out of stock (when productId provided)

### 3. Get All Products
**GET** `/api/products`

Returns all products with stock availability information.

**Response:**
```json
[
  {
    "Product ID": "1",
    "Product Name": "Product 1",
    "Price": "63.54",
    "stockAvailable": true
  },
  {
    "Product ID": "2",
    "Product Name": "Product 2",
    "Price": "129.96",
    "stockAvailable": false
  }
]
```

### 4. Get Product by ID
**GET** `/api/products/:id`

Returns a specific product by ID with stock availability.

**Path Parameters:**
- `id`: Product ID

**Example Request:**
```
GET /api/products/1
```

**Response:**
```json
{
  "Product ID": "1",
  "Product Name": "Product 1",
  "Price": "63.54",
  "stockAvailable": true
}
```

### 5. Get Pincode Information
**GET** `/api/pincodes/:pincode`

Returns logistics provider information for a specific pincode.

**Path Parameters:**
- `pincode`: 6-digit pincode

**Example Request:**
```
GET /api/pincodes/100001
```

**Response:**
```json
{
  "Pincode": "100001",
  "Logistics Provider": "Provider A",
  "TAT": "5"
}
```

## Data Sources

### CSV Files
The API uses three CSV files for data:

1. **products.csv** - Product catalog with pricing
2. **pincodes.csv** - Pincode to logistics provider mapping
3. **stock.csv** - Product stock availability

### Data Structure

#### Products CSV
```csv
Product ID,Product Name,Price
1,Product 1,63.54
2,Product 2,129.96
```

#### Pincodes CSV
```csv
Pincode,Logistics Provider,TAT
100000,Provider B,3
100001,Provider A,5
```

#### Stock CSV
```csv
Product ID,Stock Available
1,True
2,False
```

## Delivery Logic

### Provider Rules
1. **Provider A**: Same-day delivery if ordered before 5 PM, next-day otherwise
2. **Provider B**: Same-day delivery if ordered before 9 AM, next-day otherwise
3. **General Partners**: 2-5 days based on region type

### Same-Day Delivery
- Available based on current time and provider cutoff times
- Countdown timer shows remaining time for same-day delivery
- `isSameDay` flag indicates eligibility

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message description"
}
```

### Common Error Codes
- `400`: Bad Request (missing parameters, invalid data)
- `404`: Not Found (invalid pincode, product not found)
- `500`: Internal Server Error (server issues)

## Usage Examples

### JavaScript/Fetch
```javascript
// Get delivery estimate
const response = await fetch('/api/estimate?pincode=100001&productId=1');
const data = await response.json();

// Get all products
const products = await fetch('/api/products').then(r => r.json());

// Get specific product
const product = await fetch('/api/products/1').then(r => r.json());
```

### cURL
```bash
# Health check
curl http://localhost:3001/api/health

# Delivery estimate
curl "http://localhost:3001/api/estimate?pincode=100001&productId=1"

# Get products
curl http://localhost:3001/api/products

# Get pincode info
curl http://localhost:3001/api/pincodes/100001
```

## Web Client Integration

The web client (`/client`) is configured with a proxy to automatically route API calls to the backend server. The client provides a user-friendly interface for:

- Product selection with stock status
- Pincode input and validation
- Real-time delivery estimation
- Error handling and user feedback

## Deployment

### Local Development
1. Start the server: `cd server && npm start`
2. Start the client: `cd client && npm start`
3. Access the web app at: `http://localhost:3000`

### Docker Deployment
```bash
docker-compose up
```

### Vercel Deployment
The project includes `vercel.json` configuration for serverless deployment on Vercel.

## Performance

- CSV data is loaded once at server startup
- In-memory data processing for fast responses
- No database queries required
- Suitable for read-heavy workloads

## Limitations

- Data is static (CSV files must be updated manually)
- No real-time stock updates
- Limited to predefined pincodes and products
- No user authentication or session management 