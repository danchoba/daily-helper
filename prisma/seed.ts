import { PrismaClient, UserRole, JobStatus, ApplicationStatus, VerificationStatus, PaymentStatus, PaymentType, UrgencyLevel } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'cleaning' }, update: {}, create: { name: 'Cleaning', slug: 'cleaning', icon: '🧹' } }),
    prisma.category.upsert({ where: { slug: 'garden' }, update: {}, create: { name: 'Garden & Yard', slug: 'garden', icon: '🌿' } }),
    prisma.category.upsert({ where: { slug: 'moving' }, update: {}, create: { name: 'Moving & Lifting', slug: 'moving', icon: '📦' } }),
    prisma.category.upsert({ where: { slug: 'plumbing' }, update: {}, create: { name: 'Plumbing', slug: 'plumbing', icon: '🔧' } }),
    prisma.category.upsert({ where: { slug: 'painting' }, update: {}, create: { name: 'Painting', slug: 'painting', icon: '🎨' } }),
    prisma.category.upsert({ where: { slug: 'errands' }, update: {}, create: { name: 'Errands & Queue', slug: 'errands', icon: '🏃' } }),
    prisma.category.upsert({ where: { slug: 'electrical' }, update: {}, create: { name: 'Electrical', slug: 'electrical', icon: '⚡' } }),
    prisma.category.upsert({ where: { slug: 'other' }, update: {}, create: { name: 'Other', slug: 'other', icon: '🛠️' } }),
  ])

  const hash = (pw: string) => bcrypt.hashSync(pw, 10)

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dailyhelper.bw' },
    update: {},
    create: {
      email: 'admin@dailyhelper.bw',
      name: 'Admin User',
      role: UserRole.ADMIN,
      passwordHash: hash('admin123'),
      phoneNumber: '+267 71 000 001',
    }
  })

  // Customers
  const customer1 = await prisma.user.upsert({
    where: { email: 'thabo@example.com' },
    update: {},
    create: {
      email: 'thabo@example.com',
      name: 'Thabo Molefe',
      role: UserRole.CUSTOMER,
      passwordHash: hash('password123'),
      phoneNumber: '+267 71 234 567',
      customerProfile: { create: { defaultArea: 'Gaborone' } }
    }
  })
  const customer2 = await prisma.user.upsert({
    where: { email: 'naledi@example.com' },
    update: {},
    create: {
      email: 'naledi@example.com',
      name: 'Naledi Ditsebe',
      role: UserRole.CUSTOMER,
      passwordHash: hash('password123'),
      phoneNumber: '+267 72 345 678',
      customerProfile: { create: { defaultArea: 'Francistown' } }
    }
  })

  // Workers
  const worker1 = await prisma.user.upsert({
    where: { email: 'kgosi@example.com' },
    update: {},
    create: {
      email: 'kgosi@example.com',
      name: 'Kgosi Seretse',
      role: UserRole.WORKER,
      passwordHash: hash('password123'),
      phoneNumber: '+267 74 567 890',
      workerProfile: {
        create: {
          bio: 'Experienced cleaner and handyman with 5 years of experience in Gaborone. I take pride in my work and always leave things spotless.',
          area: 'Gaborone',
          servicesOffered: ['Cleaning', 'Garden & Yard', 'Moving & Lifting'],
          trustedBadge: true,
          verificationStatus: VerificationStatus.APPROVED,
          averageRating: 4.8,
          jobsCompleted: 24,
        }
      }
    }
  })
  const worker2 = await prisma.user.upsert({
    where: { email: 'mpho@example.com' },
    update: {},
    create: {
      email: 'mpho@example.com',
      name: 'Mpho Kgwadi',
      role: UserRole.WORKER,
      passwordHash: hash('password123'),
      phoneNumber: '+267 75 678 901',
      workerProfile: {
        create: {
          bio: 'Plumber and painter with 8 years of experience. Based in Francistown, available for jobs across the North East.',
          area: 'Francistown',
          servicesOffered: ['Plumbing', 'Painting', 'Electrical'],
          trustedBadge: false,
          verificationStatus: VerificationStatus.PENDING,
          averageRating: 4.2,
          jobsCompleted: 11,
        }
      }
    }
  })
  const worker3 = await prisma.user.upsert({
    where: { email: 'boitumelo@example.com' },
    update: {},
    create: {
      email: 'boitumelo@example.com',
      name: 'Boitumelo Tau',
      role: UserRole.WORKER,
      passwordHash: hash('password123'),
      phoneNumber: '+267 76 789 012',
      workerProfile: {
        create: {
          bio: 'Quick and reliable errand runner. I handle queues, deliveries, and daily tasks. Always on time.',
          area: 'Gaborone',
          servicesOffered: ['Errands & Queue', 'Moving & Lifting', 'Other'],
          trustedBadge: false,
          verificationStatus: VerificationStatus.NONE,
          averageRating: 0,
          jobsCompleted: 2,
        }
      }
    }
  })

  // Jobs
  const job1 = await prisma.job.create({
    data: {
      customerId: customer1.id,
      title: 'Deep clean 3-bedroom house',
      description: 'Need a thorough cleaning of my 3-bedroom house in Phase 2. Includes bathrooms, kitchen, and all rooms. Must bring own cleaning supplies.',
      categoryId: categories[0].id,
      area: 'Gaborone',
      budget: 300,
      urgency: UrgencyLevel.MEDIUM,
      status: JobStatus.OPEN,
    }
  })
  const job2 = await prisma.job.create({
    data: {
      customerId: customer1.id,
      title: 'Yard clearing and grass cutting',
      description: 'Large yard needs clearing — overgrown grass, some rubbish removal, and general tidying. Tools can be provided.',
      categoryId: categories[1].id,
      area: 'Gaborone',
      budget: 200,
      urgency: UrgencyLevel.LOW,
      status: JobStatus.OPEN,
    }
  })
  const job3 = await prisma.job.create({
    data: {
      customerId: customer2.id,
      title: 'Help moving furniture to new flat',
      description: 'Moving from old flat to new place — need 2 strong people to help carry furniture and boxes. About 3 hours of work.',
      categoryId: categories[2].id,
      area: 'Francistown',
      budget: 400,
      urgency: UrgencyLevel.HIGH,
      status: JobStatus.OPEN,
    }
  })
  const job4 = await prisma.job.create({
    data: {
      customerId: customer2.id,
      title: 'Fix leaking kitchen sink',
      description: 'Kitchen sink has been leaking for a week. Need a plumber to assess and fix. Parts may need to be purchased separately.',
      categoryId: categories[3].id,
      area: 'Francistown',
      budget: 150,
      urgency: UrgencyLevel.URGENT,
      status: JobStatus.IN_PROGRESS,
    }
  })
  const job5 = await prisma.job.create({
    data: {
      customerId: customer1.id,
      title: 'Stand in queue at BPC offices',
      description: 'Need someone to stand in my place at BPC queue in the morning. Should be there by 7am and hold a spot until I arrive around 10am.',
      categoryId: categories[5].id,
      area: 'Gaborone',
      budget: 80,
      urgency: UrgencyLevel.URGENT,
      status: JobStatus.OPEN,
    }
  })

  // Applications
  await prisma.jobApplication.createMany({
    data: [
      { jobId: job1.id, workerId: worker1.id, message: 'I can do this job. I have all cleaning supplies and can start this weekend.', status: ApplicationStatus.PENDING },
      { jobId: job1.id, workerId: worker3.id, message: 'Available and ready to clean. I will bring everything needed.', status: ApplicationStatus.PENDING },
      { jobId: job2.id, workerId: worker1.id, message: 'Experienced with yard work. Can do this job in one day.', status: ApplicationStatus.SELECTED },
      { jobId: job3.id, workerId: worker2.id, message: 'I can help with the move. I have a friend who can help too.', status: ApplicationStatus.PENDING },
      { jobId: job4.id, workerId: worker2.id, message: 'Experienced plumber. I will assess and fix within 2 hours.', status: ApplicationStatus.SELECTED },
      { jobId: job5.id, workerId: worker3.id, message: 'I am very punctual. Will be there at 7am sharp.', status: ApplicationStatus.PENDING },
    ],
    skipDuplicates: true,
  })

  // Pending verification request for worker2
  const verifyPayment = await prisma.payment.create({
    data: {
      userId: worker2.id,
      type: PaymentType.VERIFICATION_FEE,
      amount: 50,
      currency: 'BWP',
      reference: 'ORANGE-2024-VER-001',
      status: PaymentStatus.PENDING,
    }
  })
  await prisma.verificationRequest.create({
    data: {
      workerId: worker2.id,
      paymentReference: 'ORANGE-2024-VER-001',
      paymentId: verifyPayment.id,
      status: VerificationStatus.PENDING,
    }
  })

  // Connection fee payment (pending) for job2 (worker1 selected)
  const connPayment = await prisma.payment.create({
    data: {
      userId: customer1.id,
      type: PaymentType.CONNECTION_FEE,
      amount: 25,
      currency: 'BWP',
      reference: 'ORANGE-2024-CON-001',
      status: PaymentStatus.PENDING,
    }
  })

  // Review for completed job
  const completedJob = await prisma.job.create({
    data: {
      customerId: customer1.id,
      title: 'Paint living room walls',
      description: 'Two coats of white paint on living room walls.',
      categoryId: categories[4].id,
      area: 'Gaborone',
      budget: 500,
      urgency: UrgencyLevel.LOW,
      status: JobStatus.COMPLETED,
    }
  })
  await prisma.review.create({
    data: {
      jobId: completedJob.id,
      customerId: customer1.id,
      workerId: worker1.id,
      rating: 5,
      comment: 'Excellent work! Kgosi was professional, on time, and left the place immaculate.',
    }
  })

  console.log('✅ Seed complete!')
  console.log('')
  console.log('Demo accounts:')
  console.log('  Admin:    admin@dailyhelper.bw / admin123')
  console.log('  Customer: thabo@example.com / password123')
  console.log('  Customer: naledi@example.com / password123')
  console.log('  Worker:   kgosi@example.com / password123 (Trusted)')
  console.log('  Worker:   mpho@example.com / password123 (Pending verification)')
  console.log('  Worker:   boitumelo@example.com / password123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
