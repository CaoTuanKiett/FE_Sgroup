const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.resolve("./danh-sach.txt");

function getUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Nhập thông tin \n Họ tên: ', (fullName) => {
      rl.question('Tuổi: ', (age) => {
        rl.question('Chuyên môn: ', (expertise) => {
          rl.close();

          resolve({
            fullName: fullName.trim(),
            age: age.trim(),
            expertise: expertise.trim()
          });
        });
      });
    });
  });
}

async function updateDanhSach() {
  const danhSach = fs.existsSync(filePath) ? fs.readFileSync(filePath, { encoding: 'utf8' }).split('\n') : [];

  let continueInput = true;

  while (continueInput) {
    const userInput = await getUserInput();

    if (!userInput.fullName || !userInput.age || !userInput.expertise) {
      console.log('Dữ liệu nhập không hợp lệ. Vui lòng cung cấp đầy đủ thông tin.');
      continue;
    }

    const newData = `${userInput.fullName}, ${userInput.age}, ${userInput.expertise}`;
    danhSach.push(newData);

    const response = await new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Bạn có muốn tiếp tục? (yes/no): ', (answer) => {
        rl.close();
        continueInput = ['yes', 'y'].includes(answer.trim().toLowerCase());
        resolve(answer.trim().toLowerCase());
      });
    });
  }

  fs.writeFileSync(filePath, danhSach.join('\n'), { encoding: 'utf8' });

  console.log('Danh sách đã cập nhật:', danhSach);

  await searchUser(danhSach);

}


async function searchUser(danhSach) {
  let continueSearch = true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Bạn muốn tìm gì: ', (searchTerm) => {
    const results = danhSach.filter((user) => {
      return user.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (results.length > 0) {
      console.log('Kết quả tìm kiếm:', results);
    } else {
      console.log('Không tìm thấy kết quả nào.');
    }

    rl.question('Bạn có muốn tiếp tục? (yes/no): ', (answer) => {
      rl.close();
      continueSearch = answer.trim().toLowerCase() === 'yes' || answer.trim().toLowerCase() === 'y';

      if (continueSearch) {
        searchUser(danhSach);
      } else {
        console.log('Kết thúc tìm kiếm.');
        
        console.log('Danh sách', danhSach);
      }
    });
  });
}

updateDanhSach();
