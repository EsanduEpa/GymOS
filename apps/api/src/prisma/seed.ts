import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GymOS database...');

  // ─── SUPER ADMIN ───
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  let superAdmin = await prisma.user.findFirst({
    where: { email: 'admin@gymos.lk', role: 'SUPER_ADMIN' },
  });
  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        email: 'admin@gymos.lk',
        passwordHash: adminPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
  }
  console.log(`✅ Super Admin: ${superAdmin.email}`);

  // ─── DEMO TENANT ───
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'fitzone' },
    update: {},
    create: {
      name: 'FitZone Gym',
      slug: 'fitzone',
      primaryColor: '#6366f1',
      address: '42 Galle Road, Colombo 03, Sri Lanka',
      phone: '+94 11 234 5678',
      email: 'info@fitzone.lk',
      plan: 'PRO',
    },
  });
  console.log(`✅ Tenant: ${tenant.name}`);

  // ─── GYM OWNER ───
  const ownerPassword = await bcrypt.hash('Owner123!', 12);
  const owner = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'owner@fitzone.lk' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'owner@fitzone.lk',
      passwordHash: ownerPassword,
      firstName: 'Kasun',
      lastName: 'Perera',
      phone: '+94 77 123 4567',
      role: 'GYM_OWNER',
    },
  });
  console.log(`✅ Gym Owner: ${owner.email}`);

  // ─── TRAINER ───
  const trainerPassword = await bcrypt.hash('Trainer123!', 12);
  const trainerUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'trainer@fitzone.lk' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'trainer@fitzone.lk',
      passwordHash: trainerPassword,
      firstName: 'Nuwan',
      lastName: 'Silva',
      phone: '+94 77 987 6543',
      role: 'TRAINER',
    },
  });

  const trainer = await prisma.trainer.upsert({
    where: { userId: trainerUser.id },
    update: {},
    create: {
      userId: trainerUser.id,
      specializations: ['Weight Training', 'HIIT', 'CrossFit'],
      bio: 'Certified personal trainer with 8 years of experience.',
      certifications: ['ACE CPT', 'CrossFit L2'],
      rating: 4.8,
    },
  });
  console.log(`✅ Trainer: ${trainerUser.email}`);

  // ─── DEMO MEMBER ───
  const memberPassword = await bcrypt.hash('Member123!', 12);
  const memberUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'member@fitzone.lk' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'member@fitzone.lk',
      passwordHash: memberPassword,
      firstName: 'Dilshan',
      lastName: 'Fernando',
      phone: '+94 71 555 1234',
      role: 'MEMBER',
    },
  });

  await prisma.member.upsert({
    where: { userId: memberUser.id },
    update: {},
    create: {
      userId: memberUser.id,
      gender: 'MALE',
      height: 175,
      weight: 78,
      bodyFat: 18,
      dateOfBirth: new Date('1995-03-15'),
    },
  });
  console.log(`✅ Member: ${memberUser.email}`);

  // ─── MEMBERSHIP PLANS ───
  const plans = [
    {
      tenantId: tenant.id,
      name: 'Basic',
      description: 'Access to gym floor and basic equipment',
      price: 3500,
      currency: 'LKR',
      duration: 30,
      durationType: 'MONTHLY' as const,
      features: ['Gym floor access', 'Locker room', 'Basic equipment'],
    },
    {
      tenantId: tenant.id,
      name: 'Premium',
      description: 'Full access including group classes',
      price: 6500,
      currency: 'LKR',
      duration: 30,
      durationType: 'MONTHLY' as const,
      features: ['All Basic features', 'Group classes', 'Sauna access', 'Nutrition guidance'],
    },
    {
      tenantId: tenant.id,
      name: 'VIP',
      description: 'Everything plus personal training sessions',
      price: 12000,
      currency: 'LKR',
      duration: 30,
      durationType: 'MONTHLY' as const,
      features: ['All Premium features', '4 PT sessions/month', 'Diet plan', 'Priority booking', 'Guest passes'],
    },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.create({ data: plan });
  }
  console.log(`✅ Membership Plans: ${plans.length} plans created`);

  // ─── EXERCISES ───
  const exercises = [
    // Chest
    { name: 'Barbell Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: 'Barbell', instructions: ['Lie flat on bench', 'Grip bar slightly wider than shoulders', 'Lower to chest', 'Press up to lockout'] },
    { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: 'Dumbbells', instructions: ['Set bench to 30-45 degrees', 'Press dumbbells up', 'Lower with control'] },
    { name: 'Cable Flyes', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders'], equipment: 'Cable Machine', instructions: ['Set pulleys at chest height', 'Bring handles together in arc motion', 'Squeeze at center'] },
    { name: 'Push-Ups', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Core'], equipment: 'Bodyweight', instructions: ['Hands shoulder-width apart', 'Lower chest to floor', 'Push back up'] },
    { name: 'Dumbbell Flyes', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders'], equipment: 'Dumbbells', instructions: ['Lie flat on bench', 'Open arms in arc', 'Bring back together'] },

    // Back
    { name: 'Deadlift', muscleGroup: 'Back', secondaryMuscles: ['Hamstrings', 'Glutes', 'Core'], equipment: 'Barbell', instructions: ['Stand with feet hip-width', 'Hinge at hips', 'Grip bar', 'Drive through heels to stand'] },
    { name: 'Pull-Ups', muscleGroup: 'Back', secondaryMuscles: ['Biceps', 'Core'], equipment: 'Pull-up Bar', instructions: ['Grip bar overhand', 'Pull chin above bar', 'Lower with control'] },
    { name: 'Barbell Rows', muscleGroup: 'Back', secondaryMuscles: ['Biceps', 'Core'], equipment: 'Barbell', instructions: ['Bend at hips 45 degrees', 'Pull bar to lower chest', 'Squeeze shoulder blades'] },
    { name: 'Lat Pulldown', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], equipment: 'Cable Machine', instructions: ['Grip wide bar overhand', 'Pull to upper chest', 'Control the return'] },
    { name: 'Seated Cable Row', muscleGroup: 'Back', secondaryMuscles: ['Biceps', 'Rear Delts'], equipment: 'Cable Machine', instructions: ['Sit upright', 'Pull handle to torso', 'Squeeze back muscles'] },

    // Legs
    { name: 'Barbell Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Core'], equipment: 'Barbell', instructions: ['Bar on upper back', 'Feet shoulder-width', 'Squat to parallel', 'Drive up through heels'] },
    { name: 'Leg Press', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], equipment: 'Leg Press Machine', instructions: ['Sit in machine', 'Feet shoulder-width on platform', 'Lower weight', 'Press back up'] },
    { name: 'Romanian Deadlift', muscleGroup: 'Legs', secondaryMuscles: ['Back', 'Glutes'], equipment: 'Barbell', instructions: ['Hold bar at hips', 'Hinge forward keeping back straight', 'Feel hamstring stretch', 'Return to standing'] },
    { name: 'Leg Extensions', muscleGroup: 'Legs', secondaryMuscles: [], equipment: 'Leg Extension Machine', instructions: ['Sit in machine', 'Extend legs fully', 'Lower with control'] },
    { name: 'Leg Curls', muscleGroup: 'Legs', secondaryMuscles: [], equipment: 'Leg Curl Machine', instructions: ['Lie face down', 'Curl heels toward glutes', 'Lower slowly'] },
    { name: 'Bulgarian Split Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Core'], equipment: 'Dumbbells', instructions: ['Rear foot on bench', 'Lunge down', 'Drive up through front heel'] },

    // Shoulders
    { name: 'Overhead Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps', 'Core'], equipment: 'Barbell', instructions: ['Bar at shoulder height', 'Press overhead', 'Lock out arms', 'Lower with control'] },
    { name: 'Lateral Raises', muscleGroup: 'Shoulders', secondaryMuscles: [], equipment: 'Dumbbells', instructions: ['Arms at sides', 'Raise to shoulder height', 'Lower slowly'] },
    { name: 'Face Pulls', muscleGroup: 'Shoulders', secondaryMuscles: ['Upper Back'], equipment: 'Cable Machine', instructions: ['Set cable at face height', 'Pull rope to face', 'Squeeze rear delts'] },
    { name: 'Arnold Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps'], equipment: 'Dumbbells', instructions: ['Start palms facing you', 'Rotate and press up', 'Reverse on way down'] },

    // Arms
    { name: 'Barbell Curl', muscleGroup: 'Arms', secondaryMuscles: ['Forearms'], equipment: 'Barbell', instructions: ['Stand with bar at thighs', 'Curl up keeping elbows fixed', 'Lower with control'] },
    { name: 'Tricep Dips', muscleGroup: 'Arms', secondaryMuscles: ['Chest', 'Shoulders'], equipment: 'Dip Bars', instructions: ['Grip bars', 'Lower body bending elbows', 'Push back up'] },
    { name: 'Hammer Curls', muscleGroup: 'Arms', secondaryMuscles: ['Forearms'], equipment: 'Dumbbells', instructions: ['Hold dumbbells neutral grip', 'Curl up', 'Lower slowly'] },
    { name: 'Skull Crushers', muscleGroup: 'Arms', secondaryMuscles: [], equipment: 'EZ Bar', instructions: ['Lie on bench', 'Lower bar to forehead', 'Extend arms'] },
    { name: 'Cable Tricep Pushdown', muscleGroup: 'Arms', secondaryMuscles: [], equipment: 'Cable Machine', instructions: ['Grip rope or bar', 'Push down until arms extended', 'Control the return'] },

    // Core
    { name: 'Plank', muscleGroup: 'Core', secondaryMuscles: ['Shoulders'], equipment: 'Bodyweight', instructions: ['Forearms on ground', 'Body in straight line', 'Hold position', 'Engage core throughout'] },
    { name: 'Hanging Leg Raises', muscleGroup: 'Core', secondaryMuscles: ['Hip Flexors'], equipment: 'Pull-up Bar', instructions: ['Hang from bar', 'Raise legs to parallel', 'Lower with control'] },
    { name: 'Russian Twists', muscleGroup: 'Core', secondaryMuscles: ['Obliques'], equipment: 'Bodyweight', instructions: ['Sit with feet elevated', 'Twist torso side to side', 'Keep core engaged'] },
    { name: 'Cable Woodchops', muscleGroup: 'Core', secondaryMuscles: ['Obliques', 'Shoulders'], equipment: 'Cable Machine', instructions: ['Set cable high', 'Pull diagonally across body', 'Control the rotation'] },
    { name: 'Ab Rollout', muscleGroup: 'Core', secondaryMuscles: ['Shoulders', 'Back'], equipment: 'Ab Wheel', instructions: ['Kneel with wheel in front', 'Roll forward extending body', 'Pull back to start'] },

    // Cardio
    { name: 'Treadmill Running', muscleGroup: 'Cardio', secondaryMuscles: ['Legs'], equipment: 'Treadmill', instructions: ['Set speed and incline', 'Maintain steady pace', 'Cool down gradually'] },
    { name: 'Battle Ropes', muscleGroup: 'Cardio', secondaryMuscles: ['Shoulders', 'Core', 'Arms'], equipment: 'Battle Ropes', instructions: ['Hold rope ends', 'Alternate arm waves', 'Maintain intensity'] },
    { name: 'Box Jumps', muscleGroup: 'Cardio', secondaryMuscles: ['Legs', 'Glutes'], equipment: 'Plyo Box', instructions: ['Stand before box', 'Jump onto box', 'Step down and repeat'] },
    { name: 'Burpees', muscleGroup: 'Cardio', secondaryMuscles: ['Full Body'], equipment: 'Bodyweight', instructions: ['Stand tall', 'Drop to push-up', 'Jump feet forward', 'Jump up with arms overhead'] },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.create({ data: exercise });
  }
  console.log(`✅ Exercises: ${exercises.length} exercises created`);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('  Super Admin: admin@gymos.lk / Admin123!');
  console.log('  Gym Owner:   owner@fitzone.lk / Owner123!');
  console.log('  Trainer:     trainer@fitzone.lk / Trainer123!');
  console.log('  Member:      member@fitzone.lk / Member123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
