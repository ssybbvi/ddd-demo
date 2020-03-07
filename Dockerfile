FROM registry.cn-beijing.aliyuncs.com/honghegame/node-pm2:latest

# copy files
ADD dist /app
ADD node_modules /app/node_modules
ADD package.json /app/
ADD package-lock.json /app/


# npm prune
WORKDIR /app


EXPOSE 5000
CMD pm2 start index.js -o NULL -e NULL -i max --no-daemon
