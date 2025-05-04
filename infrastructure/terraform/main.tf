terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # This will be filled in at runtime
    # bucket = "your-terraform-state-bucket"
    # key    = "hospital-management/terraform.tfstate"
    # region = "us-west-2"
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

# VPC for the application
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "${var.project_name}-${var.environment}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway = true
  single_nat_gateway = var.environment != "production"
  
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = local.common_tags
}

# Security group for the application
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-${var.environment}-app-sg"
  description = "Security group for ${var.project_name} application in ${var.environment}"
  vpc_id      = module.vpc.vpc_id

  # Allow inbound HTTP and HTTPS traffic
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

# Security group for the database
resource "aws_security_group" "db_sg" {
  name        = "${var.project_name}-${var.environment}-db-sg"
  description = "Security group for ${var.project_name} database in ${var.environment}"
  vpc_id      = module.vpc.vpc_id

  # Allow inbound MongoDB traffic from app security group
  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

# ECR repositories for Docker images
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-${var.environment}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-${var.environment}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

# DocumentDB cluster for MongoDB workloads
resource "aws_docdb_cluster" "mongodb" {
  count                  = var.use_docdb ? 1 : 0
  cluster_identifier     = "${var.project_name}-${var.environment}-docdb"
  engine                 = "docdb"
  master_username        = var.db_username
  master_password        = var.db_password
  db_subnet_group_name   = aws_docdb_subnet_group.default[0].name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  skip_final_snapshot    = var.environment != "production"

  tags = local.common_tags
}

resource "aws_docdb_subnet_group" "default" {
  count      = var.use_docdb ? 1 : 0
  name       = "${var.project_name}-${var.environment}-docdb-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = local.common_tags
}

resource "aws_docdb_cluster_instance" "cluster_instances" {
  count              = var.use_docdb ? var.db_instance_count : 0
  identifier         = "${var.project_name}-${var.environment}-docdb-${count.index}"
  cluster_identifier = aws_docdb_cluster.mongodb[0].id
  instance_class     = var.db_instance_class

  tags = local.common_tags
}

# EC2 instance to run applications if not using ECS/EKS
resource "aws_instance" "app_server" {
  count                  = var.use_ec2 ? var.app_instance_count : 0
  ami                    = var.ec2_ami
  instance_type          = var.ec2_instance_type
  subnet_id              = module.vpc.public_subnets[count.index % length(module.vpc.public_subnets)]
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  key_name               = var.key_name

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 30
    delete_on_termination = true
  }

  user_data = <<-EOF
    #!/bin/bash
    # Install Docker
    apt-get update
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    apt-get update
    apt-get install -y docker-ce
    usermod -aG docker ubuntu

    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    # Create app directory
    mkdir -p /opt/hospital-management
    chown -R ubuntu:ubuntu /opt/hospital-management
  EOF

  tags = merge(
    local.common_tags,
    {
      Name = "${var.project_name}-${var.environment}-app-${count.index}"
    }
  )
}

# Load balancer for EC2 instances
resource "aws_lb" "app_lb" {
  count              = var.use_ec2 && var.app_instance_count > 1 ? 1 : 0
  name               = "${var.project_name}-${var.environment}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app_sg.id]
  subnets            = module.vpc.public_subnets

  tags = local.common_tags
}

resource "aws_lb_target_group" "frontend" {
  count    = var.use_ec2 && var.app_instance_count > 1 ? 1 : 0
  name     = "${var.project_name}-${var.environment}-frontend"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    path                = "/"
    port                = "3000"
    protocol            = "HTTP"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
  }

  tags = local.common_tags
}

resource "aws_lb_target_group" "backend" {
  count    = var.use_ec2 && var.app_instance_count > 1 ? 1 : 0
  name     = "${var.project_name}-${var.environment}-backend"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    path                = "/api/health"
    port                = "5000"
    protocol            = "HTTP"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
  }

  tags = local.common_tags
}

# Route53 DNS entries
resource "aws_route53_record" "app" {
  count   = var.create_dns ? 1 : 0
  zone_id = var.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.use_ec2 && var.app_instance_count > 1 ? aws_lb.app_lb[0].dns_name : aws_instance.app_server[0].public_dns
    zone_id                = var.use_ec2 && var.app_instance_count > 1 ? aws_lb.app_lb[0].zone_id : var.route53_zone_id
    evaluate_target_health = true
  }
}