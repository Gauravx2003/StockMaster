const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function consolidateStock() {
    console.log('🔄 Consolidating duplicate stock entries...');

    // Get all stock entries
    const allStock = await prisma.stock.findMany({
        orderBy: [
            { warehouseId: 'asc' },
            { productId: 'asc' }
        ]
    });

    console.log(`Found ${allStock.length} stock entries`);

    // Group by warehouseId + productId
    const grouped = {};
    for (const stock of allStock) {
        const key = `${stock.warehouseId}_${stock.productId}`;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(stock);
    }

    // Find duplicates
    const duplicates = Object.entries(grouped).filter(([_, stocks]) => stocks.length > 1);
    console.log(`Found ${duplicates.length} duplicate groups`);

    // Consolidate each duplicate group
    for (const [key, stocks] of duplicates) {
        console.log(`\nConsolidating ${stocks.length} entries for ${key}`);
        
        // Sum up all quantities
        const totalQuantity = stocks.reduce((sum, s) => sum + s.quantity, 0);
        
        // Keep the first one, update its quantity
        const keepStock = stocks[0];
        await prisma.stock.update({
            where: { id: keepStock.id },
            data: { 
                quantity: totalQuantity,
                subLocationId: null // Set to null for consolidated stock
            }
        });
        console.log(`  ✓ Kept stock ${keepStock.id} with quantity ${totalQuantity}`);
        
        // Delete the rest
        for (let i = 1; i < stocks.length; i++) {
            await prisma.stock.delete({
                where: { id: stocks[i].id }
            });
            console.log(`  ✗ Deleted stock ${stocks[i].id}`);
        }
    }

    console.log('\n✅ Consolidation complete!');
}

consolidateStock()
    .then(() => {
        console.log('\n🎉 Done! Now run: npx prisma db push');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Error:', err);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
