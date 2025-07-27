#!/bin/bash

echo "🚗 Building Car Finder Docker container..."
docker build -t car-finder .

echo "🚀 Starting Car Finder container..."
docker run -d \
  --name car-finder-app \
  -p 3000:3000 \
  --restart unless-stopped \
  car-finder

echo "✅ Car Finder is now running!"
echo "🌐 Open your browser and go to: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker logs car-finder-app"
echo "  - Stop container: docker stop car-finder-app"
echo "  - Remove container: docker rm car-finder-app"
echo "  - Restart container: docker restart car-finder-app" 