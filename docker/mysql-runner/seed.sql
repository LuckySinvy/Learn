-- Playground 预置电商示例库（与 MySQL 课程第 4 章五表 DDL 对齐）
-- MariaDB 11 不支持 utf8mb4_0900_ai_ci，使用默认 collation 等价替代。
CREATE DATABASE IF NOT EXISTS shop DEFAULT CHARSET utf8mb4;
USE shop;

CREATE TABLE users (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username   VARCHAR(50)     NOT NULL,
  email      VARCHAR(100)    NOT NULL,
  phone      VARCHAR(20)     NOT NULL DEFAULT '',
  status     TINYINT         NOT NULL DEFAULT 1 COMMENT '1正常 2冻结',
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户';

CREATE TABLE categories (
  id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name      VARCHAR(50)     NOT NULL,
  parent_id BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0为顶级',
  PRIMARY KEY (id),
  KEY idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类';

CREATE TABLE products (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  name        VARCHAR(100)    NOT NULL,
  price       DECIMAL(10,2)   NOT NULL,
  stock       INT UNSIGNED    NOT NULL DEFAULT 0,
  status      TINYINT         NOT NULL DEFAULT 1 COMMENT '1在售 2下架',
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品';

CREATE TABLE orders (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_no     VARCHAR(32)     NOT NULL,
  user_id      BIGINT UNSIGNED NOT NULL,
  status       TINYINT         NOT NULL DEFAULT 0 COMMENT '0待支付 1已支付 2已发货 3完成 4取消',
  total_amount DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_order_no (order_no),
  KEY idx_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单';

CREATE TABLE order_items (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id   BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity   INT UNSIGNED    NOT NULL DEFAULT 1,
  price      DECIMAL(10,2)   NOT NULL COMMENT '下单时单价快照',
  PRIMARY KEY (id),
  KEY idx_order (order_id),
  KEY idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细';

INSERT INTO users (id, username, email, phone, status, created_at) VALUES
  (1, 'alice',   'alice@example.com',   '13800000001', 1, '2026-01-05 10:00:00'),
  (2, 'bob',     'bob@example.com',     '13800000002', 1, '2026-01-12 14:30:00'),
  (3, 'carol',   'carol@example.com',   '13800000003', 1, '2026-02-01 09:15:00'),
  (4, 'david',   'david@example.com',   '',            2, '2026-02-20 18:00:00'),
  (5, 'erin',    'erin@example.com',    '13800000005', 1, '2026-03-08 11:45:00');

INSERT INTO categories (id, name, parent_id) VALUES
  (1, '电子产品', 0),
  (2, '手机',     1),
  (3, '笔记本',   1),
  (4, '图书',     0),
  (5, '技术书',   4);

INSERT INTO products (id, category_id, name, price, stock, status, created_at) VALUES
  (1, 2, 'Phone X 128G',      4999.00, 50,  1, '2026-01-01 00:00:00'),
  (2, 2, 'Phone X 256G',      5699.00, 30,  1, '2026-01-01 00:00:00'),
  (3, 3, 'AirBook 14',        7999.00, 20,  1, '2026-01-10 00:00:00'),
  (4, 3, 'AirBook 16',        9999.00, 8,   1, '2026-01-10 00:00:00'),
  (5, 5, 'MySQL 实战手册',      89.00, 200, 1, '2026-02-01 00:00:00'),
  (6, 5, 'Redis 设计与实现',    79.00, 150, 1, '2026-02-01 00:00:00'),
  (7, 2, 'Phone mini（已下架）', 2999.00, 0, 2, '2025-12-01 00:00:00');

INSERT INTO orders (id, order_no, user_id, status, total_amount, created_at) VALUES
  (1, 'NO20260110001', 1, 3, 4999.00,  '2026-01-10 10:20:00'),
  (2, 'NO20260115002', 2, 3, 8078.00,  '2026-01-15 15:00:00'),
  (3, 'NO20260201003', 1, 1, 5699.00,  '2026-02-01 09:30:00'),
  (4, 'NO20260210004', 3, 2, 168.00,   '2026-02-10 20:10:00'),
  (5, 'NO20260305005', 5, 0, 9999.00,  '2026-03-05 12:00:00'),
  (6, 'NO20260310006', 2, 4, 79.00,    '2026-03-10 08:05:00'),
  (7, 'NO20260320007', 1, 1, 89.00,    '2026-03-20 22:40:00');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
  (1, 1, 1, 4999.00),
  (2, 3, 1, 7999.00),
  (2, 6, 1, 79.00),
  (3, 2, 1, 5699.00),
  (4, 5, 1, 89.00),
  (4, 6, 1, 79.00),
  (5, 4, 1, 9999.00),
  (6, 6, 1, 79.00),
  (7, 5, 1, 89.00);
