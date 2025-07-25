# Medicine Delivery Estimation App

This is a simple application to estimate the delivery time for medicines.

## Tech Stack

- React.js
- Recoil
- Node.js
- REST API
- Docker
- Vercel

## Deployment to Vercel

1. **Sign up for a Vercel account.**
2. **Install the Vercel CLI:** `npm install -g vercel`
3. **Login to your Vercel account:** `vercel login`
4. **From the root of the `DeliveryApp` directory, run the following command:** `vercel`
5. **Vercel will automatically detect the `vercel.json` file and configure the project.** Follow the prompts to deploy the application.

## Running locally with Docker

1. **Install Docker and Docker Compose.**
2. **From the root of the `DeliveryApp` directory, run the following command:** `docker-compose up --build`
3. **The application will be available at `http://localhost`** (the client) and the server will be running on port 3001.
