const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Kuraa Galaan database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'KuraaGalaan2024!', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@kuraagalaan.org' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@kuraagalaan.org',
      password: hashedPassword,
      firstName: 'Kuraa Galaan',
      lastName: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      country: 'Ethiopia',
      city: 'Addis Ababa',
      language: 'en',
      currency: 'ETB'
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample campaigns
  const campaigns = [
    {
      title: 'Clean Water for Rural Ethiopia',
      slug: 'clean-water-rural-ethiopia',
      description: 'Help us provide clean, safe drinking water to rural communities across Ethiopia. Many villages lack access to clean water, forcing families to walk hours daily for water that may not be safe to drink.',
      shortDescription: 'Providing clean water access to underserved Ethiopian communities',
      content: 'Our clean water initiative aims to drill boreholes and install water pumps in remote villages across Ethiopia. Each borehole can serve up to 500 people and will be maintained by trained local technicians. Your donation will directly fund equipment, installation, and ongoing maintenance.',
      goalAmount: 150000,
      currency: 'ETB',
      category: 'Water & Sanitation',
      tags: ['water', 'health', 'community', 'ethiopia'],
      location: 'Oromia Region, Ethiopia',
      beneficiaryCount: 2500,
      urgencyLevel: 'high',
      status: 'ACTIVE',
      createdById: admin.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
      contactEmail: 'water@kuraagalaan.org',
      contactPhone: '+251911234567',
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: admin.id
    },
    {
      title: 'Education for Ethiopian Children',
      slug: 'education-ethiopian-children',
      description: 'Support education initiatives to ensure every Ethiopian child has access to quality learning. We build schools, provide supplies, and train teachers in underserved communities.',
      shortDescription: 'Quality education for underprivileged Ethiopian children',
      content: 'Education is the foundation of progress. Our program focuses on building schools in remote areas, providing learning materials, and training local teachers. We also offer scholarships for bright students who cannot afford school fees.',
      goalAmount: 200000,
      currency: 'ETB',
      category: 'Education',
      tags: ['education', 'children', 'learning', 'schools', 'ethiopia'],
      location: 'Amhara Region, Ethiopia',
      beneficiaryCount: 1200,
      urgencyLevel: 'medium',
      status: 'ACTIVE',
      createdById: admin.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      contactEmail: 'education@kuraagalaan.org',
      contactPhone: '+251911234568',
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: admin.id
    },
    {
      title: 'Emergency Food Relief - Drought Response',
      slug: 'emergency-food-relief-drought',
      description: 'Provide emergency food assistance to families affected by drought in Ethiopia. Climate change has severely impacted agricultural communities, leaving many without adequate food supplies.',
      shortDescription: 'Emergency food aid for drought-affected Ethiopian families',
      content: 'Severe drought has affected millions of Ethiopians, particularly in pastoral and agricultural communities. Our emergency response provides nutritious food packages, clean water, and medical support to the most vulnerable families.',
      goalAmount: 300000,
      currency: 'ETB',
      category: 'Emergency Relief',
      tags: ['food', 'emergency', 'relief', 'drought', 'ethiopia'],
      location: 'Somali Region, Ethiopia',
      beneficiaryCount: 5000,
      urgencyLevel: 'critical',
      status: 'ACTIVE',
      createdById: admin.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      contactEmail: 'emergency@kuraagalaan.org',
      contactPhone: '+251911234569',
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: admin.id
    },
    {
      title: 'Healthcare Access for Remote Communities',
      slug: 'healthcare-access-remote-communities',
      description: 'Establish mobile health clinics and train community health workers to provide essential healthcare services to remote Ethiopian communities.',
      shortDescription: 'Mobile healthcare services for underserved areas',
      content: 'Many Ethiopian communities lack access to basic healthcare. Our mobile clinic program brings medical services directly to remote villages, while training local health workers to provide ongoing care.',
      goalAmount: 180000,
      currency: 'ETB',
      category: 'Healthcare',
      tags: ['healthcare', 'medical', 'community', 'mobile-clinic', 'ethiopia'],
      location: 'SNNP Region, Ethiopia',
      beneficiaryCount: 3000,
      urgencyLevel: 'high',
      status: 'ACTIVE',
      createdById: admin.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000), // 100 days from now
      contactEmail: 'health@kuraagalaan.org',
      contactPhone: '+251911234570',
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: admin.id
    }
  ];

  for (const campaignData of campaigns) {
    const campaign = await prisma.campaign.upsert({
      where: { slug: campaignData.slug },
      update: {},
      create: campaignData
    });
    console.log('✅ Campaign created:', campaign.title);

    // Add some sample donations for each campaign
    const sampleDonations = [
      {
        amount: 1000,
        currency: 'ETB',
        campaignId: campaign.id,
        paymentMethod: 'CHAPA',
        status: 'COMPLETED',
        donorName: 'Anonymous Donor',
        isAnonymous: true,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        amount: 2500,
        currency: 'ETB',
        campaignId: campaign.id,
        paymentMethod: 'TELEBIRR',
        status: 'COMPLETED',
        donorName: 'Meron Tadesse',
        donorEmail: 'meron@example.com',
        message: 'Keep up the great work!',
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        amount: 50,
        currency: 'USD',
        campaignId: campaign.id,
        paymentMethod: 'STRIPE',
        status: 'COMPLETED',
        donorName: 'John Smith',
        donorEmail: 'john@example.com',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    let totalRaised = 0;
    for (const donationData of sampleDonations) {
      await prisma.donation.create({
        data: donationData
      });
      
      // Convert to ETB for total calculation
      let amountInETB = donationData.amount;
      if (donationData.currency === 'USD') {
        amountInETB = donationData.amount * 55; // Approximate exchange rate
      }
      totalRaised += amountInETB;
    }

    // Update campaign current amount
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { currentAmount: totalRaised }
    });
  }

  // Create default settings
  const settings = [
    { key: 'site_name', value: 'Kuraa Galaan', category: 'general', description: 'Site name' },
    { key: 'site_description', value: 'Ethiopian charity platform making a difference', category: 'general', description: 'Site description' },
    { key: 'contact_email', value: 'info@kuraagalaan.org', category: 'contact', description: 'Main contact email' },
    { key: 'contact_phone', value: '+251911234567', category: 'contact', description: 'Main contact phone' },
    { key: 'default_currency', value: 'ETB', category: 'payments', description: 'Default currency' },
    { key: 'min_donation_amount_etb', value: '10', type: 'number', category: 'payments', description: 'Minimum donation in ETB' },
    { key: 'min_donation_amount_usd', value: '1', type: 'number', category: 'payments', description: 'Minimum donation in USD' },
    { key: 'max_donation_amount', value: '1000000', type: 'number', category: 'payments', description: 'Maximum donation amount' },
    { key: 'enable_anonymous_donations', value: 'true', type: 'boolean', category: 'donations', description: 'Allow anonymous donations' },
    { key: 'require_email_verification', value: 'true', type: 'boolean', category: 'users', description: 'Require email verification' },
    { key: 'enable_recurring_donations', value: 'true', type: 'boolean', category: 'donations', description: 'Enable recurring donations' },
    { key: 'organization_address', value: 'Addis Ababa, Ethiopia', category: 'organization', description: 'Organization address' },
    { key: 'tax_id', value: 'ET-123456789', category: 'organization', description: 'Tax identification number' },
    { key: 'bank_account', value: 'CBE-1234567890', category: 'organization', description: 'Bank account for direct transfers' }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    });
  }

  console.log('✅ Default settings created');

  // Create email templates
  const emailTemplates = [
    {
      name: 'donation_receipt',
      subject: 'Thank you for your donation to Kuraa Galaan',
      htmlBody: `
        <h2>Thank you for your generous donation!</h2>
        <p>Dear {{donorName}},</p>
        <p>We have received your donation of {{amount}} {{currency}} for the campaign "{{campaignTitle}}".</p>
        <p>Your donation reference: {{donationId}}</p>
        <p>Date: {{donationDate}}</p>
        <p>Your support makes a real difference in the lives of those we serve.</p>
        <p>Best regards,<br>The Kuraa Galaan Team</p>
      `,
      textBody: `
        Thank you for your generous donation!
        
        Dear {{donorName}},
        
        We have received your donation of {{amount}} {{currency}} for the campaign "{{campaignTitle}}".
        
        Your donation reference: {{donationId}}
        Date: {{donationDate}}
        
        Your support makes a real difference in the lives of those we serve.
        
        Best regards,
        The Kuraa Galaan Team
      `,
      variables: ['donorName', 'amount', 'currency', 'campaignTitle', 'donationId', 'donationDate']
    },
    {
      name: 'welcome_email',
      subject: 'Welcome to Kuraa Galaan',
      htmlBody: `
        <h2>Welcome to Kuraa Galaan!</h2>
        <p>Dear {{firstName}},</p>
        <p>Thank you for joining our community of changemakers.</p>
        <p>Together, we can make a lasting impact on Ethiopian communities.</p>
        <p>Explore our active campaigns and start making a difference today.</p>
        <p>Best regards,<br>The Kuraa Galaan Team</p>
      `,
      textBody: `
        Welcome to Kuraa Galaan!
        
        Dear {{firstName}},
        
        Thank you for joining our community of changemakers.
        Together, we can make a lasting impact on Ethiopian communities.
        
        Explore our active campaigns and start making a difference today.
        
        Best regards,
        The Kuraa Galaan Team
      `,
      variables: ['firstName']
    }
  ];

  for (const template of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template
    });
  }

  console.log('✅ Email templates created');

  console.log('🎉 Kuraa Galaan database seed completed successfully!');
  console.log(`📊 Created ${campaigns.length} campaigns with sample donations`);
  console.log(`⚙️ Configured ${settings.length} system settings`);
  console.log(`📧 Added ${emailTemplates.length} email templates`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });