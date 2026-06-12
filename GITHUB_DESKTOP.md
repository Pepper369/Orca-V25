# 📱 Hướng dẫn Commit với GitHub Desktop

## Lần đầu tiên

### 1. Clone repository

1. Mở GitHub Desktop
2. File → Clone repository
3. Chọn tab "URL"
4. Dán: `https://github.com/YOUR_USERNAME/orca-financial-dashboard.git`
5. Chọn thư mục local
6. Click "Clone"

### 2. Commit code lên GitHub

1. GitHub Desktop sẽ tự động detect changes
2. Viết commit message ở góc trái dưới:
   ```
   Initial commit: ORCA FINANCIAL dashboard
   ```
3. Click "Commit to main"
4. Click "Push origin" để đẩy lên GitHub

## Các lần sau

### Commit nhanh

1. GitHub Desktop tự động detect changes
2. Viết commit message:
   ```
   Update: thêm tính năng X / sửa lỗi Y
   ```
3. Click "Commit to main"
4. Click "Push origin"

### Commit nhiều file cùng lúc

1. GitHub Desktop sẽ list tất cả files thay đổi
2. Bạn có thể:
   - ✅ Check tất cả (mặc định)
   - ☐ Bỏ check file không muốn commit
3. Viết commit message
4. Commit + Push

## Xử lý lỗi LF/CRLF

Nếu gặp lỗi:
```
This diff contains a change in line endings from 'LF' to 'CRLF'
```

### Cách 1: Dùng Terminal

```bash
git config core.autocrlf false
git add --renormalize .
git commit -m "normalize line endings"
git push
```

### Cách 2: GitHub Desktop

1. Repository → Repository Settings
2. Git tab
3. Uncheck "Automatically convert line endings"
4. Commit lại

## Commit message conventions

### Format

```
<type>: <description>

[optional body]
```

### Types

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Chỉ thay đổi documentation
- `style`: Format code (spacing, etc)
- `refactor`: Refactor code
- `test`: Thêm test
- `chore`: Update dependencies, etc

### Examples

```
feat: thêm export PDF/PNG

fix: sửa lỗi search không hoạt động

docs: cập nhật README

refactor: tối ưu dashboard store

chore: update dependencies
```

## Branch workflow (optional)

### Tạo branch mới

1. Current Branch → New Branch
2. Đặt tên: `feature/my-feature` hoặc `fix/my-fix`
3. Commit changes trên branch
4. Push branch lên GitHub
5. Tạo Pull Request trên GitHub

### Merge vào main

1. Tạo PR trên GitHub
2. Review code
3. Merge PR
4. Pull changes về local

## Tips

### Undo commit (chưa push)

1. History tab
2. Right-click commit
3. "Revert this commit"

### Xem changes trước khi commit

1. Click vào file trong Changes list
2. Xem diff bên phải

### Sync với remote

1. Click "Fetch origin" để kiểm tra updates
2. Click "Pull origin" để lấy changes mới
3. Commit + Push changes của bạn

## Troubleshooting

### Lỗi: "You have divergent branches"

```bash
git pull --rebase origin main
```

### Lỗi: "Permission denied"

- Kiểm tra lại GitHub credentials
- Hoặc dùng SSH key

### Lỗi: "Failed to push some refs"

```bash
git pull origin main
# Resolve conflicts nếu có
git push
```

---

**Happy coding! 🚀**
