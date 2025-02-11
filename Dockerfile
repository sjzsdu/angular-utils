# 使用 Node.js 20 作为基础镜像
FROM node:20 as build

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml（如果存在）
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建应用
RUN pnpm run build:all

# 使用 Nginx 作为 Web 服务器
FROM nginx:alpine

# 复制构建产物到 Nginx 服务目录
COPY --from=build /app/dist/event-trader/browser /usr/share/nginx/html

# 复制自定义 Nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露新的端口（例如 8080）
EXPOSE 8080

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
