# Blue Battery API 서버 - 초기화 스크립트

const mongoose = require('mongoose');
const Battery = require('./models/Battery');
require('dotenv').config();

const seedBatteries = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // 기존 데이터 삭제
    await Battery.deleteMany({});
    console.log('🗑️ 기존 배터리 데이터 삭제');

    // 새 데이터 추가
    const batteries = [
      {
        name: '삼성 배터리 Pro',
        model: 'SA-100',
        description: '고성능 자동차 배터리',
        price: 250000,
        specifications: {
          capacity: '90Ah',
          voltage: '12V',
          warranty: '5년'
        },
        stock: 50,
        category: 'premium'
      },
      {
        name: 'LG 배터리',
        model: 'LG-200',
        description: 'LG의 신뢰할 수 있는 배터리',
        price: 280000,
        specifications: {
          capacity: '100Ah',
          voltage: '12V',
          warranty: '5년'
        },
        stock: 45,
        category: 'premium'
      },
      {
        name: '일반형 배터리',
        model: 'STD-50',
        description: '기본 사양의 자동차 배터리',
        price: 150000,
        specifications: {
          capacity: '60Ah',
          voltage: '12V',
          warranty: '3년'
        },
        stock: 100,
        category: 'standard'
      },
      {
        name: '프로페셔널 배터리',
        model: 'PRO-300',
        description: '상용차용 고성능 배터리',
        price: 350000,
        specifications: {
          capacity: '120Ah',
          voltage: '12V',
          warranty: '7년'
        },
        stock: 30,
        category: 'professional'
      }
    ];

    const savedBatteries = await Battery.insertMany(batteries);
    console.log(`✅ ${savedBatteries.length}개의 배터리 데이터 추가`);

    console.log('\n추가된 배터리:');
    savedBatteries.forEach(battery => {
      console.log(`- ${battery.name} (${battery.model}): ₩${battery.price.toLocaleString()}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ 초기화 완료!');
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
};

seedBatteries();
