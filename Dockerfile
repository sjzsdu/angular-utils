# 阶段一：构建前端应用
FROM node:20 AS build

# 安装 pnpm 包管理器
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装依赖
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# 复制项目文件并构建应用
COPY . .
RUN pnpm run build:all

# 阶段二：生产环境使用 Nginx 提供静态文件
FROM nginx:alpine

# 删除默认的 Nginx 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 复制构建产物到 Nginx 的默认服务目录
COPY --from=build /app/dist/event-trader/browser /usr/share/nginx/html

# 如果需要自定义 Nginx 配置，可以取消以下注释并提供 `nginx.conf`
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 8081

# 启动 Nginx，以守护进程模式关闭
CMD ["nginx", "-g", "daemon off;"]
