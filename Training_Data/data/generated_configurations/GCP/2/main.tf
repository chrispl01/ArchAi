variable "project_id" {
  description = "The project ID in Google Cloud"
  type        = string
}

variable "region" {
  description = "The region where resources will be deployed"
  type        = string
}

variable "zone" {
  description = "The zone where StartApp will be deployed"
  type        = string
}

variable "web_vm_name" {
  description = "Name of the web server VM"
  type        = string
}

variable "start_app_name" {
  description = "Name of the start application VM"
  type        = string
}

variable "db_vm_name" {
  description = "Name of the database VM"
  type        = string
}

variable "website_link" {
  description = "Website link to be displayed on the web server"
  type        = string
}

variable "bucket_name" {
  description = "Name of the Google Cloud Storage bucket"
  type        = string
}

variable "initial_content_file" {
  description = "Path to the initial content file"
  type        = string
}

resource "google_compute_instance" "web_vm" {
  name         = var.web_vm_name
  machine_type = "f1-micro"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config { }
    
  }

  metadata_startup_script = <<-EOT
    #update repository
    apt-get update
    #install apache
    apt-get install apache2 -y
    #show the website link
    echo "<html><head><title>Welcome to Web Server</title></head><body bgcolor=\"black\" text=\"white\" style=\"text-align:center;\"><h1><br>This is Web Server<br>Website Link: ${var.website_link}</h1></body></html>" >> /var/www/html/index.html
    /usr/sbin/apache2ctl -D FOREGROUND
  EOT
}

resource "google_compute_instance" "start_app" {
  name         = var.start_app_name
  machine_type = "f1-micro"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config { }
    
  }

  metadata_startup_script = <<-EOT
    #update repository
    apt-get update
  EOT
}

resource "google_compute_instance" "db_vm" {
  name         = var.db_vm_name
  machine_type = "f1-micro"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config { }
    
  }

  metadata_startup_script = <<-EOT
    #update repository
    apt-get update
    apt-get install mysql-server -y
    chown -R mysql:mysql /var/lib/mysql/
    systemctl restart mysql
    mysql -e "CREATE DATABASE mydb;"
    mysql -e "CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword';"
    mysql -e "GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'%';"
    mysql -e "FLUSH PRIVILEGES;" 
    systemctl stop mysql
  EOT
}

resource "google_storage_bucket" "static_files" {
  name     = var.bucket_name
  location = var.region
}

resource "google_storage_bucket_object" "homepage" {
  name   = "homepage.txt"
  bucket = google_storage_bucket.static_files.name
  source = var.initial_content_file
}

resource "google_storage_bucket_iam_binding" "read_only" {
  bucket = google_storage_bucket.static_files.name

  role    = "roles/storage.legacyObjectReader"
  members = ["allUsers"] # Anyone can read the content (public)
}

data "google_client_config" "default" {
}

provider "google" {
  project     = var.project_id
  region      = var.region

}


