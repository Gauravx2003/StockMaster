const { PrismaClient } = require('@prisma/client');
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Resetting DB...");
  
  // Order matters (respect FK constraints)
  await prisma.ledger.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.subLocation.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.location.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // ------------------------------------------------------
  // USERS
  // ------------------------------------------------------
  console.log("👤 Seeding Users...");

  await prisma.user.createMany({
    data: [
      {
        name: "Admin Manager",
        email: "manager@stockmaster.io",
        passwordHash: "hashed_pw",
        role: "MANAGER",
      },
      ...Array.from({ length: 4 }).map((_, i) => ({
        name: faker.person.fullName(),
        email: `staff${i + 1}@stockmaster.io`,
        passwordHash: "hashed_pw",
        role: "STAFF",
      })),
    ],
  });

  // ------------------------------------------------------
  // LOCATIONS
  // ------------------------------------------------------
  console.log("📍 Seeding Locations...");

  const locations = [];
  for (let i = 0; i < 10; i++) {
    const loc = await prisma.location.create({
      data: { name: faker.location.city() },
    });
    locations.push(loc);
  }

  // ------------------------------------------------------
  // WAREHOUSES
  // ------------------------------------------------------
  console.log("🏭 Seeding Warehouses...");

  const warehouses = [];
  for (let i = 0; i < 20; i++) {
    const loc = faker.helpers.arrayElement(locations);
    const wh = await prisma.warehouse.create({
      data: {
        name: faker.company.name() + " Warehouse",
        shortcode: faker.string.alpha({ length: 3, casing: "upper" }),
        locationId: loc.id,
        type: faker.helpers.arrayElement(["MAIN", "SECONDARY"]),
        capacity: faker.number.int({ min: 100, max: 5000 }),
      },
    });
    warehouses.push(wh);
  }

  // ------------------------------------------------------
  // PRODUCTS
  // ------------------------------------------------------
  console.log("🏷️ Seeding Products...");

  const products = [];
  for (let i = 0; i < 50; i++) {
    const prod = await prisma.product.create({
      data: {
        sku: faker.string.alphanumeric(10).toUpperCase(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        minStock: faker.number.int({ min: 5, max: 30 }),
        uom: "UNIT",
        price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
        isActive: true,
      },
    });
    products.push(prod);
  }

  // ------------------------------------------------------
  // SUB LOCATIONS
  // ------------------------------------------------------
  console.log("📦 Creating Sub Locations...");

  const subLocations = [];
  for (const warehouse of warehouses) {
    const numberOfSubLocations = faker.number.int({ min: 1, max: 4 });

    for (let i = 0; i < numberOfSubLocations; i++) {
      const sub = await prisma.subLocation.create({
        data: {
          name: faker.helpers.arrayElement([
            "Rack A", "Rack B", "Rack C",
            "Shelf 1", "Shelf 2"
          ]),
          warehouseId: warehouse.id,
        },
      });

      subLocations.push(sub);
    }
  }

  // ------------------------------------------------------
  // STOCK (safe, unique)
  // ------------------------------------------------------
  console.log("📚 Seeding Stock...");

  // To prevent duplicates: upsert for each (warehouse, product, subLocation)
  for (const subLoc of subLocations) {
    const warehouse = warehouses.find(w => w.id === subLoc.warehouseId);

    // assign 20–30 random products per subLocation
    const stockProducts = faker.helpers.arrayElements(products, 25);

    for (const product of stockProducts) {
      await prisma.stock.upsert({
        where: {
          warehouseId_productId_subLocationId: {
            warehouseId: warehouse.id,
            productId: product.id,
            subLocationId: subLoc.id
          }
        },
        update: {
          quantity: faker.number.int({ min: 0, max: 200 })
        },
        create: {
          warehouseId: warehouse.id,
          productId: product.id,
          subLocationId: subLoc.id,
          quantity: faker.number.int({ min: 0, max: 200 })
        }
      });
    }
  }

  console.log("🔥 Seeding Completed Successfully!");
}

main()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
