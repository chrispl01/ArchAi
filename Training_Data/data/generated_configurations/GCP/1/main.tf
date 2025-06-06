
provider "google" {
}

resource "google_firestore_database" "firestore" {
  # Configure a Firestore database
  name     = "(default)"
  location = var.gcp_region
  type     = "FIRESTORE_NATIVE"
}

resource "google_cloudfunctions_function" "function" {
  # Deploy a Cloud Function
  name        = var.cloud_function_name
  runtime     = "compat-runtime-nodejs16"
  entry_point = "handleEvent"
  source_code = file("hello-world-node.zip")
  trigger_http = true
}

resource "google_api_gateway_api" "app-api" {
  # Create an API Gateway API with IAM access control
  api_id       = "app-api"
  display_name = "App API"
}

resource "google_api_gateway_api_iam_member" "servic_member" {
  # Control access to the API Gateway using IAM
  api_id    = google_api_gateway_api.app-api.api_id
  role      = "roles/gateway.viewer"
  member    = "serviceAccount:some-email@hacklabbook.cloud" 
}

resource "google_api_gateway_api_config" "app-api-config" {
  # Configure an API Gateway with references to OpenAPI spec and backend service
  config_id    = "app-api-config"
  api_id       = google_api_gateway_api.app-api.api_id
  display_name = "App API Config"

  openapi_documents {
    path        = "${path.module}/specs/openapi.yaml"
    contents    = ""
  }

  backend_config {
    google_service_account = google_service_account.api_functions_gw.email
  } 

  depends_on = [
    google_api_gateway_api_iam_member.servic_member,
    null_resource.service_account_key_output
  ]
}

resource "google_api_gateway_gateway" "app-gateway" {
  # Deploy an API Gateway
  name        = "app-gateway"
  api_config  = google_api_gateway_api_config.app-api-config.id
  display_name = "App Gateway"
  location = var.gcp_region
}

resource "google_firestore_document" "document" {
  # Store a document in Firestore
  namespace = "(default)"
  collection = var.cloud_function_name
  document = "document"
  field {
    name  = "name1"
    value = "value1"
  }
}

resource "google_service_account" "api_functions_gw" {
  # Create a service account for API Gateway to invoke Cloud Functions
  account_id   = "api-functions-gw"
  display_name = "api-functions-gw"
  depends_on = [
    google_api_gateway_api_iam_member.servic_member
  ]
}

resource "google_service_account_key" "service_account_key" {
  # Generate a key for the service account
  service_account_id = google_service_account.api_functions_gw.name
}

resource "null_resource" "service_account_key_output" {
  # Output the service account key securely
  provisioner "local-exec" {
    command = "kubectl create secret generic api-function-gw-key --from-file=apikey.json=${google_service_account_key.service_account_key.private_key}"
  }

  depends_on = [
    google_service_account_key.service_account_key
  ]
}

resource "google_project_iam_custom_role" "api_functions_gw_role" {
  # Define a custom role for the service account
  role_id     = "api_functions_gw_role"
  title       = "Custom Role for API Functions Gateway"
  description = "Role for API Gateway to invoke Cloud Functions"
  permissions = [
    "cloudfunctions.functions.invoke"
  ]
  stage       = "GA"
}

resource "google_project_iam_member" "functions_invoker_binding" {
  # Bind the custom role to the service account (Cloud Functions INVOKER)
  project    = var.gcp_project
  role       = google_project_iam_custom_role.api_functions_gw_role.name
  member     = "serviceAccount:${google_service_account.api_functions_gw.email}"
}
