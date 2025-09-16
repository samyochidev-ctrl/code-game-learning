// ข้อมูลของแต่ละระบบ (เพิ่มรายละเอียดใน content)
const sections = {
  user: {
    title: "ระบบผู้ใช้",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>สมัครสมาชิกด้วยอีเมลและรหัสผ่าน</li>
        <li>ล็อกอินด้วย JSON Web Token (JWT)</li>
        <li>ดูและแก้ไขโปรไฟล์ (ชื่อ, อวตาร, bio)</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>ระบบผู้ใช้เป็นจุดเริ่มต้นของการโต้ตอบกับแอป ผู้ใช้สมัครสมาชิกโดยกรอกอีเมลและรหัสผ่าน ซึ่งรหัสผ่านจะถูกเข้ารหัสด้วย bcrypt เพื่อความปลอดภัย การล็อกอินใช้ JWT token เพื่อยืนยันตัวตนในทุก request ที่ต้องการการยืนยัน ผู้ใช้สามารถแก้ไขข้อมูลส่วนตัว เช่น อวตารและ bio ผ่านหน้า UI ที่ออกแบบให้ใช้งานง่าย การจัดการผู้ใช้ทั้งหมดใช้ MongoDB เป็นฐานข้อมูล</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  avatar: { type: String, default: 'default-avatar.png' },
  bio: { type: String, default: '' },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
        </code></pre>
      </div>
    `
  },
  character: {
    title: "ระบบตัวละคร",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>สร้างตัวละคร (ชื่อ, Class, อาชีพ, ค่าสเตตัส)</li>
        <li>แสดงข้อมูลตัวละคร (ระดับ, สเตตัส, อาวุธ)</li>
        <li>อัพเกรดสเตตัสเมื่อเลเวลอัพ</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>ผู้ใช้ที่ล็อกอินแล้วสามารถสร้างตัวละครโดยเลือก Class เช่น Warrior, Mage, หรือ Archer และกำหนดอาชีพ เช่น Blacksmith หรือ Alchemist ค่าสเตตัสเริ่มต้น (เช่น strength, agility) ขึ้นกับ Class ที่เลือก เมื่อตัวละครได้รับ experience จากเควสหรือการต่อสู้ ระดับจะเพิ่มขึ้นและสามารถอัพเกรดสเตตัสได้ ระบบนี้ใช้ MongoDB เพื่อเก็บข้อมูลตัวละครและเชื่อมโยงกับผู้ใช้</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/models/Character.js
const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  class: { type: String, enum: ['Warrior', 'Mage', 'Archer'], required: true },
  profession: { type: String, enum: ['Blacksmith', 'Alchemist', 'Hunter'], default: 'None' },
  level: { type: Number, default: 1 },
  stats: {
    strength: { type: Number, default: 10 },
    agility: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    health: { type: Number, default: 100 },
    mana: { type: Number, default: 50 },
  },
  experience: { type: Number, default: 0 },
});

module.exports = mongoose.model('Character', characterSchema);
        </code></pre>
      </div>
    `
  },
  chat: {
    title: "ระบบแชท",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>แชทเรียลไทม์ในห้องต่างๆ</li>
        <li>คำสั่งพิเศษ เช่น /attack, /roll</li>
        <li>UI คล้าย Discord</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>ระบบแชทใช้ Socket.IO เพื่อให้ผู้เล่นสามารถส่งข้อความแบบเรียลไทม์ในห้องแชทต่างๆ คำสั่งพิเศษ เช่น /roll สุ่มตัวเลข 1-100 และ /attack จำลองการโจมตี โดยผลลัพธ์จะถูกส่งไปยังผู้เล่นในห้องเดียวกัน UI ออกแบบให้มี sidebar สำหรับเลือกห้องและหน้าต่างแชทที่แสดงข้อความแบบเลื่อนได้</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/sockets/chat.js
const setupChat = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ room, userId }) => {
      socket.join(room);
      io.to(room).emit('message', { user: 'System', text: \`\${userId} joined \${room}\` });
    });

    socket.on('sendMessage', ({ room, message, user }) => {
      if (message.startsWith('/')) {
        handleCommand(io, socket, room, message, user);
      } else {
        io.to(room).emit('message', { user, text: message });
      }
    });
  });
};
        </code></pre>
      </div>
    `
  },
  inventory: {
    title: "ระบบอาวุธ/ไอเท็ม",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>ช่องเก็บของ (inventory)</li>
        <li>ใช้ไอเท็ม (เช่น potion เพิ่ม HP)</li>
        <li>ตีบวกอาวุธ (เพิ่มพลัง, มีโอกาสล้มเหลว)</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>ระบบนี้จัดการช่องเก็บของของตัวละคร ผู้เล่นสามารถดูและใช้ไอเท็ม เช่น potion ที่เพิ่ม HP หรือ mana การตีบวกอาวุธเพิ่มค่าสเตตัส เช่น attack แต่มีโอกาสล้มเหลวโดยโอกาสสำเร็จลดลงเมื่อเลเวลตีบวกสูงขึ้น ระบบใช้ MongoDB เพื่อเก็บข้อมูลไอเท็มและเชื่อมโยงกับตัวละคร</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['weapon', 'armor', 'potion'], required: true },
  stats: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
  },
  enhancementLevel: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
});

module.exports = mongoose.model('Item', itemSchema);
        </code></pre>
      </div>
    `
  },
  market: {
    title: "ระบบตลาด",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>ซื้อ/ขายไอเท็มในตลาดกลาง</li>
        <li>ภาษี 5% สำหรับการขาย</li>
        <li>แสดงรายการไอเท็มที่วางขาย</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>ผู้เล่นสามารถวางขายไอเท็มในตลาดโดยกำหนดราคา เมื่อมีการซื้อ ระบบจะหัก gold จากผู้ซื้อและจ่ายให้ผู้ขายหลังหักภาษี 5% รายการไอเท็มในตลาดอัพเดตแบบเรียลไทม์ผ่าน API และ MongoDB เก็บข้อมูลการซื้อขาย</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/routes/market.js
router.post('/buy/:marketId', async (req, res) => {
  const marketItem = await Market.findById(req.params.marketId).populate('itemId');
  const tax = marketItem.price * 0.05;
  buyer.gold -= marketItem.price;
  seller.gold += marketItem.price - tax;
  await Item.updateOne({ _id: marketItem.itemId }, { owner: buyer._id });
});
        </code></pre>
      </div>
    `
  },
  quest: {
    title: "ระบบเควส",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>เควสหลัก, เควสรอง, เควสกลุ่ม</li>
        <li>รางวัล (gold, experience, ไอเท็ม)</li>
        <li>สถานะเควส (เริ่ม, ดำเนินการ, สำเร็จ)</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>ระบบเควสให้ผู้เล่นรับภารกิจ เช่น ฆ่ามอนสเตอร์หรือรวบรวมไอเท็ม เมื่อสำเร็จจะได้รับรางวัล เช่น gold หรือ experience เควสกลุ่มอนุญาตให้ผู้เล่นหลายคนทำงานร่วมกันผ่าน Socket.IO สถานะเควสถูกบันทึกใน MongoDB</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/models/Quest.js
const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['main', 'side', 'group'], required: true },
  rewards: {
    gold: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  },
  status: { type: String, enum: ['available', 'in-progress', 'completed'], default: 'available' },
});

module.exports = mongoose.model('Quest', questSchema);
        </code></pre>
      </div>
    `
  },
  pk: {
    title: "ระบบ PK",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>ท้าสู้แบบ 1v1</li>
        <li>ระบบ ranking ตามคะแนน</li>
        <li>การต่อสู้ใช้ค่าสเตตัสและอาวุธ</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>ผู้เล่นสามารถท้าสู้กันแบบ 1v1 โดยระบบคำนวณผลจากค่าสเตตัส (เช่น attack) และสุ่มความเสียหาย ผู้ชนะจะได้รับ rank points ซึ่งบันทึกใน MongoDB และใช้จัดอันดับ</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/routes/pk.js
router.post('/resolve/:pkId', async (req, res) => {
  const pk = await PK.findById(req.params.pkId);
  const player1 = await Character.findById(pk.player1);
  const player2 = await Character.findById(pk.player2);
  const damage1 = player1.stats.attack * Math.random();
  const damage2 = player2.stats.attack * Math.random();
  pk.winner = damage1 > damage2 ? player1._id : player2._id;
});
        </code></pre>
      </div>
    `
  },
  event: {
    title: "ระบบ Event",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>Event รายวัน/รายสัปดาห์</li>
        <li>รางวัลสำหรับผู้เข้าร่วม</li>
        <li>แจ้งเตือนผ่านแชท</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>Event มีกำหนดเวลาเริ่มและสิ้นสุด เช่น ฆ่ามอนสเตอร์ 100 ตัว ผู้เล่นเข้าร่วมและรับรางวัลเมื่อสำเร็จ การแจ้งเตือน event ส่งผ่าน Socket.IO ไปยังห้องแชท ใช้ MongoDB เพื่อเก็บข้อมูล event และผู้เข้าร่วม</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly'], required: true },
  rewards: {
    gold: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model('Event', eventSchema);
        </code></pre>
      </div>
    `
  },
  admin: {
    title: "ระบบจัดการหลังบ้าน",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>จัดการผู้ใช้ (แบน, แก้ไขโปรไฟล์)</li>
        <li>จัดการไอเท็ม, เควส, event</li>
        <li>ดูสถิติ (จำนวนผู้เล่น, การซื้อขาย)</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>Admin panel เข้าถึงได้เฉพาะผู้ใช้ที่มี role เป็น admin ผ่านการตรวจสอบด้วย middleware สามารถแบนผู้ใช้, เพิ่ม/แก้ไขเควสหรือ event และดูสถิติ เช่น จำนวนผู้เล่นออนไลน์ ใช้ MongoDB เพื่อเก็บข้อมูลและ Express.js สำหรับ API</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/middleware/admin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
        </code></pre>
      </div>
    `
  },
  database: {
    title: "ระบบฐานข้อมูล",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>ใช้ MongoDB สำหรับข้อมูลยืดหยุ่น</li>
        <li>เก็บข้อมูลผู้ใช้, ตัวละคร, ไอเท็ม, เควส, event</li>
        <li>รองรับการ scale แบบ horizontal</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>MongoDB เหมาะกับข้อมูลที่ยืดหยุ่น เช่น ไอเท็มและตัวละคร ใช้ Mongoose เป็น ODM เพื่อจัดการ schema และ query แนะนำ MongoDB Atlas สำหรับ production เพื่อความง่ายในการจัดการและ scaling</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
        </code></pre>
      </div>
    `
  },
  ui: {
    title: "UI Design",
    content: `
      <p><strong>ฟังก์ชันหลัก:</strong></p>
      <ul>
        <li>Dark Theme คล้าย Discord</li>
        <li>Responsive design</li>
        <li>Sidebar และ layout สบายตา</li>
      </ul>
      <p><strong>หลักการทำงาน:</strong></p>
      <p>UI ใช้ Tailwind CSS เพื่อสร้าง Dark Theme ในโทนสีมืด (เทาเข้ม, น้ำเงิน) การออกแบบ responsive รองรับทุกอุปกรณ์ โดยใช้ utility classes เช่น flex และ grid Sidebar ช่วยให้ผู้ใช้เลือกหมวดหมู่ได้ง่าย และ layout ออกแบบให้สบายตา</p>
      <p><strong>โค้ดตัวอย่าง:</strong></p>
      <div class="code-container">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
// client/tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'discord-dark': '#2f3136',
        'discord-darker': '#202225',
        'discord-text': '#dcddde',
      },
    },
  },
};
        </code></pre>
      </div>
    `
  }
};

// การจัดการการเลือกหมวดหมู่
document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.menu-item');
  const sectionTitle = document.getElementById('section-title');
  const sectionContent = document.getElementById('section-content');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active class from all items
      menuItems.forEach(i => i.classList.remove('active'));
      // Add active class to clicked item
      item.classList.add('active');

      // Update content
      const section = item.getAttribute('data-section');
      sectionTitle.textContent = sections[section].title;
      sectionContent.innerHTML = sections[section].content;
    });
  });
});

// ฟังก์ชัน Copy Code
function copyCode(button) {
  const code = button.nextElementSibling.querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}