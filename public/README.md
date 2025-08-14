"This is the frontend interface for the Advanced CRUD API project. Backend repository:
+ Advanced User CRUD with Custom Validation and Automated Testing - Frontend Interface (Vanilla HTML/CSS/JS)
	This project is the frontend layer for the Advanced User CRUD API, built to demonstrate clean, framework-free UI development with client-side validation and robust API consumption.

	It complements the backend by providing a responsive and user-friendly interface, consuming all CRUD operations through fetch() with a custom safe wrapper.

	📦 Technologies and Tools Used
	HTML5

	CSS3 (Responsive design + neon dark theme)

	JavaScript (Vanilla)

	Custom Fetch Layer (safeFetch) with:

	Timeout handling

	Loading overlay

	Unified error handling

	Client-side validation:

	Name

	Age

	Email format

	Password strength

	Dynamic modal for user updates

	ObjectId format check for “Delete by ID”

	🔗 API Endpoints Consumed
	Method	Route	Description
	GET	/checkUsers	Lists all registered users
	GET	/checkEmail/:email	Checks if an email is already in use
	POST	/register	Registers a new user
	DELETE	/deleteUser/:id	Deletes a user by ID
	PUT	/updateUser/:id	Updates user fields

	🧠 Validation Rules
	Name: ≥ 2 characters (trimmed, no empty strings)

	Age: Integer between 1 and 100

	Email: RFC-like regex + uniqueness check via API

	Password: ≥ 8 characters, at least 1 lowercase, 1 uppercase, 1 special character

	Delete by ID: Validates ObjectId format before request

	📂 Frontend Project Structure
	public/
	├─ index.html             # Main UI layout
	├─ style.css              # Dark theme, responsive design, modal animations
	├─ fetch.js               # Safe fetch wrapper + JSON parsing + error handling
	├─ validation.js          # Client-side validation functions
	└─ mainRequisitions.js    # CRUD requests + DOM integration
	▶️ How to Run This Project

	# 1. Clone the repo
	git clone https://github.com/your-user/your-frontend-repo.git

	# 2. Serve locally (Node.js >= 18)
	npx http-server . -p 8080

	# 3. Open in browser:
	http://localhost:8080
	⚠️ Make sure the backend API is running and the BASE_URL in mainRequisitions.js is correctly set.

	🧠 Final Notes
	This frontend is intentionally framework-free to showcase mastery of:

	Pure HTML/CSS/JS

	Defensive programming in UI

	Robust API interaction without dependencies

+ 🇧🇷 CRUD de Usuário Avançado – Interface Frontend (HTML/CSS/JS Puro)
	Este projeto é a camada de interface do CRUD de Usuário Avançado, criado para demonstrar desenvolvimento de UI sem frameworks, com validação no cliente e consumo robusto de API.

	Complementa o backend fornecendo uma interface responsiva e amigável, consumindo todas as operações CRUD via fetch() com um wrapper seguro.

	📦 Tecnologias e Ferramentas Utilizadas
	HTML5

	CSS3 (Design responsivo + tema neon escuro)

	JavaScript puro

	Camada Fetch Customizada (safeFetch) com:

	Controle de timeout

	Tela de carregamento

	Tratamento unificado de erros

	Validação no cliente:

	Nome

	Idade

	Formato de email

	Força da senha

	Modal dinâmico para atualização de usuários

	Validação de ObjectId no “Excluir por ID”

	🔗 Rotas da API Consumidas
	Método	Rota	Descrição
	GET	/checkUsers	Lista todos os usuários registrados
	GET	/checkEmail/:email	Verifica se o e-mail já está em uso
	POST	/register	Cadastra um novo usuário
	DELETE	/deleteUser/:id	Deleta um usuário pelo ID
	PUT	/updateUser/:id	Atualiza campos de um usuário

	🧠 Regras de Validação
	Nome: ≥ 2 caracteres (sem espaços vazios)

	Idade: Inteiro entre 1 e 100

	Email: Regex padrão + verificação de existência via API

	Senha: ≥ 8 caracteres, pelo menos 1 minúscula, 1 maiúscula e 1 caractere especial

	Excluir por ID: Valida formato ObjectId antes de enviar

	📂 Estrutura do Projeto
	public/
	├─ index.html             # Layout principal
	├─ style.css              # Tema escuro, responsividade, animações do modal
	├─ fetch.js               # Wrapper fetch seguro + parsing JSON + erros
	├─ validation.js          # Funções de validação no cliente
	└─ mainRequisitions.js    # Requisições CRUD + integração com o DOM
	▶️ Como Rodar
	# 1. Clonar o repositório
	git clone https://github.com/seu-usuario/seu-repo-frontend.git

	# 2. Servir localmente (Node.js >= 18)
	npx http-server . -p 8080

	# 3. Abrir no navegador:
	http://localhost:8080
	⚠️ Certifique-se de que a API backend esteja rodando e que BASE_URL em mainRequisitions.js esteja configurado corretamente.

	🧠 Observações Finais
	Este frontend é propositalmente livre de frameworks para demonstrar domínio de:

	HTML/CSS/JS puro

	Programação defensiva na interface

	Interação robusta com API sem dependências externas

+ 🇷🇺 Расширенный CRUD пользователей – Фронтенд-интерфейс (Чистый HTML/CSS/JS)
	Этот проект — интерфейсный слой для CRUD пользователей, созданный для демонстрации разработки UI без фреймворков, с валидацией на клиенте и устойчивым взаимодействием с API.

	Он дополняет backend, предоставляя отзывчивый и удобный интерфейс, использующий все CRUD-операции через fetch() с безопасной обёрткой.

	📦 Используемые технологии
	HTML5

	CSS3 (Адаптивный дизайн + неоновая тёмная тема)

	Чистый JavaScript

	Пользовательский слой Fetch (safeFetch):

	Обработка таймаута

	Оверлей загрузки

	Унифицированная обработка ошибок

	Валидация на клиенте:

	Имя

	Возраст

	Формат email

	Сложность пароля

	Динамическое модальное окно для обновления пользователей

	Проверка формата ObjectId при «Удалении по ID»

	🔗 Используемые API-маршруты
	Метод	Маршрут	Описание
	GET	/checkUsers	Получить список всех пользователей
	GET	/checkEmail/:email	Проверить, занят ли email
	POST	/register	Зарегистрировать нового пользователя
	DELETE	/deleteUser/:id	Удалить пользователя по ID
	PUT	/updateUser/:id	Обновить данные пользователя

	🧠 Правила валидации
	Имя: ≥ 2 символов (без пустых строк)

	Возраст: Целое число от 1 до 100

	Email: Regex-проверка + запрос уникальности к API

	Пароль: ≥ 8 символов, минимум 1 строчная, 1 заглавная и 1 спецсимвол

	Удаление по ID: Проверка формата ObjectId перед запросом

	📂 Структура проекта
	public/
	├─ index.html             # Основной макет
	├─ style.css              # Тёмная тема, адаптивность, анимации модального окна
	├─ fetch.js               # Безопасный fetch + парсинг JSON + ошибки
	├─ validation.js          # Функции валидации на клиенте
	└─ mainRequisitions.js    # CRUD-запросы + интеграция с DOM
	▶️ Как запустить
	# 1. Клонировать репозиторий
	git clone https://github.com/ваш-юзер/ваш-frontend-репо.git

	# 2. Запустить локально (Node.js >= 18)
	npx http-server . -p 8080

	# 3. Открыть в браузере:
	http://localhost:8080
	⚠️ Убедитесь, что backend API запущен и BASE_URL в mainRequisitions.js указан верно.

	🧠 Заключение
	Этот фронтенд намеренно без фреймворков, чтобы показать умение:

	Работать с чистым HTML/CSS/JS

	Писать защитный код в интерфейсе

	Надёжно взаимодействовать с API без внешних зависимостей


