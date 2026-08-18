
# 🎯 Influencer Sponsorship Application

A **Spring Boot REST API** that connects **brands** and **influencers** through sponsorship offers.
Brands can create offers based on influencer reach, while influencers can accept or reject these deals.
The system automatically manages **brand budgets**, **influencer earnings**, and **offer statuses**.

---

## 🧱 Features

* Influencer and brand registration
* Offer creation, acceptance, and rejection workflow
* Automatic budget and earnings updates
* Pagination and sorting for influencer and brand listings
* Integrated **Flyway** database migrations
* Persistent storage with **MySQL**
* Exception handling via a global handler
* Clean, modular architecture using **Spring Boot + Maven**

---

## ⚙️ Tech Stack

| Component       | Technology               |
| --------------- | ------------------------ |
| Framework       | Spring Boot              |
| Build Tool      | Maven                    |
| Database        | MySQL                    |
| ORM             | Spring Data JPA          |
| Migration Tool  | Flyway                   |
| Language        | Java 17+                 |
| Error Handling  | Global Exception Handler |
| Version Control | Git & GitHub             |

---

## 🧩 Entity Overview

```
Brand (1) ────< Offer >──── (1) Influencer
```

* **Brand**: owns a sponsorship budget and can create multiple offers.
* **Influencer**: has followers, engagement rate, and total earnings.
* **Offer**: links a brand and an influencer, with an amount and status.

---

## 📂 Project Structure

```
src/
 └── main/
      └── java/com/prxy/influencer_sponsorship_app/
      |   ├── Constant/
      |   │    └── ApiPath.java
      |   │
      |   ├── Controller/
      |   │    ├── BrandController.java
      |   │    ├── InfluencerController.java
      |   │    └── OfferController.java
      |   │
      |   ├── DTO/
      |   │    ├── ApiErrorResponse.java
      |   │    ├── InfluencerRequest.java
      |   │    ├── OfferRequest.java
      |   │    ├── OfferResponse.java
      |   │    └── OfferUpdateRequest.java
      |   │
      |   ├── Exception/
      |   │    ├── BrandNotFoundException.java
      |   │    ├── InfluencerNotFoundException.java
      |   │    ├── OfferNotFoundException.java
      |   │    ├── InvalidOfferStateException.java
      |   │    ├── InsufficientResourcesException.java
      |   │    └── GlobalExceptionHandler.java
      |   │
      |   ├── Model/
      |   │    ├── Brand.java
      |   │    ├── Influencer.java
      |   │    └── Offer.java
      |   │
      |   ├── Repository/
      |   │    ├── BrandRepo.java
      |   │    ├── InfluencerRepo.java
      |   │    └── OfferRepo.java
      |   │
      |   ├── Service/
      |   │    ├── BrandService.java
      |   │    ├── InfluencerService.java
      |   │    └── OfferService.java
      |   │
      |   └── InfluencerSponsorshipAppApplication.java
      |
      └── resources/
          ├── application.properties
          └── db/migration/
              ├── V1__init.sql
              ├── V2__data.sql
```

---

## 🚀 Running the Application

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/prxy-rgb/influencer-sponsorship-app.git
```

### 2️⃣ Open in Your Preferred IDE
Open the project in **IntelliJ IDEA**, **Eclipse**, or **VS Code (with Spring Boot extension)**.

### 3️⃣ Create the MySQL Database
Log into MySQL and create a new database:
```sql
CREATE DATABASE sponsorship_db;
```

Update your MySQL credentials, refer Database Configuration

### 4️⃣ Build the Project
In your IDE terminal or command line:
```bash
mvn clean install
```

### 5️⃣ Run the Application
Run the main class:
```
src/main/java/com/prxy/influencer_sponsorship_app/InfluencerSponsorshipAppApplication.java
```
Alternatively, from the terminal:
```bash
mvn spring-boot:run
```

### 6️⃣ Access the API
Once the application starts successfully, the server will run at:
```
http://localhost:8080/api/v1
```

You can now test the endpoints using **Postman**, **cURL**, or **your browser**.

## 🗃️ Database Configuration

### MySQL + Flyway Integration

`src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sponsorship_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true

```

Each migration file should follow the naming convention:

```
V1__init.sql
V2__data.sql
```

Flyway automatically applies migrations on startup.

---

## 🌐 REST Endpoints

### 🧍 Influencers

| Method | Endpoint            | Description                                  |
| ------ | ------------------- | -------------------------------------------- |
| `POST` | `/influencers`      | Register a new influencer                    |
| `GET`  | `/influencers`      | List influencers (with pagination & sorting) |
| `GET`  | `/influencers/{id}` | Retrieve a specific influencer               |

### 🏢 Brands

| Method | Endpoint       | Description                             |
| ------ | -------------- | --------------------------------------- |
| `POST` | `/brands`      | Register a new brand                    |
| `GET`  | `/brands`      | List brands (with pagination & sorting) |
| `GET`  | `/brands/{id}` | Retrieve a specific brand               |

### 💼 Offers

| Method  | Endpoint                  | Description                           |
| ------- | ------------------------- | ------------------------------------- |
| `POST`  | `/offers`                 | Create a sponsorship offer            |
| `PATCH` | `/offers/{id}`            | Accept or reject an offer             |
| `GET`   | `/offers/influencers?id=X`| View offers for a specific influencer |
| `GET`   | `/offers/brands?id=Y`     | View offers made by a specific brand  |

---

## 🔍 Example API Usage

### ➕ Create an Influencer

```bash
POST /influencers
{
  "name": "Jane Doe",
  "platform": "Instagram",
  "followers": 50000
}
```

### ➕ Create a Brand

```bash
POST /brands
{
  "name": "TechNova",
  "budget": 10000
}
```

### ➕ Create an Offer

```bash
POST /offers
{
  "brandId": 1,
  "influencerId": 3,
  "amount": 1500
}
```

### ✅ Accept an Offer

```bash
PATCH /offers/5
{
  "status": "ACCEPTED"
}
```

---

### 🔍 Retrieve Influencer by ID

```bash
GET /influencers/3
Response:
{
  "id": 3,
  "name": "Jane Doe",
  "platform": "Instagram",
  "followers": 50000,
  "totalEarnings": 1500.0
}
```

### 🔍 Retrieve Brand by ID

```bash
GET /brands/2
Response:
{
  "id": 2,
  "name": "TechNova",
  "budget": 8500.0
}
```

### 🔍 Get Offers by Influencer Id

```bash
GET /offers/influencer?id=3
Response:
[
  {
    "id": 5,
    "proposedAmount": 1500.0,
    "status": "ACCEPTED",
    "influencers" : {
        "id": 3,
        "name": "Jane Doe",
        "platform": "Instagram",
        "followers": 50000,
        "totalEarnings": 1500.0
    },
    "brands": {
        "id": 2,
        "name": "TechNova",
        "budget": 8500.0
    }
  }
]
```

### 🔍 Get Offers by Brand

```bash
GET /offers/brand?id=2
Response:
[
  {
    "id": 5,
    "proposedAmount": 1500.0,
    "status": "ACCEPTED",
    "influencers" : {
        "id": 3,
        "name": "Jane Doe",
        "platform": "Instagram",
        "followers": 50000,
        "totalEarnings": 1500.0
    },
    "brands": {
        "id": 2,
        "name": "TechNova",
        "budget": 8500.0
    }
  }
]
```

---

## 📜 Pagination & Sorting

```
GET /influencers?sort=followers&page=0&size=10
GET /brands?sort=budget&page=1&size=5
```

---

## 🧾 Exception Handling

Centralized error management is handled by `GlobalExceptionHandler`.
Sample response format:

```json
{
  "timestamp": "2025-10-24T12:45:00",
  "message": "Brand Not found with id : 5",
  "details": "Brand Not Found",
}
```

Custom exceptions:

* `BrandNotFoundException`
* `InfluencerNotFoundException`
* `OfferNotFoundException`
* `InvalidOfferStateException`
* `InsufficientResourcesException`

---

## 📝 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.
