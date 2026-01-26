#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorios
PROJECT_ROOT=$(pwd)
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
VENV_ACTIVATE="$BACKEND_DIR/venv/bin/activate"
PID_FILE="$PROJECT_ROOT/.buskalo_pids"

# Función para matar procesos
kill_processes() {
    if [ -f "$PID_FILE" ]; then
        echo -e "\n${YELLOW}Deteniendo servicios...${NC}"
        read -r BACKEND_PID FRONTEND_PID < "$PID_FILE"
        
        if [ -n "$BACKEND_PID" ]; then
            kill "$BACKEND_PID" 2>/dev/null
            echo -e "${RED}Backend detenido (PID: $BACKEND_PID)${NC}"
        fi
        
        if [ -n "$FRONTEND_PID" ]; then
            kill "$FRONTEND_PID" 2>/dev/null
            echo -e "${RED}Frontend detenido (PID: $FRONTEND_PID)${NC}"
        fi
        
        rm -f "$PID_FILE"
    fi
}

# Manejador de señal de salida
on_exit() {
    kill_processes
    exit 0
}

# Capturar señal de interrupción (Ctrl+C)
trap on_exit SIGINT SIGTERM

start() {
    # Verificar si ya está corriendo
    if [ -f "$PID_FILE" ]; then
        echo -e "${YELLOW}Parece que los servicios ya están corriendo (archivo PID existe).${NC}"
        echo -e "${YELLOW}Ejecuta './start.sh stop' o './start.sh restart' primero, o borra .buskalo_pids si fue un error.${NC}"
        exit 1
    fi

    echo -e "${GREEN}Iniciando Buskalo...${NC}"

    # Verificar entorno virtual
    if [ ! -f "$VENV_ACTIVATE" ]; then
        echo -e "${RED}Error: No se encontró el entorno virtual en $VENV_ACTIVATE${NC}"
        exit 1
    fi

    # Activar entorno virtual y arrancar Backend
    echo -e "${YELLOW}Iniciando Django Backend...${NC}"
    source "$VENV_ACTIVATE"
    cd "$BACKEND_DIR" || exit
    # Usar exec para que el proceso python sea hijo directo si fuera script solo, 
    # pero aquí necesitamos background (&)
    python manage.py runserver &
    BACKEND_PID=$!
    cd "$PROJECT_ROOT" || exit

    # Arrancar Frontend
    echo -e "${YELLOW}Iniciando Next.js Frontend...${NC}"
    cd "$FRONTEND_DIR" || exit
    pnpm dev &
    FRONTEND_PID=$!
    cd "$PROJECT_ROOT" || exit

    # Guardar PIDs
    echo "$BACKEND_PID $FRONTEND_PID" > "$PID_FILE"

    echo -e "${GREEN}Servicios corriendo. Backend PID: $BACKEND_PID, Frontend PID: $FRONTEND_PID${NC}"
    echo -e "${GREEN}Presiona Ctrl+C para detener todo.${NC}"
    
    # Esperar a que los procesos terminen
    wait
}

stop() {
    kill_processes
    # Limpieza adicional por seguridad si no había PID file pero quedan procesos
    if pgrep -f "manage.py runserver" > /dev/null; then
         echo -e "${YELLOW}Limpiando procesos huerfanos de Django...${NC}"
         pkill -f "manage.py runserver"
    fi
    if pgrep -f "next-server|pnpm dev" > /dev/null; then
         echo -e "${YELLOW}Limpiando procesos huerfanos de Next.js...${NC}"
         pkill -f "next-server"
         pkill -f "pnpm dev"
         # Matar procesos de node asociados al frontend específicamente
         pkill -f "node $FRONTEND_DIR"
    fi
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        echo -e "${YELLOW}Reiniciando servicios...${NC}"
        stop
        sleep 2
        start
        ;;
    *)
        start
        ;;
esac
