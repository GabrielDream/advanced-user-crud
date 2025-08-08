Advanced User CRUD with Custom Validation and Automated Testing
+ This project was built to showcase strong backend skills using:

    Clean code and modular structure;

    Manual, rule-driven validation (Joi intentionally not used);

    Custom error handling using AppError and specialized middlewares;

    Full test coverage using Jest + Supertest;

    Solid tech stack: Node.js + Express + MongoDB (Mongoose).

    📦 Technologies and Tools Used
        Node.js

        Express

        MongoDB + Mongoose

        Custom Middlewares:

        res.success

        AppError class

        Global errorHandler

        Advanced manual validations (Joi was intentionally not used)

        Jest + Supertest

        dotenv

        chalk (for styled logging)

        sanitizeUserInput (security utility)

        Postman (for manual tests and informal docs)

        Linter

        📂 API Routes (base path: /api)
        Method	Route	Description
        GET	/checkEmail/:email	Check if email is already in use
        POST	/add	Register a new user with validation
        GET	/checkUsers	List all users
        DELETE	/deleteUser/:id	Delete user by ID
        PUT	/updateUser/:id	Update user fields

        🧪 Automated Testing
        All routes tested with Jest + Supertest

        Full coverage of success + error scenarios:

        Malformed ID

        Invalid inputs

        Duplicate emails

        No data change

        Weak passwords

        Each test expects specific messages, enforcing precise control.

        ❗ Why Manual Validation Instead of Joi?
        This project intentionally avoids Joi to demonstrate:

        Total control over logic, flow, and messaging

        Seamless integration with custom error structures (AppError)

        Scenarios where external libraries are restricted (fintech, military, medical)

        Mastery of backend logic and defensive programming

        “I know how to use Joi, but in this project I chose manual validation to guarantee full control over business rules and error flow.”

    ▶️ How to Run This Project
    bash
    Copiar
    Editar
    # 1. Clone the repo
    git clone https://github.com/your-user/your-repo.git

    # 2. Install dependencies
    npm install

    # 3. Configure environment variables
    MONGO_URL=mongodb://localhost:27017/neurocoding

    # 4. Start the server
    npm start
    Server: http://localhost:3050/api

    🧠 Final Notes
    This project represents a clean and professional backend focused on logic, testing, and security.

    “Validation isn’t just about accepting or rejecting input.
    It’s about guiding, securing, and predicting behavior.”

    Explore the source code to understand the architecture:
    AppError, res.success, spyConsole, logging animations, and more.

    Pull requests, forks and feedback are welcome. OSSS 💻🔥

+ Other languages:
    🇧🇷 CRUD de Usuário Avançado com Validação Customizada e Testes Automatizados
    Este projeto foi construído para demonstrar fortes habilidades em backend utilizando:

    Código limpo e estrutura modular;

    Validação manual baseada em regras (Joi intencionalmente não utilizado);

    Tratamento de erros customizado com AppError e middlewares personalizados;

    Cobertura total de testes com Jest + Supertest;

    Stack sólida com Node.js + Express + MongoDB (Mongoose).

    📦 Tecnologias e Ferramentas Utilizadas
    Node.js

    Express

    MongoDB + Mongoose

    Middlewares personalizados:

    res.success

    Classe AppError

    Middleware global errorHandler

    Validações manuais avançadas

    Testes com Jest + Supertest

    dotenv

    chalk (logs estilizados)

    sanitizeUserInput (utilitário de segurança)

    Postman

    📂 Rotas da API (base: /api)
    Método	Rota	Descrição
    GET	/checkEmail/:email	Verifica se o e-mail já está em uso
    POST	/add	Cadastra novo usuário com validação
    GET	/checkUsers	Lista todos os usuários
    DELETE	/deleteUser/:id	Deleta usuário por ID
    PUT	/updateUser/:id	Atualiza campos do usuário

    🧪 Testes Automatizados
    Todas as rotas testadas com Jest + Supertest

    Cobertura completa de erros e sucessos:

    ID inválido

    Valores inválidos

    Campos extras

    Senhas fracas

    Nenhuma alteração detectada

    Cada teste verifica mensagens específicas — garantindo precisão.

    ❗ Por que não usar Joi?
    A escolha de não usar Joi neste projeto foi estratégica:

    Controle absoluto sobre lógica e mensagens

    Integração total com AppError

    Simulação de ambientes críticos (ex: fintechs, sistemas médicos, segurança)

    Demonstração de domínio técnico da validação backend

    “Eu sei usar o Joi, mas neste projeto escolhi a validação manual para garantir total controle sobre regras de negócio e mensagens de erro.”

    ▶️ Como Rodar o Projeto
    bash
    Copiar
    Editar
    # 1. Clone o repositório
    git clone https://github.com/your-user/your-repo.git

    # 2. Instale as dependências
    npm install

    # 3. Configure as variáveis de ambiente
    MONGO_URL=mongodb://localhost:27017/neurocoding

    # 4. Inicie o servidor
    npm start
    Servidor: http://localhost:3050/api

    🧠 Notas Finais
    Este projeto representa uma aplicação profissional, limpa e segura, focada em lógica, clareza e testes.

    “Validação não é só aceitar ou rejeitar input.
    É guiar, proteger e prever comportamentos.”

    Explore os arquivos para ver detalhes como AppError, animações com spyConsole, logs com chalk, e validações manuais.

    Pull requests, forks e feedback são bem-vindos. OSSSS!

    🇷🇺 Расширенный CRUD пользователей с пользовательской валидацией и тестированием
    Этот проект создан для демонстрации навыков backend-разработки:

    Чистый и модульный код

    Ручная валидация без использования Joi (осознанный выбор)

    Пользовательская обработка ошибок (AppError, middleware)

    Полное покрытие тестами: Jest + Supertest

    Надёжный стек: Node.js + Express + MongoDB (Mongoose)

    📦 Используемые технологии
    Node.js

    Express

    MongoDB + Mongoose

    Пользовательские Middleware:

    res.success

    AppError

    errorHandler

    Ручная валидация (без Joi)

    Jest + Supertest

    dotenv

    chalk

    sanitizeUserInput

    Postman

    📂 API Маршруты (база: /api)
    Метод	Роут	Описание
    GET	/checkEmail/:email	Проверка существования email
    POST	/add	Создание нового пользователя
    GET	/checkUsers	Список всех пользователей
    DELETE	/deleteUser/:id	Удаление по ID
    PUT	/updateUser/:id	Обновление данных пользователя

    🧪 Автотестирование
    Все маршруты покрыты Jest + Supertest

    Полное покрытие ошибок и успехов:

    Неверный формат ID

    Дублирование email

    Пустые поля

    Слабые пароли

    Отсутствие изменений

    Каждое сообщение точно проверяется

    ❗ Почему не Joi?
    Проект осознанно не использует Joi:

    Полный контроль логики и ошибок

    Интеграция с AppError и кастомной архитектурой

    Имитация сред с повышенной безопасностью (банковские, военные, медицинские)

    Показ глубокого понимания backend-валидации

    “Я умею пользоваться Joi, но в этом проекте выбрал ручную валидацию для абсолютного контроля над логикой.”

    ▶️ Как запустить проект
    bash
    Copiar
    Editar
    # 1. Клонировать репозиторий
    git clone https://github.com/your-user/your-repo.git

    # 2. Установить зависимости
    npm install

    # 3. Настроить переменные окружения
    MONGO_URL=mongodb://localhost:27017/neurocoding

    # 4. Запустить сервер
    npm start
    Сервер: http://localhost:3050/api

    🧠 Финальные замечания
    Это профессиональное backend-приложение, ориентированное на ясность, тестируемость и защиту.

    “Валидация — это не только про допустимость ввода.
    Это про контроль, безопасность и предсказуемость поведения.”

    Исследуйте проект — особенно AppError, res.success, консольные анимации и кастомную валидацию.