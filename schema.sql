CREATE DATABASE IF NOT EXISTS `hospital_management_system`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `hospital_management_system`;

CREATE TABLE IF NOT EXISTS `users` (
  `id`               INT            NOT NULL AUTO_INCREMENT,
  `name`             VARCHAR(120)   NOT NULL,
  `email`            VARCHAR(180)   NOT NULL,
  `hashed_password`  VARCHAR(255)   NOT NULL,
  `role`             ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  `is_active`        TINYINT(1)     NOT NULL DEFAULT 1,
  `created_at`       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `patient_profiles` (
  `id`               INT            NOT NULL AUTO_INCREMENT,
  `user_id`          INT            NOT NULL,
  `blood_group`      VARCHAR(10)    NOT NULL DEFAULT '',
  `address`          VARCHAR(300)   NOT NULL DEFAULT '',
  `health_concerns`  TEXT           NOT NULL DEFAULT 'None',
  `updated_at`       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_patient_profiles_user_id` (`user_id`),
  CONSTRAINT `fk_patient_profiles_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `medicines` (
  `id`          INT            NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(200)   NOT NULL,
  `category`    VARCHAR(100)   NOT NULL DEFAULT 'General',
  `description` TEXT           NOT NULL DEFAULT '',
  `price`       DOUBLE         NOT NULL,
  `stock`       INT            NOT NULL DEFAULT 0,
  `image_url`   VARCHAR(500)   NOT NULL DEFAULT '',
  `created_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_medicines_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
  `id`         INT            NOT NULL AUTO_INCREMENT,
  `user_id`    INT            NOT NULL,
  `total`      DOUBLE         NOT NULL DEFAULT 0.0,
  `status`     ENUM('Pending','Dispatched','Delivered') NOT NULL DEFAULT 'Pending',
  `created_at` DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `order_items` (
  `id`            INT            NOT NULL AUTO_INCREMENT,
  `order_id`      INT            NOT NULL,
  `medicine_id`   INT                NULL DEFAULT NULL,
  `medicine_name` VARCHAR(200)   NOT NULL,
  `quantity`      INT            NOT NULL DEFAULT 1,
  `unit_price`    DOUBLE         NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_medicine`
    FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `hospitals` (
  `id`         INT            NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(200)   NOT NULL,
  `contact`    VARCHAR(50)    NOT NULL DEFAULT '',
  `address`    VARCHAR(300)   NOT NULL DEFAULT '',
  `created_at` DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

