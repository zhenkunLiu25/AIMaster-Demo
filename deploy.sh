#!/bin/bash

echo "🎓 NUS Student Task Assistant - Docker Deployment Script"
echo "========================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker is available"

# Build and start the application
echo "📦 Building Docker image..."
if docker-compose build; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Failed to build Docker image"
    exit 1
fi

echo "🚀 Starting the application..."
if docker-compose up -d; then
    echo "✅ Application is starting..."
    echo ""
    echo "🌐 The NUS Task Assistant is now running at: http://localhost:3000"
    echo ""
    echo "📊 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
    echo ""
    echo "Features available:"
    echo "  📝 Smart task management with priority indicators"
    echo "  🔍 Advanced search and filtering"
    echo "  📱 Responsive design for all devices"
    echo "  🎯 Intelligent prioritization algorithm"
    echo "  📅 Sample NUS academic tasks included"
else
    echo "❌ Failed to start the application"
    exit 1
fi
