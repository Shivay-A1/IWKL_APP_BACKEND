const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function directDatabaseUpdate() {
  try {
    console.log('Step 1: Connecting to database...');
    
    // Find the extra team
    console.log('\nStep 2: Finding ARCHIVED_EXTRA_TEAM...');
    const extraTeam = await prisma.team.findUnique({
      where: { id: 'cmq92orz90001cgk4edd9vex7' }
    });
    
    if (extraTeam) {
      console.log(`Found: ${extraTeam.name} (isActive: ${extraTeam.isActive})`);
      
      console.log('\nStep 3: Deactivating ARCHIVED_EXTRA_TEAM...');
      const updated = await prisma.team.update({
        where: { id: 'cmq92orz90001cgk4edd9vex7' },
        data: { isActive: false }
      });
      
      console.log(`✓ Updated: ${updated.name} (isActive: ${updated.isActive})`);
    } else {
      console.log('✗ ARCHIVED_EXTRA_TEAM not found');
    }

    // Find and deactivate the other archived team
    console.log('\nStep 4: Finding DELETED_ARCHIVED_TEAM...');
    const archivedTeam = await prisma.team.findUnique({
      where: { id: 'cmqjrpd2n0007hazsakqnza1t' }
    });
    
    if (archivedTeam) {
      console.log(`Found: ${archivedTeam.name} (isActive: ${archivedTeam.isActive})`);
      
      console.log('\nStep 5: Deactivating DELETED_ARCHIVED_TEAM...');
      const updated = await prisma.team.update({
        where: { id: 'cmqjrpd2n0007hazsakqnza1t' },
        data: { isActive: false }
      });
      
      console.log(`✓ Updated: ${updated.name} (isActive: ${updated.isActive})`);
    } else {
      console.log('✗ DELETED_ARCHIVED_TEAM not found');
    }

    // Verify final state
    console.log('\nStep 6: Verifying final state...');
    const allTeams = await prisma.team.findMany();
    console.log(`\nTotal teams: ${allTeams.length}`);
    console.log('Active teams:');
    allTeams.filter(t => t.isActive).forEach((team, index) => {
      console.log(`  ${index + 1}. ${team.name} (ID: ${team.id})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

directDatabaseUpdate();
