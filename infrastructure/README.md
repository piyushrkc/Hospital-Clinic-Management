# Hospital Management System Infrastructure

This directory contains the infrastructure as code and deployment scripts for the Hospital Management System.

## Directory Structure

```
infrastructure/
├── scripts/            # Deployment and utility scripts
├── terraform/          # Terraform IaC for AWS resources
└── README.md           # This file
```

## Getting Started

### Prerequisites

- AWS account with appropriate permissions
- AWS CLI installed and configured (`aws configure`)
- Terraform CLI (v1.2.0+)
- Docker

### First-Time Setup

1. Copy the example Terraform variables file and customize it:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings
```

2. Create an S3 bucket for Terraform state (or use the deployment script which will create it for you):

```bash
aws s3api create-bucket --bucket your-terraform-state-bucket --region your-region
aws s3api put-bucket-versioning --bucket your-terraform-state-bucket --versioning-configuration Status=Enabled
```

## Deployment

The infrastructure can be deployed using the provided scripts:

### 1. Building Docker Images

```bash
# Build all components for staging environment
./scripts/docker-build.sh staging all

# Build only backend for production
./scripts/docker-build.sh production backend

# Build only frontend for development
./scripts/docker-build.sh dev frontend
```

### 2. Deploying Infrastructure with Terraform

```bash
# Plan changes for staging environment
./scripts/deploy.sh staging plan

# Apply changes to staging environment
./scripts/deploy.sh staging apply

# Destroy staging environment
./scripts/deploy.sh staging destroy

# Deploy to production
./scripts/deploy.sh production apply
```

## Environment Variables

The following environment variables can be used to configure the deployment scripts:

- `AWS_PROFILE`: AWS CLI profile to use (default: default)
- `AWS_REGION`: AWS region to deploy to (default: us-west-2)
- `TERRAFORM_STATE_BUCKET`: S3 bucket for Terraform state (default: hospital-management-terraform-state)
- `DOCKER_REGISTRY`: Docker registry to push images to (default: ghcr.io/YourUsername)
- `VERSION`: Version tag for Docker images (default: timestamp)

## CI/CD Integration

The GitHub Actions workflows in `.github/workflows/` automate the build and deployment process:

1. `backend-ci.yml` - Builds and tests the backend code
2. `frontend-ci.yml` - Builds and tests the frontend code
3. `deploy.yml` - Deploys the application to the target environment

## Infrastructure Components

The Terraform code creates the following AWS resources:

- VPC with public and private subnets
- Security groups for application and database
- ECR repositories for Docker images
- DocumentDB cluster for MongoDB (optional)
- EC2 instances for running the application (optional)
- Load balancer for multiple EC2 instances (optional)
- Route53 DNS records (optional)

## Scaling Considerations

1. **Database**: 
   - For production deployments, set `db_instance_count` to at least 2 for high availability
   - Consider memory requirements when selecting `db_instance_class`

2. **Application**:
   - For production, set `app_instance_count` to at least 2 for high availability
   - Consider using an auto-scaling group (requires additional configuration)

3. **Alternative Deployments**:
   - The infrastructure can be adapted to use ECS, EKS, or App Runner instead of EC2

## Cleanup

To destroy all created resources:

```bash
./scripts/deploy.sh <environment> destroy
```

**CAUTION**: This will permanently delete all resources in the specified environment, including databases. Make sure to backup any important data before running this command.