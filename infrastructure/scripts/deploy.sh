#!/bin/bash
set -e

# Color codes for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Parse command-line arguments
ENVIRONMENT=${1:-staging}
OPERATION=${2:-plan}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
  echo -e "${RED}Invalid environment: $ENVIRONMENT. Must be dev, staging, or production.${NC}"
  echo "Usage: $0 <environment> <operation>"
  echo "  environment: dev, staging, production"
  echo "  operation: plan, apply, destroy"
  exit 1
fi

# Validate operation
if [[ ! "$OPERATION" =~ ^(plan|apply|destroy)$ ]]; then
  echo -e "${RED}Invalid operation: $OPERATION. Must be plan, apply, or destroy.${NC}"
  echo "Usage: $0 <environment> <operation>"
  echo "  environment: dev, staging, production"
  echo "  operation: plan, apply, destroy"
  exit 1
fi

# Directory setup
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
TERRAFORM_DIR="$INFRA_DIR/terraform"
PROJECT_DIR="$(dirname "$INFRA_DIR")"

# Config for AWS and Terraform
export AWS_PROFILE=${AWS_PROFILE:-default}
TERRAFORM_STATE_BUCKET=${TERRAFORM_STATE_BUCKET:-"hospital-management-terraform-state"}
TERRAFORM_STATE_KEY="hospital-management/$ENVIRONMENT/terraform.tfstate"
TERRAFORM_STATE_REGION=${AWS_REGION:-"us-west-2"}

echo -e "${GREEN}Starting deployment for ${YELLOW}$ENVIRONMENT${GREEN} environment...${NC}"
echo -e "${GREEN}Operation: ${YELLOW}$OPERATION${NC}"
echo -e "${GREEN}Terraform state bucket: ${YELLOW}$TERRAFORM_STATE_BUCKET${NC}"
echo -e "${GREEN}Terraform state key: ${YELLOW}$TERRAFORM_STATE_KEY${NC}"
echo -e "${GREEN}AWS profile: ${YELLOW}$AWS_PROFILE${NC}"

# Ensure the Terraform state bucket exists
ensure_terraform_bucket() {
  local bucket_exists
  bucket_exists=$(aws s3api head-bucket --bucket "$TERRAFORM_STATE_BUCKET" 2>&1 || true)
  
  if [[ $bucket_exists == *"Not Found"* ]]; then
    echo -e "${YELLOW}Creating Terraform state bucket: $TERRAFORM_STATE_BUCKET${NC}"
    aws s3api create-bucket \
      --bucket "$TERRAFORM_STATE_BUCKET" \
      --region "$TERRAFORM_STATE_REGION" \
      --create-bucket-configuration LocationConstraint="$TERRAFORM_STATE_REGION"
    
    # Enable versioning
    aws s3api put-bucket-versioning \
      --bucket "$TERRAFORM_STATE_BUCKET" \
      --versioning-configuration Status=Enabled
    
    # Enable encryption
    aws s3api put-bucket-encryption \
      --bucket "$TERRAFORM_STATE_BUCKET" \
      --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'
  fi
}

# Copy tfvars file if it doesn't exist
check_tfvars() {
  if [[ ! -f "$TERRAFORM_DIR/terraform.tfvars" ]]; then
    if [[ -f "$TERRAFORM_DIR/$ENVIRONMENT.tfvars" ]]; then
      echo -e "${YELLOW}Using $ENVIRONMENT.tfvars${NC}"
      cp "$TERRAFORM_DIR/$ENVIRONMENT.tfvars" "$TERRAFORM_DIR/terraform.tfvars"
    else
      echo -e "${RED}No terraform.tfvars or $ENVIRONMENT.tfvars file found. Please create one.${NC}"
      echo -e "${YELLOW}You can copy terraform.tfvars.example as a starting point.${NC}"
      exit 1
    fi
  fi
}

# Initialize Terraform
terraform_init() {
  echo -e "${GREEN}Initializing Terraform...${NC}"
  cd "$TERRAFORM_DIR"
  terraform init \
    -backend-config="bucket=$TERRAFORM_STATE_BUCKET" \
    -backend-config="key=$TERRAFORM_STATE_KEY" \
    -backend-config="region=$TERRAFORM_STATE_REGION"
}

# Plan Terraform changes
terraform_plan() {
  echo -e "${GREEN}Planning Terraform changes...${NC}"
  cd "$TERRAFORM_DIR"
  terraform plan -var="environment=$ENVIRONMENT" -out=tfplan
}

# Apply Terraform changes
terraform_apply() {
  echo -e "${GREEN}Applying Terraform changes...${NC}"
  cd "$TERRAFORM_DIR"
  terraform apply tfplan
}

# Destroy Terraform resources
terraform_destroy() {
  echo -e "${RED}WARNING: This will destroy all resources in the $ENVIRONMENT environment!${NC}"
  read -p "Are you sure you want to proceed? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Destroying Terraform resources...${NC}"
    cd "$TERRAFORM_DIR"
    terraform destroy -var="environment=$ENVIRONMENT" -auto-approve
  else
    echo -e "${YELLOW}Destroy operation cancelled.${NC}"
    exit 0
  fi
}

# Main execution
ensure_terraform_bucket
check_tfvars
terraform_init

case "$OPERATION" in
  plan)
    terraform_plan
    ;;
  apply)
    terraform_plan
    terraform_apply
    ;;
  destroy)
    terraform_destroy
    ;;
esac

echo -e "${GREEN}Deployment script completed successfully!${NC}"