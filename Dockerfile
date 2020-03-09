FROM registry.cn-shenzhen.aliyuncs.com/xiaoai/node-pm2:latest

WORKDIR /usr/src/app/
USER root
COPY ./ ./

RUN yarn

RUN npm run build

EXPOSE 5000
CMD pm2 start dist/index.js -o NULL -e NULL -i max --no-daemon
