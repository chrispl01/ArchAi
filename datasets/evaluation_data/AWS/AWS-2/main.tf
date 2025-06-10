
provider "aws"{
  
}

# Note that a Virtual Private Gateway will be created as part of the attachment
# The VPC should be anywhere between /16 and /28, and cannot be the entire
# 10.0.0.0/8 or 192.168.0.0/16 CIDR blocks
resource "aws_vpc" "main" {
  cidr_block       = var.vpc_cidr_block
  enable_dns_hostnames = true

  tags            = {
    Name           = "${var.environment_name}-vpc-private"
  }
}

# Create or import a customer gateway
# Modify var.customer_gateway_ip attribute to yours
# Data center public IPs: 203.0.113.12 / 198.51.100.34 / 192.0.2.25
resource "aws_customer_gateway" "main" {
  bgp_asn          = 100
  ip_address       = var.customer_gateway_ip
  type             = "ipsec.1"
  tags             = {
    Name           = "ert"
  }
}

# Create and attach a VGW
resource "aws_vpn_gateway" "main" {
  amazon_side_asn = var.amazon_side_asn
  vpc_id          = aws_vpc.main.id

  tags            = {
    Name           = "${var.environment_name}-vpgw-private"
  }
}

# Create a VPN connection
resource "aws_vpn_connection" "main" {
  customer_gateway_id = aws_customer_gateway.main.id
  vpn_gateway_id      = aws_vpn_gateway.main.id
  type                = "ipsec.1"

  tags                = {
    Name              = "${var.environment_name}-vpgw-private"
  }
}

# Exporting VPC and VPN gateway details so we can
# use in the on-premises data center configuration
output "vpc_id" {
  value = aws_vpc.main.id
}

output "vpn_gateway_id" {
  value = aws_vpn_gateway.main.id
}

variable "environment_name" {
  description = "The environment name to be used as a prefix"
  type = string
  default = "vpc-vpgw"
}

variable "vpc_cidr_block" {
  description = "The CIDR block to assign to the private VPC"
  type = string
  default = "172.31.0.0/16"
}

variable "customer_gateway_ip" {
  description = "The public IP of your customer gateway"
  type = string
  default = ""
}

variable "amazon_side_asn" {
  description = "The Amazon side ASN (BGP) for the virtual private gateway"
  type = string
  default = "64512"
}

variable "vpn_pre_shared_key" {
  description = "The pre-shared key for the VPN connection (leave empty for AWS to generate randomly)"
  type = string
  default = ""
}