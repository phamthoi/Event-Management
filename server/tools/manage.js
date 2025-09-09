// tools/manage.js
import inquirer from "inquirer";   // CLI tool để hỏi đáp
import slugify from "slugify";     // Tạo slug từ tên tổ chức
import bcrypt from "bcryptjs";     // Hash password trước khi lưu
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------- ORGANIZATION ----------------

// Hàm tạo tổ chức mới
async function createOrganization() {
  const { name } = await inquirer.prompt([
    { type: "input", name: "name", message: "Tên tổ chức:" }
  ]);

  // Tạo slug từ name
  const slug = slugify(name, { lower: true, strict: true });

  // Check duplicate slug
  const existing = await prisma.organization.findUnique({ where: { slug } });
  if (existing) {
    console.log(`❌ Slug '${slug}' đã tồn tại, vui lòng chọn tên khác.`);
    return;
  }

  // Lưu vào DB
  const org = await prisma.organization.create({
    data: { name, slug }
  });

  console.log("✅ Đã tạo tổ chức:", org);
}

// Liệt kê tất cả tổ chức
async function listOrganizations() {
  const orgs = await prisma.organization.findMany();
  console.log("📋 Danh sách tổ chức:");
  orgs.forEach(o => console.log(`- ${o.id} | ${o.name} | ${o.slug}`));
}

// Xóa tổ chức
async function deleteOrganization() {
  const orgs = await prisma.organization.findMany();
  if (orgs.length === 0) {
    console.log("⚠️ Không có tổ chức nào để xóa.");
    return;
  }

  const { orgId } = await inquirer.prompt([
    {
      type: "list",
      name: "orgId",
      message: "Chọn tổ chức để xóa:",
      choices: orgs.map(o => ({ name: `${o.name} (${o.slug})`, value: o.id }))
    }
  ]);

  await prisma.organization.delete({ where: { id: orgId } });
  console.log("🗑️ Đã xóa tổ chức thành công.");
}

// ---------------- ADMIN ----------------

// Hàm tạo Admin mới
async function createAdmin() {
  const orgs = await prisma.organization.findMany();
  if (orgs.length === 0) {
    console.log("⚠️ Chưa có tổ chức nào, hãy tạo tổ chức trước.");
    return;
  }

  const { orgId, email, password, fullName } = await inquirer.prompt([
    {
      type: "list",
      name: "orgId",
      message: "Chọn tổ chức cho Admin:",
      choices: orgs.map(o => ({ name: o.name, value: o.id }))
    },
    { type: "input", name: "email", message: "Email admin:" },
    { type: "password", name: "password", message: "Mật khẩu admin:" },
    { type: "input", name: "fullName", message: "Tên đầy đủ:" }
  ]);

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Tạo user role ADMIN
  const admin = await prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
      role: "ADMIN",
      organizationId: orgId
    }
  });

  console.log("✅ Đã tạo admin:", admin);
}

// Liệt kê Admins
async function listAdmins() {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    include: { organization: true }
  });

  if (admins.length === 0) {
    console.log("⚠️ Chưa có admin nào.");
    return;
  }

  console.log("📋 Danh sách Admins:");
  admins.forEach(a =>
    console.log(`- ${a.id} | ${a.email} | ${a.fullName || "No Name"} | Org: ${a.organization?.name}`)
  );
}

// Xóa admin
async function deleteAdmin() {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    include: { organization: true }
  });

  if (admins.length === 0) {
    console.log("⚠️ Không có admin nào để xóa.");
    return;
  }

  // Hiển thị danh sách admin để chọn
  const { adminId } = await inquirer.prompt([
    {
      type: "list",
      name: "adminId",
      message: "Chọn admin để xóa:",
      choices: admins.map(a => ({
        name: `${a.email} (${a.fullName || "No Name"}) - Org: ${a.organization?.name}`,
        value: a.id
      }))
    }
  ]);

  // Xóa admin
  await prisma.user.delete({ where: { id: adminId } });
  console.log("🗑️ Đã xóa admin thành công.");
}

// ---------------- MAIN MENU ----------------

async function main() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Bạn muốn làm gì?",
      choices: [
        { name: "➕ Tạo tổ chức", value: "createOrg" },
        { name: "📋 Danh sách tổ chức", value: "listOrgs" },
        { name: "🗑️ Xóa tổ chức", value: "deleteOrg" },
        { name: "👑 Tạo admin", value: "createAdmin" },
        { name: "📋 Danh sách admin", value: "listAdmins" },
        { name: "🗑️ Xóa admin", value: "deleteAdmin" },
        { name: "❌ Thoát", value: "exit" }
      ]
    }
  ]);

  if (action === "createOrg") await createOrganization();
  else if (action === "listOrgs") await listOrganizations();
  else if (action === "deleteOrg") await deleteOrganization();
  else if (action === "createAdmin") await createAdmin();
  else if (action === "listAdmins") await listAdmins();
  else if (action === "deleteAdmin") await deleteAdmin();
  else if (action === "exit") process.exit(0);

  await main(); // Quay lại menu
}

// Chạy tool
main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
