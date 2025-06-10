# Archai

**Archai** is an AI-powered (GPT) tool designed to automatically generate scalable, secure, and cost-efficient cloud architectures based on high-level user input. It was developed as part of a Bachelor's thesis and aims to simplify the process of deploying cloud infrastructure for companies and developers without deep cloud expertise.

---
## 👨‍🎓 Academic Context

**Archai** was developed as part of the Bachelor's thesis:

> _"Automated Cloud Architecture Generation Using Generative AI: Development and Application of a System for Scalable and Cost-Efficient Cloud Infrastructures"_ 
> Author: Christian Plattner
> Supervised by Prof. Andrea Corradini  
> MCI – The Entrepreneurial School®

---
## ✨ Features
 
- 🔧 **Automated Cloud Architecture Generation**

Generate Infrastructure-as-Code (IaC) blueprints using AI based on your project requirements.

- ☁️ **Supports Major Cloud Providers**

Templates for AWS, GCP, and Azure (extensible with plugins).  

- 📦 **Terraform Code Output**

Generates ready-to-deploy Terraform code for seamless integration into CI/CD pipelines.

- 🧠 **AI-Based Configuration Suggestions**

Uses language models to interpret user input and map it to architectural components.

- 📊 **User friendly Web UI**

Visualize and customize your architecture with a simple frontend.

---
## 🛠 How It Works

1. **User Input** – You describe your use case in natural language.
    
2. **AI Interpretation** – Archai uses a language model to extract infrastructure requirements.
    
3. **Template Mapping** – Matches your needs to cloud service templates.
    
4. **IaC Generation** – Outputs structured Terraform code ready for deployment.
---

## 🚀 Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/archai.git
```

### 2. Install and run Backend
Notice:
- To use OpenAi's API correctly a ".env" File with the api key is required
- To change the selected model, changes in "backend/infrastructure/ApiCaller/AiApiCaller.ts" are required

```Bash
cd archai/backend

npm install

npm run start:dev
```

### 3. Install and Run Frontend
Notice:
To access the backend correctly you have to change the URI to "https://localhost:5000" in the "frontend/src/models/services/TerraformService .ts" file

```Bash
cd archai/frontend

npm install 

npm run dev
```

---
## 📊 Dataset Information

This repository contains both **training data** and **evaluation data** used during the development and validation of Archai.

- 📁 `datasets/datasets/` – Contains curated prompts and expected architecture outputs used to fine-tune and evaluate language model responses.
- 📁 `datasets/evaluation_data/` – Includes generated configurations used for evaluation of the generated architectures.
- 📁 `datasets/scripts/` – Includes Scripts used to prepare the datasets

These datasets were used to:
- Improve the accuracy and relevance of generated cloud infrastructure through fine-tuning.
- Validate the AI model’s understanding of infrastructure-related concepts.
- Perform reproducible evaluations for academic purposes.

## 📄 License & Academic Use

This software and its datasets are intended for academic and non-commercial use only, as part of the Bachelor's thesis submitted to MCI – The Entrepreneurial School®.  
Unless otherwise stated, the code is provided under the MIT License.
