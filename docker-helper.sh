#!/bin/bash

# Docker helper script for Echoes of Ellidra
# Usage: ./docker-helper.sh [command] [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$SCRIPT_DIR/web-version-4"

show_help() {
    echo "Docker Helper for Echoes of Ellidra"
    echo ""
    echo "Usage: ./docker-helper.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build           Build the web application locally"
    echo "  docker-build    Build production Docker image"
    echo "  docker-run      Run production Docker container"
    echo "  compose-prod    Start production with Docker Compose"
    echo "  compose-build   Start build-from-source with Docker Compose"
    echo "  compose-dev     Start development with Docker Compose"
    echo "  compose-down    Stop all Docker Compose services"
    echo "  clean           Remove all Docker images and containers"
    echo "  test            Test if the application is working"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-helper.sh build && ./docker-helper.sh docker-build"
    echo "  ./docker-helper.sh compose-prod"
    echo "  ./docker-helper.sh compose-dev"
}

build_web() {
    echo "Building web application..."
    cd "$WEB_DIR"
    npm ci
    npm run build
    echo "Web application built successfully!"
}

docker_build() {
    echo "Building Docker image..."
    cd "$WEB_DIR"
    docker build -t echoes-of-ellidra .
    echo "Docker image built successfully!"
}

docker_run() {
    echo "Running Docker container..."
    cd "$WEB_DIR"
    docker run -d -p 3000:80 --name echoes-of-ellidra echoes-of-ellidra
    echo "Docker container started on http://localhost:3000"
}

compose_prod() {
    echo "Starting production with Docker Compose..."
    cd "$SCRIPT_DIR"
    docker compose up --build web
}

compose_build() {
    echo "Starting build-from-source with Docker Compose..."
    cd "$SCRIPT_DIR"
    docker compose --profile build up --build web-build
}

compose_dev() {
    echo "Starting development with Docker Compose..."
    cd "$SCRIPT_DIR"
    docker compose --profile dev up --build web-dev
}

compose_down() {
    echo "Stopping Docker Compose services..."
    cd "$SCRIPT_DIR"
    docker compose down
    docker compose --profile dev down
    docker compose --profile build down
    echo "All services stopped!"
}

clean_docker() {
    echo "Cleaning up Docker resources..."
    
    # Stop and remove containers
    docker ps -aq --filter "ancestor=echoes-of-ellidra" | xargs -r docker stop
    docker ps -aq --filter "ancestor=echoes-of-ellidra" | xargs -r docker rm
    
    # Remove images
    docker images -q echoes-of-ellidra | xargs -r docker rmi
    docker images -q "mini-project-game*" | xargs -r docker rmi
    
    # Remove unused resources
    docker system prune -f
    
    echo "Docker cleanup completed!"
}

test_application() {
    echo "Testing application..."
    
    # Test if port 3000 is responding
    if curl -s -f http://localhost:3000 > /dev/null; then
        echo "✓ Application is running on http://localhost:3000"
    else
        echo "✗ Application is not responding on port 3000"
    fi
    
    # Test if port 5173 is responding (dev)
    if curl -s -f http://localhost:5173 > /dev/null; then
        echo "✓ Development server is running on http://localhost:5173"
    else
        echo "✗ Development server is not responding on port 5173"
    fi
}

# Main script logic
case "${1:-help}" in
    build)
        build_web
        ;;
    docker-build)
        docker_build
        ;;
    docker-run)
        docker_run
        ;;
    compose-prod)
        compose_prod
        ;;
    compose-build)
        compose_build
        ;;
    compose-dev)
        compose_dev
        ;;
    compose-down)
        compose_down
        ;;
    clean)
        clean_docker
        ;;
    test)
        test_application
        ;;
    help|*)
        show_help
        ;;
esac