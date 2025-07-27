#!/bin/bash

echo "🚗 Starting Car Finder with Docker Compose..."
docker-compose up -d --build

echo "✅ Car Finder is now running!"
echo "🌐 Open your browser and go to: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Rebuild and start: docker-compose up -d --build" 