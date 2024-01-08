import * as fs from 'fs';
import * as path from 'path';
import * as readlineSync from 'readline-sync';

class User {
  fullName: string;
  age: number;
  expertise: string;

  constructor(fullName: string, age: number, expertise: string) {
    this.fullName = fullName;
    this.age = age;
    this.expertise = expertise;
  }
}

class UserManagement {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = path.resolve(filePath);
  }

  private getUserInput(): User {
    const fullName = readlineSync.question('Nhập thông tin\nHọ tên: ');
    const age = parseInt(readlineSync.question('Tuổi: '), 10);

    if (isNaN(age)) {
      console.log('Tuổi không hợp lệ. Vui lòng nhập lại.');
      return this.getUserInput();
    }

    const expertise = readlineSync.question('Chuyên môn: ');

    return new User(fullName.trim(), age, expertise.trim());
  }

  private updateDanhSach(danhSach: User[]): void {
    let continueInput = true;

    while (continueInput) {
      const userInput = this.getUserInput();

      if (!userInput.fullName || !userInput.age || !userInput.expertise) {
        console.log('Dữ liệu nhập không hợp lệ. Vui lòng cung cấp đầy đủ thông tin.');
        continue;
      }

      const newData = `${userInput.fullName}, ${userInput.age}, ${userInput.expertise}`;
      danhSach.push(userInput);

      const answer = readlineSync.question('Bạn có muốn tiếp tục? (yes/no): ').trim().toLowerCase();
      continueInput = ['yes', 'y'].includes(answer);
    }

    fs.writeFileSync(this.filePath, danhSach.map(user => `${user.fullName}, ${user.age}, ${user.expertise}`).join('\n'), { encoding: 'utf8' });

    console.log('Danh sách đã cập nhật:', danhSach);
  }

  private searchUser(danhSach: User[]): void {
    const searchTerm = readlineSync.question('Bạn muốn tìm gì: ');

    const results = danhSach.filter((user) => {
      return user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (results.length > 0) {
      console.log('Kết quả tìm kiếm:', results);
    } else {
      console.log('Không tìm thấy kết quả nào.');
    }
  }

  public displayMenu(): void {
    let danhSach: User[] = [];
    if (fs.existsSync(this.filePath)) {
      danhSach = fs.readFileSync(this.filePath, { encoding: 'utf8' })
        .split('\n')
        .map(line => {
          const [fullName, age, expertise] = line.split(',').map(item => item.trim());
          return new User(fullName, parseInt(age, 10), expertise);
        });
    } else {
      console.log('Không tìm thấy file danh-sach.txt. Tạo mới file.');
    }

    let choice: string;
    do {
      console.log('\n----- MENU -----');
      console.log('1. Hiển thị danh sách');
      console.log('2. Thêm người dùng');
      console.log('3. Tìm kiếm');
      console.log('4. Thoát');

      choice = readlineSync.question('Chọn một tùy chọn (1-4): ').trim();

      switch (choice) {
        case '1':
          console.log('Danh sách người dùng:');
          console.log(danhSach);
          break;
        case '2':
          console.log('Thêm người dùng:');
          this.updateDanhSach(danhSach);
          break;
        case '3':
          console.log('Tìm kiếm người dùng:');
          this.searchUser(danhSach);
          break;
        case '4':
          console.log('Kết thúc chương trình.');
          break;
        default:
          console.log('Tùy chọn không hợp lệ. Vui lòng chọn lại.');
      }
    } while (choice !== '4');
  }
}

// Start the program
const userManagement = new UserManagement("./danh-sach.txt");
userManagement.displayMenu();
