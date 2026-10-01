const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Tour = require('./models/Tour');
const Content = require('./models/Content');
const Product = require('./models/Product');
const User = require('./models/User');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sontung_mtp_world';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear old data
    await Tour.deleteMany();
    await Content.deleteMany();
    await Product.deleteMany();
    console.log('[Seed] Cleared old collections.');

    // Seed Tours
    await Tour.insertMany([
      {
        title: 'SKY TOUR 2026 - THE RESURRECTION',
        tourName: 'M-TP World Tour 2026',
        city: 'Hà Nội',
        venue: 'Sân vận động Quốc gia Mỹ Đình',
        date: new Date('2026-11-15T19:30:00.000Z'),
        time: '19:30',
        ticketStatus: 'available',
        priceRange: '800.000đ - 3.800.000đ'
      },
      {
        title: 'SKY TOUR 2026 - ELECTRIC NIGHT',
        tourName: 'M-TP World Tour 2026',
        city: 'TP. Hồ Chí Minh',
        venue: 'Sân vận động Quân khu 7',
        date: new Date('2026-11-28T19:30:00.000Z'),
        time: '19:30',
        ticketStatus: 'available',
        priceRange: '850.000đ - 4.500.000đ'
      },
      {
        title: 'SKY TOUR 2026 - OCEAN BREEZE',
        tourName: 'M-TP World Tour 2026',
        city: 'Đà Nẵng',
        venue: 'Cung Thể thao Tiên Sơn',
        date: new Date('2026-12-12T19:30:00.000Z'),
        time: '20:00',
        ticketStatus: 'sold_out',
        priceRange: '650.000đ - 3.200.000đ'
      }
    ]);

    // Seed Contents
    await Content.insertMany([
      {
        title: 'ĐỪNG LÀM TRÁI TIM ANH ĐAU',
        type: 'mv',
        releaseDate: new Date('2024-06-08'),
        thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        mediaUrl: 'https://www.youtube.com/watch?v=abPmFUZQ28M',
        duration: '05:32',
        views: '110M+ views',
        isFeatured: true
      },
      {
        title: 'CHÚNG TA CỦA TƯƠNG LAI',
        type: 'mv',
        releaseDate: new Date('2024-03-08'),
        thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        mediaUrl: 'https://www.youtube.com/watch?v=psZ1g9fMfeo',
        duration: '04:45',
        views: '85M+ views',
        isFeatured: true
      },
      {
        title: 'HÃY TRAO CHO ANH (feat. Snoop Dogg)',
        type: 'mv',
        releaseDate: new Date('2019-07-01'),
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
        mediaUrl: 'https://www.youtube.com/watch?v=knW7-x7Y7RE',
        duration: '04:22',
        views: '290M+ views',
        isFeatured: true
      }
    ]);

    // Seed Products
    await Product.insertMany([
      {
        name: 'Official SKY Lightstick Ver. 2 (Bluetooth Sync)',
        category: 'lightstick',
        price: 650000,
        originalPrice: 750000,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        isBestSeller: true
      },
      {
        name: 'Hoodie "Chúng Ta Của Tương Lai" - Midnight Black',
        category: 'apparel',
        price: 890000,
        originalPrice: 1100000,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
        isBestSeller: true
      },
      {
        name: 'Album "Chúng Ta" Special Boxset + 100p Photobook',
        category: 'album',
        price: 790000,
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
        isBestSeller: true
      }
    ]);

    console.log('✅ [Seed] Dữ liệu mẫu khởi tạo thành công!');
    process.exit(0);
  } catch (err) {
    console.error('❌ [Seed Error]:', err.message);
    process.exit(1);
  }
};

seedData();
