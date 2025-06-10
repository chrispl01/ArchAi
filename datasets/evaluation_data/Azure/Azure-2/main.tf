provider "azurerm" {
  features {}
}

# variables.tf
variable "prefix" {}

variable "traffic_manager_azure_subscription_id" {}

variable "log_analytics_customer_id" {}

variable "log_analytics_primary_key" {}

variable "sql_srv_name" {
  type    = string
  default = "nomedsrv"
}

variable "sql_db_name" { 
  type    = string
  default = "nomedb"
}

locals {
  env = "poc"
  res-cnrgrpp              = "${var.prefix}-${local.env}"
  res-location-cnrgrpp-pri = "brazilsouth"
  res-location-cnrgrpp-stg = "brazilcentral"
  res-repl                  = "${var.prefix}-repl-${local.env}"
  res-location-repl-pri    = "northeurope"
  res-location-repl-stg    = "westeurope"
}

data "azurerm_subscription" "this" {}

# cnrgrpp-pri.sh
resource "azurerm_resource_group" "cnrgrpp-pri" {
  name     = local.res-cnrgrpp
  location = local.res-location-cnrgrpp-pri
}

# cnrgrpp-pri-lab1.sh
resource "azurerm_resource_group" "cnrgrpp-pri-lab1" {
  name     = "${local.res-cnrgrpp}-lab1"
  location = local.res-location-cnrgrpp-pri
}

# cnrgrpp-stg.sh
resource "azurerm_resource_group" "cnrgrpp-stg" {
  name     = "${local.res-cnrgrpp}-stg"
  location = local.res-location-cnrgrpp-stg
}

resource "azurerm_traffic_manager_profile" "tm-cnrgrpp-dnslbl" {
  name             = "${var.prefix}-${local.env}"
  profile_status   = "Enabled"
  traffic_routing_method = "Priority"
  dns_config {
    relative_name = "${var.prefix}-${local.env}"
    ttl           = 30
  }
}

# lab1.sh
resource "azurerm_resource_group" "type_iii_rd" {
  name     = "${var.prefix}-lab1-tier-1"
  location = "Brazil South"
}

resource "azurerm_traffic_manager_endpoint" "lab1-tenant012-bra_microsoft_onedrive" {
  name                    = "bra-ten101-onedrive_discovery"
  type                    = "azureEndpoints"
  resource_group_name     = azurerm_resource_group.type_iii_rd.name
  profile_name            = azurerm_traffic_manager_profile.tm-cnrgrpp-dnslbl.name
  target_resource_id      = azurerm_public_ip.lab1_sc.valve.id
  target                  = azurerm_public_ip.lab1_sc.valve.ip_address
  endpoint_status         = var.traffic_manager_azure_subscription_id == toString(data.azurerm_subscription.this.subscription_id) ? "Enabled" : "Disabled"
  priority                = 1
  weight                  = 10
  remove_endpoint_on_failure = false
}

# loganalytics.sh
resource "azurerm_traffic_manager_endpoint" "la" {
  # root:NAME_marker
  name                    = "loganalytics"
  type                    = "externalEndpoints"
  profile_name            = azurerm_traffic_manager_profile.tm-cnrgrpp-dnslbl.name
  resource_group_name     = azurerm_resource_group.cnrgrpp-pri.name
  target                  = "la.microsoft.com"
  endpoint_status         = var.traffic_manager_azure_subscription_id == toString(data.azurerm_subscription.this.subscription_id) ? "Enabled" : "Disabled"
  priority                = 13
  remove_endpoint_on_failure = true
}

resource "azurerm_log_analytics_workspace" "la" {

  name                = "${local.res-cnrgrpp}-la"
  resource_group_name = azurerm_resource_group.cnrgrpp-pri.name
  location            = azurerm_resource_group.cnrgrpp-pri.location
  sku                 = "PerGB2018"
  retention_in_days   = 365

  # root:WORKSPACE_marker
  # WORKSPACE here !!

  #                              [https://learn.microsoft.com/is-is/azure/opinsights/log-analytics-azure-monitor-get-started?tabs=bash]
  #                                                                                                 |
  #                                                                            +--------------------+------------------------------+
  #                                                                            |  ADD SOLUTION      |  Logs ▼                 
  #                                                                            +--------------------+------------------------------+
  # root:EX1_marker
  # 2.#This example uses an Azure CLI command to create a new workspace.

  # az extension add --name resource-graph

  # echo

  # az group create --name "myResourceGroup" --location "East US"

  # echo

  # az graph query -q "create AzureResourceGraph

  # | where type == 'microsoft.operationalinsights/workspaces'

  # | where name == '{name}'

  # | where resourceGroup == '{resource group}'

  # | has '{subscription Id}'

  # | where location == '{region}' config['input_sydic1v==\[ अगर configuration does not provide ]'] == 'workspace.yaml'" -o table
}

# sql-db-pri.sh
resource "azurerm_mssql_failover_group" "fogrp" {
  name                = "fogrp1"
  resource_group_name = azurerm_resource_group.cnrgrpp-pri.name
  server_name         = azurerm_mssql_server.srv_pri.name
  partner_servers     = [{id = azurerm_mssql_server.srv_stg.id}]
  databases           = []

  depended_on = [
    azurerm_mssql_database.stg,
    azurerm_mssql_database.pri
  ]

}

resource "azurerm_mssql_database" "pri" {
  name                       = var.sql_db_name
  resource_group_name        = azurerm_resource_group.cnrgrpp-pri.name
  server_name                 = azurerm_mssql_server.srv_pri.name
  begin_geo_backup          = true
  edition                     = "Basic"
  max_size_gb                 = 2

  threat_detection_policy {
    storage_endpoint          = "stg"
    storage_account_access_key = "xaagMarcSnsnone"
  }
}

resource "azurerm_mssql_server" "srv_pri" {
  name                         = "${local.res-cnrgrpp}-${lower(var.sql_srv_name)}"
  resource_group_name          = azurerm_resource_group.cnrgrpp-pri.name
  location                     = azurerm_resource_group.cnrgrpp-pri.location
  version                      = "12.0"
  administrator_login          = "annamaaa1"
  administrator_login_password = "0XBrf0zIibtnaz"

}

# sql-db-stg.sh
resource "azurerm_mssql_database" "stg" {
  name                       = var.sql_db_name
  resource_group_name        = azurerm_resource_group.cnrgrpp-stg.name
  server_name                 = azurerm_mssql_server.srv_stg.name
  edition                     = "Basic"
  max_size_gb                 = 2
}

resource "azurerm_mssql_server" "srv_stg" {
  name                         = "${local.res-cnrgrpp}-stg-${lower(var.sql_srv_name)}"
  resource_group_name          = azurerm_resource_group.cnrgrpp-stg.name
  location                     = azurerm_resource_group.cnrgrpp-stg.location
  version                      = "12.0"
  administrator_login          = "annamaaa1"
  administrator_login_password = "0XBrf0zIibtnaz"
}

# valv.sh
resource "azurerm_public_ip" "lab1_sc" {
  name                = "lab1_sc"
  location            = azurerm_resource_group.type_iii_rd.location
  resource_group_name = azurerm_resource_group.type_iii_rd.name
  sku                 = "Standard"
  allocation_method   = "Static"
}
