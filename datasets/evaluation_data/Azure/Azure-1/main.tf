#File: main.tf
provider "azurerm" {
  features {}
}

#########################
# Kubernetes Infrastructure
#########################
resource "azurerm_kubernetes_cluster" "kubemapraks-cluster" {
  name                       = "${var.project}-${var.environment}-aks"
  location                   = azurerm_resource_group.kubemapraks-rg.location
  resource_group_name        = azurerm_resource_group.kubemapraks-rg.name
  dns_prefix                 = "kubemapraks"

  default_node_pool {
    name                = "default"
    node_count          = var.aks_node_group_size
    vm_size             = var.aks_vm_size
    availability_zones  = [1, 2, 3]
    node_taints         = ["auto-scaled"]
    spot_max_price      = -1
    orchestrator_version = "1.24.4"
    
  }

  automatic_scale {
    min_count = var.aks_min_nodes
    max_count = var.aks_max_nodes
  }

  identity {
    type = "SystemAssigned"
  }

  sku_tier = "Standard"

  azure_policy {
    enabled = true
  }

  monitoring {
    enabled    = true
    workspace_id  = azurerm_log_analytics_workspace.kubemapraks-law.id

    metrics_application_insights {
      enabled                 = true
      workspace_id            = azurerm_log_analytics_workspace.kubemapraks-law.id
      metric_rules_one_minute = ["HttpRequests", "RequestDuration", "IncomingBytes"]
    }
  }

  azure_active_directory {
    managed = true
  }

  role_based_access_control {
    enabled = true
  }
  

  tags = {
    project      = var.project
    environment  = var.environment
    managed_by   = "terraform"
    
  }
}

#################
# Monitoring & Logging
#################

resource "azurerm_log_analytics_workspace" "kubemapraks-law" {
  name                = "${var.project}-${var.environment}-law"
  location            = azurerm_resource_group.kubemapraks-rg.location
  resource_group_name = azurerm_resource_group.kubemapraks-rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    project      = var.project
    environment  = var.environment
    managed_by   = "terraform"
    
  }
}

#################
# Network
#################

resource "azurerm_virtual_network" "kubemapraks-vnet" {
  name                = "${var.project}-${var.environment}-vnet"
  address_space       = [var.network_internal_cidr]
  location            = azurerm_resource_group.kubemapraks-rg.location
  resource_group_name = azurerm_resource_group.kubemapraks-rg.name

  tags = {
    project      = var.project
    environment  = var.environment
    managed_by   = "terraform"
    
  }
}

###################
# Application Profiles
###################

data "azurerm_platform_image" "kubernetes_charts" {
  provider    = azurerm.kubernetes
  location    = "West US"
  publisher   = "Microsoft"
  offer       = "KubernetesCharts"
  sku         = "latest-free"
  os_type     = "Linux"
  zone_resilient_image = true
  all_versions = true
}

#File: variables.tf

variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "network_internal_cidr" {
  type = string
}

variable "aks_admin_user" {
  type = string
}

variable "aks_ad_admin_object_id" {
  type = string
}

variable "aks_ad_admin_principal_id" {
  type = string
}

variable "keyvault-admin-res-id" {
  type = string
}

variable "aks_node_group_size" {
  type = number
}

variable "aks_vm_size" {
  type = string
}

variable "aks_min_nodes" {
  type = number
}

variable "aks_max_nodes" {
  type = number
}

#File: outputs.tf
output "cluster_host" {
  value = azurerm_kubernetes_cluster.kubemapraks-cluster.kube_config[0].host
}

output "cluster_name" {
  value = azurerm_kubernetes_cluster.kubemapraks-cluster.name
}

output "rg_name" {
  value = azurerm_resource_group.kubemapraks-rg.name
}



#File: resource_group.tf

resource "azurerm_resource_group" "kubemapraks-rg" {
  provider = azurerm

  name     = "${var.project}-${var.environment}-rg"
  location = "West US"

  tags = {
    project      = var.project
    environment  = var.environment
    managed_by   = "terraform"
    
  }
}

resource "azurerm_key_vault_access_policy" "admin-access" {
  provider            = azurerm
  key_vault_id        = data.azurerm_key_vault.keyvault2.id
  tenant_id           = data.azurerm_client_config.current.tenant_id 
  object_id           = var.keyvault-admin-res-id
  secret_permissions  = ["set", "get", "delete", "list", "recover",  "purge", "backup", "restore"]
  
}


data "azurerm_client_config" "current" {
  provider = azurerm
}

data "azurerm_key_vault" "keyvault2" {
  name                = "kmap-kv2"
  resource_group_name = "maps-k8s-prds"
}