pipeline {
    agent {
        docker {
            image 'node:18-alpine'  // Usamos imagen oficial de Node.js
            label 'agent1'  // Puedes usar cualquier agente (agent1 a agent5)
            args '-v /home/jenkins/.npm:/root/.npm'  // Cache de npm para builds más rápidos
        }
    }

    environment {
        PORT = '3000'
        DB_HOST = 'host.docker.internal'  // Para acceder a servicios en el host
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Iniciar base de datos') {
            steps {
                // Asumiendo que MySQL está en el host o en otro contenedor
                sh '''
                    echo "Verificando conexión a MySQL..."
                    curl -s http://$DB_HOST:3306 >/dev/null || echo "MySQL no responde"
                '''
            }
        }

        stage('Ejecutar aplicación') {
            steps {
                sh 'nohup npm start &'
                sh 'sleep 5'  // Esperar que la aplicación inicie
            }
        }

        stage('Verificar') {
            steps {
                sh '''
                    echo "Probando aplicación..."
                    curl -X POST http://localhost:$PORT/api/data \
                    -H "Content-Type: application/json" \
                    -d \'{"name":"test","value":"123"}\'
                    
                    curl http://localhost:$PORT/api/data
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completado - limpiando'
            sh 'pkill -f "node" || true'  // Detener procesos Node.js
        }
    }
}