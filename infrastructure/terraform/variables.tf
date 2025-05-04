variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "hospital-management"
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "staging"
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-west-2"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b", "us-west-2c"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "use_docdb" {
  description = "Whether to use DocumentDB"
  type        = bool
  default     = true
}

variable "db_username" {
  description = "Username for the database"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "db_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
}

variable "db_instance_count" {
  description = "Number of database instances"
  type        = number
  default     = 1
}

variable "db_instance_class" {
  description = "Instance class for database"
  type        = string
  default     = "db.t3.medium"
}

variable "use_ec2" {
  description = "Whether to use EC2 instances (if false, ECS or EKS would be used instead)"
  type        = bool
  default     = true
}

variable "app_instance_count" {
  description = "Number of EC2 instances for the application"
  type        = number
  default     = 2
}

variable "ec2_ami" {
  description = "AMI ID for EC2 instances"
  type        = string
  # Ubuntu 22.04 LTS in us-west-2 (Oregon)
  default     = "ami-03f65b8614a860c29"
}

variable "ec2_instance_type" {
  description = "Instance type for EC2 instances"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "Name of the SSH key pair to use"
  type        = string
  default     = ""
}

variable "create_dns" {
  description = "Whether to create DNS records"
  type        = bool
  default     = false
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "hospital-management.example.com"
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}