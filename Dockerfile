# Използваме официален Node образ
FROM node:20

# Задаваме работна директория
WORKDIR /app

# Копираме package.json и package-lock.json
COPY package*.json ./

# Инсталираме зависимостите
RUN npm install

# Копираме останалия код
COPY . .

# Излагаме порта
EXPOSE 3000

# Стартираме приложението
CMD ["npm", "start"]
