FROM node:18
WORKDIR /usr/src/auth-service
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
RUN npx prisma generate
ENV MYSQL_URL=mysql://root:a95c530a7af5f492a74499e70578d150@fiap-rds-api-db.cbysyukigxo3.us-east-1.rds.amazonaws.com:3306/db
RUN chmod +x ./start.sh
CMD ["./start.sh"]
EXPOSE 5050