# 🏙️ City Builder Game

**City Builder Game** es un simulador urbano por turnos en el que el jugador asume el rol de **alcalde** de una ciudad virtual. El objetivo es construir, desarrollar y gestionar una ciudad próspera tomando decisiones estratégicas sobre infraestructura, recursos, economía y bienestar ciudadano.

---

## 🎮 ¿De qué trata el proyecto?

El juego simula el ciclo de vida de una ciudad a través de un sistema de turnos. Cada turno, los recursos se producen y consumen, los ciudadanos nacen, trabajan y evalúan su felicidad, y la puntuación del jugador evoluciona según las decisiones tomadas.

La ciudad existe sobre un **mapa tipo grid** (de 15×15 hasta 30×30 celdas), donde el jugador coloca edificios, vías y servicios públicos. La particularidad del juego es que la ciudad está **georeferenciada a una ciudad real de Colombia**, lo que permite integrar datos reales de clima (OpenWeatherMap) y noticias (NewsAPI) para una experiencia más inmersiva.

---

## ⚙️ Funcionalidades principales

**Construcción urbana:** el jugador puede construir y demoler edificios residenciales (casas, apartamentos), comerciales (tiendas, centros comerciales), industriales (fábricas, granjas), de servicio (policía, bomberos, hospitales), plantas de utilidad (electricidad, agua) y parques. Todo edificio debe estar adyacente a una vía para poder construirse.

**Gestión de recursos:** el juego administra cuatro recursos clave — dinero, electricidad, agua y alimentos — con balances de producción y consumo por turno. Si la electricidad o el agua llegan a valores negativos, el juego termina.

**Simulación de ciudadanos:** los habitantes son entidades simuladas con felicidad individual. Crecen automáticamente si hay vivienda, empleo y felicidad suficiente (>60). Su bienestar depende de si tienen hogar, trabajo y acceso a servicios.

**Sistema de rutas:** el jugador puede calcular la ruta óptima entre dos edificios usando el algoritmo de Dijkstra, ejecutado en el backend a través de un endpoint REST (`POST /api/calculate-route`).

**Puntuación y ranking:** el desempeño del alcalde se mide con una fórmula que pondera población, felicidad, dinero, edificios y balance de recursos. El ranking local se guarda en `localStorage`.

**Persistencia:** la partida se guarda automáticamente cada 30 segundos en `localStorage` y puede exportarse/importarse como JSON.

**Integraciones externas:**
- **OpenWeatherMap API** — clima en tiempo real de la región geográfica de la ciudad.
- **NewsAPI** — titulares de noticias reales del país.
- **api-colombia.com** — coordenadas de ciudades colombianas para la georreferenciación.

---

## 🗂️ Arquitectura general

El proyecto tiene una separación clara entre **frontend** y **backend**:

- **Frontend:** HTML, CSS y JavaScript puro (sin frameworks). Cada archivo debe estar completamente separado — no se permite código CSS o JavaScript embebido dentro de archivos HTML.
- **Backend:** expone al menos el endpoint `POST /api/calculate-route` para el cálculo de rutas con Dijkstra.

---

## 🚀 Cómo iniciar

1. Configurar una ciudad ingresando nombre, alcalde, región geográfica (ciudad colombiana) y tamaño del mapa.
2. Opcionalmente, cargar un mapa prediseñado desde un archivo `.txt` con el formato de convenciones del grid (`g`, `r`, `R1`, `C1`, `I1`, etc.).
3. Construir plantas de electricidad y agua como primer paso, ya que los recursos iniciales son $50,000 en dinero y 0 en electricidad, agua y alimentos.
4. Expandir la ciudad turno a turno gestionando el equilibrio entre producción, consumo y bienestar ciudadano.

---

## 📐 Convenciones del mapa (archivo `.txt`)

| Símbolo | Elemento |
|---------|----------|
| `g` | Terreno vacío |
| `r` | Vía |
| `R1`, `R2` | Edificios residenciales |
| `C1`, `C2` | Edificios comerciales |
| `I1`, `I2` | Edificios industriales |
| `S1`, `S2`, `S3` | Edificios de servicio |
| `U1`, `U2` | Plantas de utilidad |
| `P1` | Parque |