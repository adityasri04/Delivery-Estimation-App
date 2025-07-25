const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/api/estimate', (req, res) => {
  const { address } = req.query;
  // For now, we'll just return a mock estimation.
  const estimation = {
    address,
    deliveryTime: '2-3 business days',
  };
  res.json(estimation);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
