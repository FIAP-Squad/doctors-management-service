FROM node:18
WORKDIR /usr/src/doctors-management-service
COPY doctors-management-service/package*.json ./
RUN npm i
COPY doctors-management-service/ .
RUN npm run build
RUN npx prisma generate
ENV MYSQL_URL=mysql://root:root@db:3306/db
RUN chmod +x ./start.sh
CMD ["./start.sh"]