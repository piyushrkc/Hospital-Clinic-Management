output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "List of public subnet IDs"
  value       = module.vpc.public_subnets
}

output "private_subnets" {
  description = "List of private subnet IDs"
  value       = module.vpc.private_subnets
}

output "backend_ecr_repository_url" {
  description = "URL of the backend ECR repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repository_url" {
  description = "URL of the frontend ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "mongodb_connection_string" {
  description = "Connection string for MongoDB"
  value       = var.use_docdb ? "mongodb://${var.db_username}:${var.db_password}@${aws_docdb_cluster.mongodb[0].endpoint}:27017/?replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false" : "Not using DocumentDB"
  sensitive   = true
}

output "ec2_instance_ips" {
  description = "Public IPs of EC2 instances"
  value       = var.use_ec2 ? [for i in aws_instance.app_server : i.public_ip] : []
}

output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = var.use_ec2 && var.app_instance_count > 1 ? aws_lb.app_lb[0].dns_name : "No load balancer created"
}

output "app_url" {
  description = "URL for the application"
  value       = var.create_dns ? "https://${var.domain_name}" : var.use_ec2 && var.app_instance_count > 1 ? "http://${aws_lb.app_lb[0].dns_name}" : var.use_ec2 ? "http://${aws_instance.app_server[0].public_dns}" : "No URL available"
}