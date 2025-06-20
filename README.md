# ProjectOS

Изграждане и стартиране на контейнерите


  Стъпки:

Клонирай проекта или го копирай в папка, напр. projectos/.

Създай конфигурационните файлове:

-Dockerfile

-docker-compose.yml

Стартирай контейнерите: docker-compose up --build



Структура


projectos/

├── server.js

├── package.json

├── views/

│   ├── signup.ejs

│   ├── login.ejs

│   ├── menu.ejs

└──  └── orders.ejs




Как работи всеки компонент


app (Node.js сървър)

Изграден от Dockerfile

Стартира Express сървър на порт 3000

Използва EJS шаблони за HTML страници:

/signup — регистрация на клиент

/login — вход за клиент

/menu — показва наличните ястия

/orders — клиентът вижда и прави поръчки

Чете променливата MONGO_URI за свързване към MongoDB


mongo (MongoDB сървър)

Използва официалния mongo образ

Стартира база данни RestaurantDB

Данните се пазят във Volume mongo_data — те се запазват дори при рестартиране на контейнера.



Комуникация между услугите


-Мрежа: Docker Compose автоматично създава обща вътрешна мрежа.

Приложение → База:

app се свързва към mongo по вътрешното име на услугата: MONGO_URI = mongodb://mongo:27017/RestaurantDB

Така не се използва localhost, а името на услугата mongo, което Docker DNS резолвира автоматично.

-Външен достъп:

app е достъпен на localhost:3000

mongo може да бъде достъпен и от хост машината на порт 27017.
