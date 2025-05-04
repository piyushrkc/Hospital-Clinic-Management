#!/bin/bash
set -e

# Color codes for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Parse command-line arguments
ENVIRONMENT=${1:-staging}
COMPONENT=${2:-all}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
  echo -e "${RED}Invalid environment: $ENVIRONMENT. Must be dev, staging, or production.${NC}"
  echo "Usage: $0 <environment> <component>"
  echo "  environment: dev, staging, production"
  echo "  component: all, backend, frontend"
  exit 1
fi

# Validate component
if [[ ! "$COMPONENT" =~ ^(all|backend|frontend)$ ]]; then
  echo -e "${RED}Invalid component: $COMPONENT. Must be all, backend, or frontend.${NC}"
  echo "Usage: $0 <environment> <component>"
  echo "  environment: dev, staging, production"
  echo "  component: all, backend, frontend"
  exit 1
fi

# Directory setup
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$INFRA_DIR")"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Default Docker registry if not using ECR
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"ghcr.io/YourUsername"}
VERSION=${VERSION:-$(date +%Y%m%d%H%M%S)}

echo -e "${GREEN}Building Docker images for ${YELLOW}$ENVIRONMENT${GREEN} environment...${NC}"
echo -e "${GREEN}Component: ${YELLOW}$COMPONENT${NC}"
echo -e "${GREEN}Version: ${YELLOW}$VERSION${NC}"

# Build and tag backend
build_backend() {
  echo -e "${GREEN}Building backend image...${NC}"
  cd "$BACKEND_DIR"
  
  # Copy the appropriate .env file for the environment
  if [[ -f ".env.$ENVIRONMENT" ]]; then
    echo -e "${YELLOW}Using .env.$ENVIRONMENT for backend${NC}"
    cp ".env.$ENVIRONMENT" .env
  fi
  
  docker build -t "hospital-management-backend:$VERSION" -t "hospital-management-backend:latest" .
  
  # Tag with registry if provided
  if [[ -n "$DOCKER_REGISTRY" ]]; then
    docker tag "hospital-management-backend:$VERSION" "$DOCKER_REGISTRY/hospital-management-backend:$VERSION"
    docker tag "hospital-management-backend:latest" "$DOCKER_REGISTRY/hospital-management-backend:latest"
  fi
  
  echo -e "${GREEN}Backend image built successfully!${NC}"
}

# Build and tag frontend
build_frontend() {
  echo -e "${GREEN}Building frontend image...${NC}"
  cd "$FRONTEND_DIR"
  
  # Copy the appropriate .env file for the environment
  if [[ -f ".env.$ENVIRONMENT" ]]; then
    echo -e "${YELLOW}Using .env.$ENVIRONMENT for frontend${NC}"
    cp ".env.$ENVIRONMENT" .env
  fi
  
  docker build -t "hospital-management-frontend:$VERSION" -t "hospital-management-frontend:latest" .
  
  # Tag with registry if provided
  if [[ -n "$DOCKER_REGISTRY" ]]; then
    docker tag "hospital-management-frontend:$VERSION" "$DOCKER_REGISTRY/hospital-management-frontend:$VERSION"
    docker tag "hospital-management-frontend:latest" "$DOCKER_REGISTRY/hospital-management-frontend:latest"
  fi
  
  echo -e "${GREEN}Frontend image built successfully!${NC}"
}

# Push images to Docker registry
push_images() {
  if [[ -z "$DOCKER_REGISTRY" ]]; then
    echo -e "${YELLOW}No Docker registry specified, skipping push${NC}"
    return
  fi
  
  echo -e "${GREEN}Pushing images to Docker registry...${NC}"
  
  if [[ "$COMPONENT" == "all" || "$COMPONENT" == "backend" ]]; then
    echo -e "${GREEN}Pushing backend image...${NC}"
    docker push "$DOCKER_REGISTRY/hospital-management-backend:$VERSION"
    docker push "$DOCKER_REGISTRY/hospital-management-backend:latest"
  fi
  
  if [[ "$COMPONENT" == "all" || "$COMPONENT" == "frontend" ]]; then
    echo -e "${GREEN}Pushing frontend image...${NC}"
    docker push "$DOCKER_REGISTRY/hospital-management-frontend:$VERSION"
    docker push "$DOCKER_REGISTRY/hospital-management-frontend:latest"
  fi
  
  echo -e "${GREEN}Images pushed successfully!${NC}"
}

# Check for Docker
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Docker is not installed or not in the PATH${NC}"
  exit 1
fi

# Build images based on component parameter
if [[ "$COMPONENT" == "all" || "$COMPONENT" == "backend" ]]; then
  build_backend
fi

if [[ "$COMPONENT" == "all" || "$COMPONENT" == "frontend" ]]; then
  build_frontend
fi

# Ask if images should be pushed
if [[ -n "$DOCKER_REGISTRY" ]]; then
  read -p "Do you want to push the images to $DOCKER_REGISTRY? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    push_images
  else
    echo -e "${YELLOW}Skipping image push.${NC}"
  fi
fi

echo -e "${GREEN}Docker build script completed successfully!${NC}"