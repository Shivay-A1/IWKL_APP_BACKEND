import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addNewsArticles() {
  try {
    // Delete all existing news
    await prisma.newsImage.deleteMany({})
    await prisma.news.deleteMany({})
    console.log('Deleted all existing news')

    // News Article 1
    const news1 = await prisma.news.create({
      data: {
        title: 'IWKL Press Conference | Big Announcement Coming Soon',
        slug: 'iwkl-press-conference-big-announcement-coming-soon',
        excerpt: "The Indian Women's Kabaddi League (IWKL) is set to unveil a historic announcement through its official press conference. Stay tuned as India prepares to witness a new era of women's kabaddi.",
        content: 'IWKL Press Conference | Big Announcement Coming Soon. The Indian Women\'s Kabaddi League (IWKL) is set to unveil a historic announcement through its official press conference. Stay tuned as India prepares to witness a new era of women\'s kabaddi.',
        category: 'Press Conference',
        isFeatured: true,
        isPublished: true,
        featuredImage: '/press-conference-1.png',
        tags: ['Press Conference', 'Announcement'],
        publishedAt: new Date(),
        images: {
          create: []
        }
      }
    })
    console.log('News 1 created:', news1.id)

    // News Article 2
    const news2 = await prisma.news.create({
      data: {
        title: 'Big Announcement Coming Soon: Indian Women\'s Kabaddi League (IWKL) Set to Unveil a New Era',
        slug: 'big-announcement-coming-soon-iwkl-new-era',
        excerpt: 'India is About to Witness a New Era of Women\'s Kabaddi',
        content: 'The Indian Women\'s Kabaddi League (IWKL) is gearing up to make history with an official Press Conference & Major Announcement that will redefine the future of women\'s kabaddi in India. With a vision to provide India\'s women kabaddi players a truly professional platform, IWKL is committed to creating new opportunities, inspiring the next generation of athletes, and taking the sport to a national and global audience.',
        category: 'Press Conference',
        isFeatured: true,
        isPublished: true,
        featuredImage: '/press-conference-2.jpg',
        tags: ['Press Conference', 'Announcement', 'New Era'],
        publishedAt: new Date(),
        images: {
          create: []
        }
      }
    })
    console.log('News 2 created:', news2.id)

    // News Article 3
    const news3 = await prisma.news.create({
      data: {
        title: 'IWKL Trials Update: Registered Players के लिए महत्वपूर्ण सूचना',
        slug: 'iwkl-trials-update-registered-players-important-information',
        excerpt: 'IWKL (Indian Women\'s Kabaddi League) को देशभर से मिल रहे शानदार रजिस्ट्रेशन और खिलाड़ियों के उत्साह के लिए हम सभी का हार्दिक धन्यवाद करते हैं।',
        content: `IWKL Trials Update: Registered Players के लिए महत्वपूर्ण सूचना

IWKL (Indian Women's Kabaddi League) को देशभर से मिल रहे शानदार रजिस्ट्रेशन और खिलाड़ियों के उत्साह के लिए हम सभी का हार्दिक धन्यवाद करते हैं।

सभी पंजीकृत खिलाड़ियों को सूचित किया जाता है कि Trials की Date, Venue और Reporting Time की जानकारी Registration के समय दिए गए Mobile Number पर भेजी जाएगी। साथ ही, यही जानकारी आपके IWKL Website पर उपलब्ध Application Tracking सेक्शन में भी दिखाई देगी।

महत्वपूर्ण सूचना:

📍 Trial Venue की जानकारी आपके Registered Mobile Number तथा Application Tracking में उपलब्ध होगी।

📅 Trial Date एवं Reporting Time भी उसी नंबर पर भेजा जाएगा और वेबसाइट पर भी अपडेट रहेगा।

📱 कृपया अपना Registered Mobile Number सक्रिय रखें, ताकि कोई भी महत्वपूर्ण सूचना आपसे न छूटे।

🌐 Application Tracking में लॉगिन करके आप:

✅ अपनी Application Status देख सकते हैं।
📍 Trial Venue एवं Reporting Details देख सकते हैं।
📄 अपनी Registration Details देख सकते हैं।
💬 किसी भी समस्या या प्रश्न के लिए Admin से Direct Chat कर सकते हैं और सहायता प्राप्त कर सकते हैं।

🪪 Trials के दिन अपना Valid ID Proof एवं आवश्यक दस्तावेज़ साथ लेकर अवश्य आएँ।

IWKL (Indian Women's Kabaddi League) का उद्देश्य देशभर की प्रतिभाशाली महिला कबड्डी खिलाड़ियों को एक Professional, Transparent और World-Class Platform प्रदान करना है, जहाँ वे अपनी प्रतिभा का प्रदर्शन कर सकें।

अपने Registered Mobile Number तथा IWKL Website के Application Tracking सेक्शन पर आने वाले Official Updates का नियमित रूप से अवलोकन करते रहें। Trials से संबंधित सभी जानकारी समय-समय पर वहीं उपलब्ध कराई जाएगी।

— Team IWKL (Indian Women's Kabaddi League)`,
        category: 'Trials Update',
        isFeatured: true,
        isPublished: true,
        featuredImage: '/press-conference-3.png',
        tags: ['Trials', 'Update', 'Hindi'],
        publishedAt: new Date(),
        images: {
          create: []
        }
      }
    })
    console.log('News 3 created:', news3.id)

    console.log('All news articles added successfully!')
  } catch (error) {
    console.error('Error adding news:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addNewsArticles()
