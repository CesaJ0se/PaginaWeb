 // Script para el campo de estrellas
        const starfield = document.getElementById('starfield');
        const ctx = starfield.getContext('2d');
        starfield.width = window.innerWidth;
        starfield.height = window.innerHeight;

        const stars = [];
        const numStars = 200;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * starfield.width,
                y: Math.random() * starfield.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }

        function animateStars() {
            ctx.clearRect(0, 0, starfield.width, starfield.height);
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
                ctx.fill();
                star.y += star.speed;
                if (star.y > starfield.height) {
                    star.y = 0;
                    star.x = Math.random() * starfield.width;
                }
            });
            requestAnimationFrame(animateStars);
        }

        animateStars();

        window.addEventListener('resize', () => {
            starfield.width = window.innerWidth;
            starfield.height = window.innerHeight;
        });

        // Script para manejar clics en categorías
        const categoryItems = document.querySelectorAll('.category-item');

        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                console.log(`Navegando a: ${href}`);
                alert(`Navegando a la sección: ${href}`);
            });
        });

        // --- Lógica del juego Recolector de Códigos Estelares (Corregida) ---
        const gameCanvas = document.getElementById('gameCanvas');
        const gameCtx = gameCanvas.getContext('2d');
        const puntuacionElement = document.getElementById('puntuacion');
        const startCodeGameBtn = document.getElementById('startCodeGame');
        const stopCodeGameBtn = document.getElementById('stopCodeGame');
        const startStarGameBtn = document.getElementById('startStarGame');

        let isCodeGameRunning = false;
        let isStarGameRunning = false;
        let score = 0;
        let gameInterval;
        let playerX = gameCanvas.width / 2;
        const playerSize = 20;

        let items = [];
        const itemSize = 20;
        const correctCodes = ['HTML', 'CSS', 'JS', 'PYTHON'];
        const incorrectCodes = ['C++', 'PHP', 'JAVA', 'RUBY'];

        document.addEventListener('mousemove', (e) => {
            if (isCodeGameRunning) {
                const rect = gameCanvas.getBoundingClientRect();
                playerX = e.clientX - rect.left;
                if (playerX < playerSize / 2) playerX = playerSize / 2;
                if (playerX > gameCanvas.width - playerSize / 2) playerX = gameCanvas.width - playerSize / 2;
            }
        });

        function createItem() {
            const isCorrect = Math.random() > 0.5;
            const code = isCorrect
                ? correctCodes[Math.floor(Math.random() * correctCodes.length)]
                : incorrectCodes[Math.floor(Math.random() * incorrectCodes.length)];
            
            items.push({
                x: Math.random() * (gameCanvas.width - itemSize),
                y: -itemSize,
                text: code,
                isCorrect: isCorrect
            });
        }

        function updateGame() {
            gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            // Dibuja el jugador
            gameCtx.fillStyle = '#00ffff';
            gameCtx.beginPath();
            gameCtx.moveTo(playerX, gameCanvas.height - playerSize);
            gameCtx.lineTo(playerX - playerSize / 2, gameCanvas.height);
            gameCtx.lineTo(playerX + playerSize / 2, gameCanvas.height);
            gameCtx.fill();

            // Mueve y dibuja los items
            items.forEach((item, index) => {
                item.y += 2;
                if (item.y > gameCanvas.height) {
                    items.splice(index, 1);
                    if (item.isCorrect) { // Pierde puntos si no atrapa un item correcto
                        score -= 5;
                        if (score < 0) score = 0;
                    }
                }

                // Dibuja el item
                gameCtx.fillStyle = item.isCorrect ? '#00ffff' : '#ff4444';
                gameCtx.font = '10px Arial';
                gameCtx.textAlign = 'center';
                gameCtx.fillText(item.text, item.x + itemSize / 2, item.y + itemSize / 2);

                // Colisión
                if (item.y + itemSize > gameCanvas.height - playerSize && 
                    item.x < playerX + playerSize / 2 && 
                    item.x + itemSize > playerX - playerSize / 2) {
                    
                    if (item.isCorrect) {
                        score += 10;
                    } else {
                        score -= 5;
                        if (score < 0) score = 0;
                    }
                    items.splice(index, 1);
                }
            });

            puntuacionElement.textContent = `Puntos: ${score}`;
        }

        function startGame() {
            if (isCodeGameRunning) return;
            isCodeGameRunning = true;
            score = 0;
            items = [];
            gameInterval = setInterval(updateGame, 20);
            setInterval(createItem, 1000);
        }

        function stopGame() {
            isCodeGameRunning = false;
            clearInterval(gameInterval);
            items = [];
            gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        }
        
        startCodeGameBtn.addEventListener('click', startGame);
        stopCodeGameBtn.addEventListener('click', stopGame);

        // --- Lógica del juego MiniJuego de Estrellas (Corregida y simplificada) ---
        // Ya no se utilizan los elementos .juego-area ni .estrella, ya que es más sencillo hacerlo con canvas.
        startStarGameBtn.addEventListener('click', () => {
            if (isStarGameRunning) return;
            isStarGameRunning = true;
            score = 0;
            puntuacionElement.textContent = `Puntos: ${score}`;
            gameCanvas.addEventListener('click', handleStarClick);
            spawnStar();
        });

        function spawnStar() {
            if (!isStarGameRunning) return;
            gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            const x = Math.random() * (gameCanvas.width - 30);
            const y = Math.random() * (gameCanvas.height - 30);
            
            gameCtx.fillStyle = '#ffff00';
            gameCtx.beginPath();
            gameCtx.arc(x, y, 15, 0, Math.PI * 2);
            gameCtx.fill();
            gameCtx.closePath();

            gameCanvas.setAttribute('data-star-x', x);
            gameCanvas.setAttribute('data-star-y', y);

            setTimeout(spawnStar, 1500); // Aparece una nueva estrella cada 1.5s
        }

        function handleStarClick(e) {
            const rect = gameCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            const starX = parseFloat(gameCanvas.getAttribute('data-star-x'));
            const starY = parseFloat(gameCanvas.getAttribute('data-star-y'));

            const distance = Math.sqrt(Math.pow(clickX - starX, 2) + Math.pow(clickY - starY, 2));

            if (distance <= 15) { // 15 es el radio de la estrella
                score += 10;
                puntuacionElement.textContent = `Puntos: ${score}`;
                // Respawnea la estrella inmediatamente al hacer clic
                gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                spawnStar(); 
            }
        }
        
        // --- Lógica del juego Frogger Espacial (Corregida) ---
        const froggerCanvas = document.getElementById('froggerCanvas');
        const froggerCtx = froggerCanvas.getContext('2d');
        const froggerScoreElement = document.getElementById('froggerScore');
        const froggerGameOverElement = document.getElementById('froggerGameOver');

        // Configuración del juego Frogger
        const FROGGER_WIDTH = froggerCanvas.width;
        const FROGGER_HEIGHT = froggerCanvas.height;
        const EXPLORER_SIZE = 25;
        const ASTEROID_WIDTH = 50;
        const ASTEROID_HEIGHT = 25;
        const SPACE_LANES = 4;
        const FROGGER_LANE_HEIGHT = FROGGER_HEIGHT / (SPACE_LANES + 2);

        // Estado del juego Frogger
        let froggerGameRunning = true;
        let froggerScore = 0;
        let froggerLevel = 1;
        let gameFrame;

        // Jugador (explorador espacial)
        const explorer = {
            x: FROGGER_WIDTH / 2 - EXPLORER_SIZE / 2,
            y: FROGGER_HEIGHT - FROGGER_LANE_HEIGHT + (FROGGER_LANE_HEIGHT - EXPLORER_SIZE) / 2,
            width: EXPLORER_SIZE,
            height: EXPLORER_SIZE,
            speed: FROGGER_LANE_HEIGHT
        };

        // Array de asteroides
        let asteroids = [];

        // Crear asteroide
        function createAsteroid(lane, direction) {
            const asteroid = {
                x: direction === 1 ? -ASTEROID_WIDTH : FROGGER_WIDTH,
                y: FROGGER_LANE_HEIGHT * (lane + 1) + (FROGGER_LANE_HEIGHT - ASTEROID_HEIGHT) / 2,
                width: ASTEROID_WIDTH,
                height: ASTEROID_HEIGHT,
                speed: (2 + Math.random() * 3 + froggerLevel * 0.5) * direction,
                color: `hsl(${180 + Math.random() * 60}, 70%, 50%)`
            };
            return asteroid;
        }

        // Inicializar asteroides
        function initAsteroids() {
            asteroids = [];
            for (let lane = 0; lane < SPACE_LANES; lane++) {
                const direction = lane % 2 === 0 ? 1 : -1;
                for (let i = 0; i < 2; i++) {
                    const asteroid = createAsteroid(lane, direction);
                    asteroid.x += direction * i * 200;
                    asteroids.push(asteroid);
                }
            }
        }

        // Dibujar el explorador espacial
        function drawExplorer() {
            // Cuerpo del explorador (más espacial)
            froggerCtx.fillStyle = '#00ffff';
            froggerCtx.fillRect(explorer.x + 3, explorer.y + 3, explorer.width - 6, explorer.height - 6);

            // Casco/cabeza
            froggerCtx.fillStyle = '#ffffff';
            froggerCtx.fillRect(explorer.x + 6, explorer.y + 6, explorer.width - 12, 8);

            // Visor
            froggerCtx.fillStyle = '#0080ff';
            froggerCtx.fillRect(explorer.x + 8, explorer.y + 8, explorer.width - 16, 4);

            // Propulsores
            froggerCtx.fillStyle = '#ff4444';
            froggerCtx.fillRect(explorer.x + 2, explorer.y + explorer.height - 4, 3, 3);
            froggerCtx.fillRect(explorer.x + explorer.width - 5, explorer.y + explorer.height - 4, 3, 3);
        }

        // Dibujar asteroides
        function drawAsteroids() {
            asteroids.forEach(asteroid => {
                // Asteroide principal
                froggerCtx.fillStyle = asteroid.color;
                froggerCtx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);

                // Detalles del asteroide (cristales/rocas)
                froggerCtx.fillStyle = '#ffffff';
                froggerCtx.fillRect(asteroid.x + 5, asteroid.y + 3, 6, 6);
                froggerCtx.fillRect(asteroid.x + asteroid.width - 11, asteroid.y + 3, 6, 6);
                froggerCtx.fillRect(asteroid.x + 15, asteroid.y + asteroid.height - 9, 8, 6);

                // Brillo espacial
                froggerCtx.fillStyle = 'rgba(0, 255, 255, 0.3)';
                froggerCtx.fillRect(asteroid.x + 2, asteroid.y + 2, asteroid.width - 4, 3);
            });
        }

        // Dibujar el campo espacial
        function drawSpaceField() {
            // Espacio superior (zona segura)
            const gradient1 = froggerCtx.createLinearGradient(0, 0, 0, FROGGER_LANE_HEIGHT);
            gradient1.addColorStop(0, '#000033');
            gradient1.addColorStop(1, '#000066');
            froggerCtx.fillStyle = gradient1;
            froggerCtx.fillRect(0, 0, FROGGER_WIDTH, FROGGER_LANE_HEIGHT);

            // Campo de asteroides
            const gradient2 = froggerCtx.createLinearGradient(0, FROGGER_LANE_HEIGHT, 0, FROGGER_LANE_HEIGHT * (SPACE_LANES + 1));
            gradient2.addColorStop(0, '#0b0f2a');
            gradient2.addColorStop(1, '#14084f');
            froggerCtx.fillStyle = gradient2;
            froggerCtx.fillRect(0, FROGGER_LANE_HEIGHT, FROGGER_WIDTH, FROGGER_LANE_HEIGHT * SPACE_LANES);

            // Líneas de navegación espacial
            froggerCtx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            froggerCtx.lineWidth = 1;
            froggerCtx.setLineDash([10, 5]);

            for (let i = 1; i < SPACE_LANES; i++) {
                froggerCtx.beginPath();
                froggerCtx.moveTo(0, FROGGER_LANE_HEIGHT * (i + 1));
                froggerCtx.lineTo(FROGGER_WIDTH, FROGGER_LANE_HEIGHT * (i + 1));
                froggerCtx.stroke();
            }

            froggerCtx.setLineDash([]);

            // Espacio inferior (zona segura)
            const gradient3 = froggerCtx.createLinearGradient(0, FROGGER_LANE_HEIGHT * (SPACE_LANES + 1), 0, FROGGER_HEIGHT);
            gradient3.addColorStop(0, '#000066');
            gradient3.addColorStop(1, '#000033');
            froggerCtx.fillStyle = gradient3;
            froggerCtx.fillRect(0, FROGGER_LANE_HEIGHT * (SPACE_LANES + 1), FROGGER_WIDTH, FROGGER_LANE_HEIGHT);
        }

        // Lógica de colisión
        function checkCollision() {
            for (const asteroid of asteroids) {
                if (explorer.x < asteroid.x + asteroid.width &&
                    explorer.x + explorer.width > asteroid.x &&
                    explorer.y < asteroid.y + asteroid.height &&
                    explorer.y + explorer.height > asteroid.y) {
                    return true;
                }
            }
            return false;
        }

        // Reiniciar juego
        function resetFroggerGame() {
            explorer.y = FROGGER_HEIGHT - FROGGER_LANE_HEIGHT + (FROGGER_LANE_HEIGHT - EXPLORER_SIZE) / 2;
            explorer.x = FROGGER_WIDTH / 2 - EXPLORER_SIZE / 2;
            froggerGameRunning = true;
            froggerScore = 0;
            froggerLevel = 1;
            initAsteroids();
            froggerGameOverElement.style.display = 'none';
        }
        
        // Bucle principal del juego Frogger
        function froggerGameLoop() {
            if (!froggerGameRunning) {
                cancelAnimationFrame(gameFrame);
                return;
            }

            drawSpaceField();

            // Mover asteroides
            asteroids.forEach(asteroid => {
                asteroid.x += asteroid.speed;
                // Reiniciar asteroide cuando sale de la pantalla
                if (asteroid.speed > 0 && asteroid.x > FROGGER_WIDTH) {
                    asteroid.x = -ASTEROID_WIDTH;
                } else if (asteroid.speed < 0 && asteroid.x < -ASTEROID_WIDTH) {
                    asteroid.x = FROGGER_WIDTH;
                }
            });

            drawAsteroids();
            drawExplorer();

            // Colisión
            if (checkCollision()) {
                froggerGameRunning = false;
                froggerGameOverElement.style.display = 'block';
            }

            // Ganar un punto al cruzar
            if (explorer.y < FROGGER_LANE_HEIGHT) {
                froggerScore += 1;
                froggerScoreElement.textContent = `Puntuación: ${froggerScore}`;
                
                // Reiniciar posición del explorador y subir nivel
                explorer.y = FROGGER_HEIGHT - FROGGER_LANE_HEIGHT + (FROGGER_LANE_HEIGHT - EXPLORER_SIZE) / 2;
                froggerLevel++;
                initAsteroids();
            }

            gameFrame = requestAnimationFrame(froggerGameLoop);
        }
        
        // Control del jugador con las flechas
        document.addEventListener('keydown', (e) => {
            if (!froggerGameRunning) {
                if (e.key === ' ') {
                    resetFroggerGame();
                    froggerGameLoop();
                }
                return;
            }
            
            if (e.key === 'ArrowUp' && explorer.y > 0) {
                explorer.y -= explorer.speed;
            } else if (e.key === 'ArrowDown' && explorer.y < FROGGER_HEIGHT - FROGGER_LANE_HEIGHT) {
                explorer.y += explorer.speed;
            } else if (e.key === 'ArrowLeft' && explorer.x > 0) {
                explorer.x -= 20; // Movimiento horizontal más rápido
            } else if (e.key === 'ArrowRight' && explorer.x < FROGGER_WIDTH - EXPLORER_SIZE) {
                explorer.x += 20; // Movimiento horizontal más rápido
            }
        });

        // Iniciar el juego al cargar la página
        initAsteroids();
        froggerGameLoop();