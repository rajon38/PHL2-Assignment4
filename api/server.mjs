var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express8 from "express";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// prisma/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum Role {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nmodel User {\n  id              String           @id\n  name            String\n  email           String\n  emailVerified   Boolean          @default(false)\n  image           String?\n  createdAt       DateTime         @default(now())\n  updatedAt       DateTime         @updatedAt\n  role            Role?            @default(CUSTOMER)\n  phone           String?\n  status          UserStatus?      @default(ACTIVE)\n  providerProfile ProviderProfile?\n  sessions        Session[]\n  accounts        Account[]\n  orders          Order[]          @relation("CustomerOrders")\n  reviews         Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  name      String   @unique\n  createdAt DateTime @default(now())\n\n  meals Meal[]\n}\n\nmodel Meal {\n  id          String   @id @default(uuid())\n  providerId  String\n  categoryId  String\n  name        String\n  description String?\n  price       Float\n  image       String?\n  views       Int      @default(0)\n  isAvailable Boolean  @default(true)\n  createdAt   DateTime @default(now())\n\n  provider   ProviderProfile @relation(fields: [providerId], references: [id])\n  category   Category        @relation(fields: [categoryId], references: [id])\n  orderItems OrderItem[]\n  reviews    Review[]\n}\n\nmodel Order {\n  id              String        @id @default(uuid())\n  customerId      String\n  providerId      String\n  totalPrice      Float\n  deliveryAddress String\n  status          OrderStatus   @default(PENDING)\n  paymentMethod   PaymentMethod @default(COD)\n  createdAt       DateTime      @default(now())\n\n  customer User            @relation("CustomerOrders", fields: [customerId], references: [id])\n  provider ProviderProfile @relation("ProviderOrders", fields: [providerId], references: [id])\n  items    OrderItem[]\n}\n\nenum OrderStatus {\n  PENDING\n  ACCEPTED\n  PREPARING\n  ON_THE_WAY\n  DELIVERED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  COD\n}\n\nmodel OrderItem {\n  id       String @id @default(uuid())\n  orderId  String\n  mealId   String\n  quantity Int\n  price    Float\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal  Meal  @relation(fields: [mealId], references: [id])\n\n  @@unique([orderId, mealId])\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String\n  description    String?\n  address        String\n  phone          String\n  isOpen         Boolean  @default(true)\n  createdAt      DateTime @default(now())\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  meals  Meal[]\n  orders Order[] @relation("ProviderOrders")\n}\n\nmodel Review {\n  id         String   @id @default(uuid())\n  customerId String\n  mealId     String\n  rating     Int\n  comment    String?\n  createdAt  DateTime @default(now())\n\n  customer User @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  meal     Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@unique([customerId, mealId])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":null},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"image","kind":"scalar","type":"String"},{"name":"views","kind":"scalar","type":"Int"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderOrders"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":null},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"ProviderOrders"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Meal: "Meal",
  Order: "Order",
  OrderItem: "OrderItem",
  ProviderProfile: "ProviderProfile",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  createdAt: "createdAt"
};
var MealScalarFieldEnum = {
  id: "id",
  providerId: "providerId",
  categoryId: "categoryId",
  name: "name",
  description: "description",
  price: "price",
  image: "image",
  views: "views",
  isAvailable: "isAvailable",
  createdAt: "createdAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  totalPrice: "totalPrice",
  deliveryAddress: "deliveryAddress",
  status: "status",
  paymentMethod: "paymentMethod",
  createdAt: "createdAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  mealId: "mealId",
  quantity: "quantity",
  price: "price"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  description: "description",
  address: "address",
  phone: "phone",
  isOpen: "isOpen",
  createdAt: "createdAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  mealId: "mealId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/enums.ts
var OrderStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  ON_THE_WAY: "ON_THE_WAY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const varificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prism@gmail.com>',
          to: user.email,
          subject: "Hello \u2714",
          text: "Hello world?",
          // Plain-text version of the message
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding:30px; text-align:center; background:#0d6efd; border-radius:8px 8px 0 0;">
              <h1 style="color:#ffffff; margin:0;">Prisma Blog</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#333;">Verify your email address</h2>
              <p style="color:#555; font-size:16px; line-height:1.6;">
                Thanks for signing up! Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${varificationUrl}"
                   style="background:#0d6efd; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-size:16px; display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="color:#555; font-size:14px;">
                If the button doesn\u2019t work, copy and paste the following link into your browser:
              </p>

              <p style="word-break:break-all; color:#0d6efd; font-size:14px;">
                ${url}
              </p>

              <p style="color:#999; font-size:14px; margin-top:30px;">
                If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px; text-align:center; background:#f4f6f8; border-radius:0 0 8px 8px;">
              <p style="margin:0; color:#999; font-size:12px;">
                \xA9 2025 Prisma Blog. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`
          // HTML version of the message
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error);
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/app.ts
import cors from "cors";

// src/middleware/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided incorrect field types or missing fields.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key error.";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 500;
      errorMessage = "Authentication to database failed.";
    } else if (err.errorCode === "P1001") {
      statusCode = 500;
      errorMessage = "Database server is not reachable.";
    }
  }
  res.status(statusCode);
  res.json({ message: errorMessage, error: errorDetails });
}
var globalErrorHandler_default = errorHandler;

// src/middleware/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: /* @__PURE__ */ new Date()
  });
}

// src/routes/index.ts
import express7 from "express";

// src/modules/category/category.router.ts
import express from "express";

// src/modules/category/category.service.ts
var createCategory = async (name) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name }
  });
  if (existingCategory) {
    throw new Error("Category already exists");
  }
  return await prisma.category.create({
    data: {
      name
    }
  });
};
var getAllCategories = async () => {
  return await prisma.category.findMany();
};
var updateCategory = async (categoryId, name) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { name }
  });
  return updatedCategory;
};
var CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  try {
    const category = await CategoryService.createCategory(name);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var updateCategory2 = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  try {
    const updatedCategory = await CategoryService.updateCategory(categoryId, name);
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var CategoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({ message: "Please verify your email to access this resource." });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/modules/category/category.router.ts
var router = express.Router();
router.get("/", CategoryController.getAllCategories);
router.post("/", auth_default("ADMIN" /* ADMIN */), CategoryController.createCategory);
router.patch("/:id", auth_default("ADMIN" /* ADMIN */), CategoryController.updateCategory);
var CategoryRouter = router;

// src/modules/provider/provider.router.ts
import express2 from "express";

// src/modules/provider/provider.service.ts
var createProvider = async (userId, providerInput) => {
  if (!userId) {
    throw new Error("User ID is required to create a provider");
  }
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role !== "PROVIDER" /* PROVIDER */) {
      throw new Error("User must have PROVIDER role");
    }
    const existingProvider = await tx.providerProfile.findUnique({
      where: { userId }
    });
    if (existingProvider) {
      throw new Error("Provider profile already exists for this user");
    }
    const provider = await tx.providerProfile.create({
      data: {
        userId,
        restaurantName: providerInput.restaurantName,
        description: providerInput.description ?? null,
        address: providerInput.address,
        phone: providerInput.phone,
        isOpen: providerInput.isOpen ?? true
      }
    });
    return provider;
  });
};
var getProviderById = async (providerId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId }
  });
  if (!provider) {
    throw new Error("Provider not found");
  }
  return provider;
};
var getAllProviders = async ({ search, isOpen, page, limit, skip, sortBy, sortOrder }) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { restaurantName: { contains: search, mode: "insensitive" } }
      ]
    });
  }
  if (typeof isOpen === "boolean") {
    andConditions.push({
      isOpen
    });
  }
  const data = await prisma.providerProfile.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    select: {
      id: true,
      restaurantName: true,
      address: true,
      phone: true,
      isOpen: true
    }
  });
  const total = await prisma.providerProfile.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var updateProvider = async (providerId, providerInput) => {
  if (!providerId) {
    throw new Error("Provider ID is required to update a provider");
  }
  return await prisma.$transaction(async (tx) => {
    const existingProvider = await tx.providerProfile.findUnique({
      where: { id: providerId }
    });
    if (!existingProvider) {
      throw new Error("Provider profile does not exist");
    }
    const updatedProvider = await tx.providerProfile.update({
      where: { id: providerId },
      data: {
        restaurantName: providerInput.restaurantName,
        description: providerInput.description ?? existingProvider.description,
        address: providerInput.address,
        phone: providerInput.phone,
        isOpen: providerInput.isOpen ?? existingProvider.isOpen
      }
    });
    return updatedProvider;
  });
};
var ProviderService = {
  createProvider,
  getProviderById,
  getAllProviders,
  updateProvider
};

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/modules/provider/provider.controller.ts
var createProvider2 = async (req, res) => {
  const user = req?.user;
  const providerInput = req.body;
  if (!providerInput.restaurantName || !providerInput.address || !providerInput.phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const provider = await ProviderService.createProvider(user?.id, providerInput);
    return res.status(201).json(provider);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var getAllProviders2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const isOpen = req.query.isOpen ? req.query.isOpen === "true" ? true : req.query.isOpen === "false" ? false : void 0 : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const result = await ProviderService.getAllProviders({ search: searchString, isOpen, page, limit, skip, sortBy, sortOrder });
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Could not fetch providers",
      details: e
    });
  }
};
var getProviderById2 = async (req, res) => {
  const providerId = req.params.id;
  try {
    const provider = await ProviderService.getProviderById(providerId);
    return res.status(200).json(provider);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var updateProvider2 = async (req, res) => {
  const providerId = req.params.id;
  const providerInput = req.body;
  try {
    const updatedProvider = await ProviderService.updateProvider(providerId, providerInput);
    return res.status(200).json(updatedProvider);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var ProviderController = {
  createProvider: createProvider2,
  getAllProviders: getAllProviders2,
  getProviderById: getProviderById2,
  updateProvider: updateProvider2
};

// src/modules/provider/provider.router.ts
var router2 = express2.Router();
router2.get("/:id", ProviderController.getProviderById);
router2.get("/", ProviderController.getAllProviders);
router2.post("/", auth_default("PROVIDER" /* PROVIDER */), ProviderController.createProvider);
router2.patch("/:id", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */), ProviderController.updateProvider);
var ProviderRouter = router2;

// src/modules/auth/auth.router.ts
import express3 from "express";

// src/modules/auth/auth.service.ts
var getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      providerProfile: {
        select: {
          restaurantName: true,
          description: true,
          address: true,
          phone: true,
          isOpen: true
        }
      }
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const { providerProfile, ...rest } = user;
  return {
    ...rest,
    ...providerProfile ? { providerProfile } : {}
  };
};
var getAllUsers = async ({ search, emailVerified, page, limit, skip, sortBy, sortOrder }) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    });
  }
  if (typeof emailVerified === "boolean") {
    andConditions.push({
      emailVerified
    });
  }
  const users = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true
    }
  });
  const total = await prisma.user.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: users,
    pagination: {
      total,
      page,
      limit
    }
  };
};
var updateProfile = async (userId, updateData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  return await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, phone: true, image: true }
    });
    if (!existingUser) {
      throw new Error("User does not exist");
    }
    const updatedUser = await tx.user.update({
      where: { id: existingUser.id },
      data: {
        name: updateData.name || existingUser.name,
        phone: updateData.phone || existingUser.phone,
        image: updateData.image || existingUser.image
      }
    });
    return updatedUser;
  });
};
var deleteUser = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to delete a user");
  }
  return await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });
    if (!existingUser) {
      throw new Error("User does not exist");
    }
    const deletedUser = await tx.user.delete({
      where: { id: userId }
    });
    return deletedUser;
  });
};
var AuthService = {
  getUserById,
  getAllUsers,
  updateProfile,
  deleteUser
};

// src/modules/auth/auth.controller.ts
var getUserById2 = async (req, res) => {
  const user = req?.user;
  try {
    const data = await AuthService.getUserById(user.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var getAllUsers2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const emailVerified = req.query.emailVerified ? req.query.emailVerified === "true" ? true : req.query.emailVerified === "false" ? false : void 0 : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const result = await AuthService.getAllUsers({ search: searchString, emailVerified, page, limit, skip, sortBy, sortOrder });
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var updateProfile2 = async (req, res) => {
  const user = req?.user;
  const updateData = req.body;
  try {
    const updatedUser = await AuthService.updateProfile(user.id, updateData);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var deleteUser2 = async (req, res) => {
  const userId = req.params.id;
  try {
    await AuthService.deleteUser(userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var AuthController = {
  getUserById: getUserById2,
  getAllUsers: getAllUsers2,
  updateProfile: updateProfile2,
  deleteUser: deleteUser2
};

// src/modules/auth/auth.router.ts
var router3 = express3.Router();
router3.get("/profile", auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), AuthController.getUserById);
router3.get("/", auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), AuthController.getAllUsers);
router3.patch("/profile", auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), AuthController.updateProfile);
router3.delete("/:id", auth_default("ADMIN" /* ADMIN */), AuthController.deleteUser);
var AuthRouter = router3;

// src/modules/meal/meal.router.ts
import express4 from "express";

// src/modules/meal/meal.service.ts
var createMeal = async (userId, mealInput) => {
  if (!userId || !mealInput.categoryId) {
    throw new Error("User ID and Category ID are required to create a meal.");
  }
  return await prisma.$transaction(async (tx) => {
    const existingProvider = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, providerProfile: { select: { id: true } } }
    });
    if (!existingProvider || !existingProvider.providerProfile) {
      throw new Error("Provider does not exist.");
    }
    const existingCategory = await tx.category.findUnique({
      where: { id: mealInput.categoryId },
      select: { id: true }
    });
    if (!existingCategory) {
      throw new Error("Category does not exist.");
    }
    const newMeal = await tx.meal.create({
      data: {
        providerId: existingProvider.providerProfile.id,
        categoryId: mealInput.categoryId,
        name: mealInput.name,
        description: mealInput.description || "",
        price: mealInput.price,
        image: mealInput.image || "",
        isAvailable: mealInput.isAvailable
      }
    });
    return newMeal;
  });
};
var getAllMeals = async ({ search, isAvailable, page, limit, skip, sortBy, sortOrder }) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    });
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable });
  }
  const data = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isAvailable: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      provider: {
        select: {
          id: true,
          restaurantName: true
        }
      }
    }
  });
  const total = await prisma.meal.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getOneMeal = async (mealId) => {
  if (!mealId) {
    throw new Error("Meal ID is required to get a meal");
  }
  return await prisma.$transaction(async (tx) => {
    await tx.meal.update({
      where: {
        id: mealId
      },
      data: {
        views: {
          increment: 1
        }
      }
    });
    const meal = await tx.meal.findUnique({
      where: { id: mealId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        isAvailable: true,
        views: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        provider: {
          select: {
            id: true,
            restaurantName: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            customer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    if (!meal) {
      throw new Error("Meal not found");
    }
    const reviewStats = await tx.review.aggregate({
      where: {
        mealId
      },
      _count: {
        rating: true
      },
      _avg: {
        rating: true
      }
    });
    return {
      ...meal,
      totalReviews: reviewStats._count.rating,
      averageRating: reviewStats._avg.rating ? Number(reviewStats._avg.rating.toFixed(1)) : 0
    };
  });
};
var updateMeal = async (mealId, mealInput) => {
  if (!mealId) {
    throw new Error("Meal ID is required to update a meal");
  }
  return await prisma.$transaction(async (tx) => {
    const existingMeal = await tx.meal.findUnique({
      where: { id: mealId }
    });
    if (!existingMeal) {
      throw new Error("Meal does not exist");
    }
    const updatedMeal = await tx.meal.update({
      where: { id: mealId },
      data: {
        name: mealInput.name ?? existingMeal.name,
        description: mealInput.description ?? existingMeal.description,
        price: mealInput.price ?? existingMeal.price,
        image: mealInput.image ?? existingMeal.image,
        isAvailable: mealInput.isAvailable ?? existingMeal.isAvailable
      }
    });
    return updatedMeal;
  });
};
var deleteMeal = async (mealId) => {
  if (!mealId) {
    throw new Error("Meal ID is required to delete a meal");
  }
  return await prisma.$transaction(async (tx) => {
    const existingMeal = await tx.meal.findUnique({
      where: { id: mealId }
    });
    if (!existingMeal) {
      throw new Error("Meal does not exist");
    }
    await tx.review.deleteMany({
      where: { mealId }
    });
    const deletedMeal = await tx.meal.delete({
      where: { id: mealId }
    });
    return deletedMeal;
  });
};
var MealService = {
  createMeal,
  getAllMeals,
  getOneMeal,
  updateMeal,
  deleteMeal
};

// src/modules/meal/meal.controller.ts
var createMeal2 = async (req, res) => {
  try {
    const user = req?.user;
    const mealInput = req.body;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newMeal = await MealService.createMeal(user.id, mealInput);
    return res.status(201).json(newMeal);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var getAllMeals2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable === "false" ? false : void 0 : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const result = await MealService.getAllMeals({ search: searchString, isAvailable, page, limit, skip, sortBy, sortOrder });
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Could not fetch meals",
      details: e
    });
  }
};
var getOneMeal2 = async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await MealService.getOneMeal(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    return res.status(200).json(meal);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var updateMeal2 = async (req, res) => {
  try {
    const mealId = req.params.id;
    const mealInput = req.body;
    const updatedMeal = await MealService.updateMeal(mealId, mealInput);
    return res.status(200).json(updatedMeal);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var deleteMeal2 = async (req, res) => {
  try {
    const mealId = req.params.id;
    await MealService.deleteMeal(mealId);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var MealController = {
  createMeal: createMeal2,
  getAllMeals: getAllMeals2,
  getOneMeal: getOneMeal2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2
};

// src/modules/meal/meal.router.ts
var router4 = express4.Router();
router4.get("/", MealController.getAllMeals);
router4.get("/:id", MealController.getOneMeal);
router4.post("/", auth_default("PROVIDER" /* PROVIDER */), MealController.createMeal);
router4.patch("/:id", auth_default("PROVIDER" /* PROVIDER */), MealController.updateMeal);
router4.delete("/:id", auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */), MealController.deleteMeal);
var MealRouter = router4;

// src/modules/review/review.routes.ts
import express5 from "express";

// src/modules/review/review.interface.ts
var isValidRating = (rating) => {
  return rating >= 1 && rating <= 5;
};
var ReviewValidator = {
  isValidRating
};

// src/modules/review/review.service.ts
var createReview = async (userId, reviewInput) => {
  if (!userId || !reviewInput.mealId) {
    throw new Error("User ID and Meal ID are required to create a review");
  }
  return await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    if (!existingUser) {
      throw new Error("User does not exist");
    }
    const existingMeal = await tx.meal.findUnique({
      where: { id: reviewInput.mealId },
      select: { id: true }
    });
    if (!existingMeal) {
      throw new Error("Meal does not exist");
    }
    if (!ReviewValidator.isValidRating(reviewInput.rating)) {
      throw new Error("Invalid rating. Rating should be between 1 and 5.");
    }
    const newReview = await tx.review.create({
      data: {
        mealId: reviewInput.mealId,
        customerId: existingUser.id,
        rating: reviewInput.rating,
        comment: reviewInput.comment || ""
      }
    });
    return newReview;
  });
};
var updateReview = async (reviewId, userId, reviewInput) => {
  if (!reviewId) {
    throw new Error("Review ID is required to update a review");
  }
  return await prisma.$transaction(async (tx) => {
    const existingReview = await tx.review.findUnique({
      where: { id: reviewId }
    });
    if (!existingReview) {
      throw new Error("Review does not exist");
    }
    if (existingReview.customerId !== userId) {
      throw new Error("You are not authorized to update this review");
    }
    if (reviewInput.rating !== void 0 && !ReviewValidator.isValidRating(reviewInput.rating)) {
      throw new Error("Invalid rating. Rating should be between 1 and 5.");
    }
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: {
        rating: reviewInput.rating ?? existingReview.rating,
        comment: reviewInput.comment ?? existingReview.comment
      }
    });
    return updatedReview;
  });
};
var deleteReview = async (reviewId) => {
  if (!reviewId) {
    throw new Error("Review ID is required to delete a review");
  }
  return await prisma.$transaction(async (tx) => {
    const existingReview = await tx.review.findUnique({
      where: { id: reviewId }
    });
    if (!existingReview) {
      throw new Error("Review does not exist");
    }
    await tx.review.delete({
      where: { id: reviewId }
    });
    return { message: "Review deleted successfully" };
  });
};
var ReviewService = {
  createReview,
  updateReview,
  deleteReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const user = req?.user;
    const reviewInput = req.body;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newReview = await ReviewService.createReview(user.id, reviewInput);
    return res.status(201).json(newReview);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var updateReview2 = async (req, res) => {
  try {
    const user = req?.user;
    const reviewId = req.params.id;
    const reviewInput = req.body;
    const updatedReview = await ReviewService.updateReview(reviewId, user.id, reviewInput);
    return res.status(200).json(updatedReview);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var deleteReview2 = async (req, res) => {
  try {
    const reviewId = req.params.id;
    await ReviewService.deleteReview(reviewId);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var ReviewController = {
  createReview: createReview2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/modules/review/review.routes.ts
var router5 = express5.Router();
router5.post("/", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.createReview);
router5.patch("/:id", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.updateReview);
router5.delete("/:id", auth_default("ADMIN" /* ADMIN */), ReviewController.deleteReview);
var ReviewRouter = router5;

// src/modules/order/order.router.ts
import express6 from "express";

// src/modules/order/order.service.ts
var createOrder = async (userId, data) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return prisma.$transaction(async (prisma2) => {
    if (!data.items || data.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }
    const meals = await prisma2.meal.findMany({
      where: {
        id: {
          in: data.items.map((item) => item.mealId)
        }
      }
    });
    if (meals.length !== data.items.length) {
      throw new Error("One or more meals not found");
    }
    let totalPrice = 0;
    const orderItems = data.items.map((item) => {
      const meal = meals.find((m) => m.id === item.mealId);
      const itemTotal = meal.price * item.quantity;
      totalPrice += itemTotal;
      return {
        mealId: meal.id,
        quantity: item.quantity,
        price: meal.price
      };
    });
    const order = await prisma2.order.create({
      data: {
        customerId: userId,
        providerId: data.providerId,
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod ?? "COD",
        totalPrice,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            meal: true
          }
        },
        customer: true,
        provider: true
      }
    });
    return order;
  });
};
var getAllOrders = async ({ customerId, providerId, page, limit, skip, sortBy, sortOrder }) => {
  const andConditions = [];
  if (typeof customerId === "string") {
    andConditions.push({
      customerId
    });
  }
  if (typeof providerId === "string") {
    andConditions.push({
      providerId
    });
  }
  const orders = await prisma.order.findMany({
    where: {
      AND: andConditions
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc"
    },
    include: {
      items: {
        include: {
          meal: true
        }
      },
      customer: true,
      provider: true
    }
  });
  const totalOrders = await prisma.order.count({
    where: {
      AND: andConditions
    }
  });
  return {
    orders,
    meta: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit)
    }
  };
};
var updateOrderById = async (orderId, userId, data) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        customer: true
      }
    });
    if (!order) {
      throw new Error("Order not found");
    }
    const user = await tx.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (order.customerId !== userId) {
      throw new Error("Unauthorized to update this order");
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Only pending orders can be updated");
    }
    let totalPrice = order.totalPrice;
    if (data.items) {
      if (data.items.length === 0) {
        throw new Error("Order must contain at least one item");
      }
      const meals = await tx.meal.findMany({
        where: {
          id: { in: data.items.map((i) => i.mealId) }
        }
      });
      if (meals.length !== data.items.length) {
        throw new Error("One or more meals not found");
      }
      totalPrice = 0;
      const newItems = data.items.map((item) => {
        const meal = meals.find((m) => m.id === item.mealId);
        totalPrice += meal.price * item.quantity;
        return {
          mealId: meal.id,
          quantity: item.quantity,
          price: meal.price
        };
      });
      await tx.orderItem.deleteMany({
        where: { orderId }
      });
      await tx.orderItem.createMany({
        data: newItems.map((i) => ({ ...i, orderId }))
      });
    }
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        deliveryAddress: data.deliveryAddress ?? order.deliveryAddress,
        paymentMethod: data.paymentMethod ?? order.paymentMethod,
        totalPrice
      },
      include: {
        items: {
          include: { meal: true }
        }
      }
    });
    return updatedOrder;
  });
};
var orderStatusUpdate = async (orderId, status) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status
    },
    include: {
      items: {
        include: {
          meal: true
        }
      },
      customer: true,
      provider: true
    }
  });
  return updatedOrder;
};
var deleteOrder = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  await prisma.order.delete({
    where: { id: orderId }
  });
  return { message: "Order deleted successfully" };
};
var OrderService = {
  createOrder,
  getAllOrders,
  updateOrderById,
  orderStatusUpdate,
  deleteOrder
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const user = req?.user;
    const orderInput = req.body;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newOrder = await OrderService.createOrder(user.id, orderInput);
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const { customerId, providerId } = req.query;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const orders = await OrderService.getAllOrders({ customerId, providerId, page, limit, skip, sortBy, sortOrder });
    return res.status(200).json(orders);
  } catch (e) {
    res.status(400).json({
      error: "Could not fetch orders",
      details: e
    });
  }
};
var updateOrderById2 = async (req, res) => {
  try {
    const orderId = req.params.id;
    const user = req?.user;
    const data = req.body;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedOrder = await OrderService.updateOrderById(orderId, user.id, data);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var orderStatusUpdate2 = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const updatedOrder = await OrderService.orderStatusUpdate(orderId, status);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var deleteOrder2 = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await OrderService.deleteOrder(orderId);
    return res.status(200).json(deletedOrder);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
var OrderController = {
  createOrder: createOrder2,
  getAllOrders: getAllOrders2,
  updateOrderById: updateOrderById2,
  orderStatusUpdate: orderStatusUpdate2,
  deleteOrder: deleteOrder2
};

// src/modules/order/order.router.ts
var router6 = express6.Router();
router6.get("/", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "CUSTOMER" /* CUSTOMER */), OrderController.getAllOrders);
router6.post("/", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.createOrder);
router6.patch("/:id", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.updateOrderById);
router6.patch("/status/:id", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */), OrderController.orderStatusUpdate);
router6.delete("/:id", auth_default("ADMIN" /* ADMIN */), OrderController.deleteOrder);
var OrderRouter = router6;

// src/routes/index.ts
var router7 = express7.Router();
var moduleRoutes = [
  {
    path: "/users",
    route: AuthRouter
  },
  {
    path: "/categories",
    route: CategoryRouter
  },
  {
    path: "/providers",
    route: ProviderRouter
  },
  {
    path: "/meals",
    route: MealRouter
  },
  {
    path: "/reviews",
    route: ReviewRouter
  },
  {
    path: "/orders",
    route: OrderRouter
  }
];
moduleRoutes.forEach((route) => router7.use(route.path, route.route));
var routes_default = router7;

// src/app.ts
var app = express8();
app.use(cors({
  origin: process.env.APP_URL,
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express8.json());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api", routes_default);
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
    app_default.listen(process.env.PORT || 5050, () => {
      console.log(`Server is running on port ${process.env.PORT || 3e3}`);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
