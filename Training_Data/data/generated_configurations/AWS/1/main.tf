
locals {
  project = "myproject"
}

################
# VARIABLES
#################
variable "region" {
  description = "AWS Region"
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Public Subnet CIDR"
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "Private Subnet CIDR"
  default     = "10.0.2.0/24"
}

################
# PROVIDER
#################
# PROVIDER
provider "aws" {
  region = var.region
}


################
# NETWORKING
#################
# VPC
resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr
  tags = {
    Name = "MyVPC"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.public_subnet_cidr
  availability_zone = "${var.region}a"
  tags = {
    Name = "PublicSubnet"
  }
}

resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = "${var.region}a"
  tags = {
    Name = "PrivateSubnet"
  }
}

resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "MyInternetGateway"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gateway.id
  }

  tags = {
    Name = "PublicRoutes"
  }
}

resource "aws_route_table_association" "public_association" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_eip" "nat" {
  vpc = true

  tags = {
    Name = "MyNAT"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_subnet.id

  tags = {
    Name = "MyNATGateway"
  }
}

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "PrivateRoutes"
  }
}

resource "aws_route_table_association" "private_association" {
  subnet_id      = aws_subnet.private_subnet.id
  route_table_id = aws_route_table.private_route_table.id
}

# Security Groups
# Security Group for the EC2 instances
resource "aws_security_group" "web_sg" {
  name        = "web-security-group"
  description = "Allow inbound traffic to EC2 instances"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group for the ALB
resource "aws_security_group" "alb_sg" {
  name        = "alb-security-group"
  description = "Allow inbound HTTP traffic to the ALB"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group for the RDS Instance
resource "aws_security_group" "rds_sg" {
  name        = "rds-security-group"
  description = "Allow inbound traffic to RDS"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.public_subnet_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


###############################
#  AUTOSCALING AND ELASTICACHE
###############################
# User data script for EC2 instances
data "template_file" "user_data" {
  template = <<EOT
#!/bin/bash
yum update -y
yum install -y httpd
systemct, start httpd
systemctl enable httpd
echo "<h1>Instance: ${local.project}</h1>" > /var/www/html/index.html
EOT
}

# Launch Template
resource "aws_launch_template" "web_lt" {
  name_prefix = "web-launch-template-"

  image_id      = "ami-0c02fb55956c7d316" # Amazon Linux 2 AMI
  instance_type = "t2.micro"
  user_data     = base64encode(data.template_file.user_data.rendered)
  key_name      = "my-key-pair"  # Replace with your actual key pair

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }

  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "MyWebInstance"
    }
  }
}

# IAM Role and Policy Attachment
resource "aws_iam_role" "ec2_role" {
  name = "MyEC2Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_attachment" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "MyEC2InstanceProfile"
  role = aws_iam_role.ec2_role.name
}

# Auto Scaling Group
resource "aws_autoscaling_group" "web_asg" {
  name_prefix          = "web-auto-scaling-group-"
  max_size             = 3
  min_size             = 1
  vpc_zone_identifier  = [aws_subnet.public_subnet.id]
  launch_template {
    id      = aws_launch_template.web_lt.id
    version = "$Latest"
  }
  target_group_arns    = [aws_lb_target_group.web_tg.arn]
}



# Load Balancer
resource "aws_lb" "web_alb" {
  name               = "my-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_subnet.id]
  security_groups    = [aws_security_group.alb_sg.id]

  tags = {
    Name = "MyApplicationLoadBalancer"
  }
}

resource "aws_lb_target_group" "web_tg" {
  name     = "my-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id

  health_check {
    path                = "/index.html"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "MyTargetGroup"
  }
}

resource "aws_lb_listener" "web_listener" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.web_tg.arn
    type             = "forward"
  }
}

# Output the DynamoDB Table Name
output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = aws_lb.web_alb.dns_name
}


#########################
#  DATABASES
##########################
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${local.project}-rds-subnet-group"
  subnet_ids = [aws_subnet.private_subnet.id]

  tags = {
    Name = "${local.project}-rds-subnet-group"
  }
}

# RDS Instance
resource "aws_db_instance" "rds_instance" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "12.10"
  instance_class       = "db.t2.micro"
  name                 = "mydatabase"
  username             = "postgres"
  password             = "your-password"
  parameter_group_name = "default.postgres12"
  subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  security_group_names = [aws_security_group.rds_sg.name]
  multi_az             = false
  publicly_accessible  = false

  tags = {
    Name = "MyPostgreSQLDB"
  }
}

# Output the RDS Endpoint
output "rds_endpoint" {
  value       = aws_db_instance.rds_instance.endpoint
  description = "The connection endpoint for the RDS instance"
}
