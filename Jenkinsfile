pipeline {
    agent {
        label 'agent1' // Puedes cambiarlo a agent2, agent3, etc.
    }

    environment {
        PORT = '3000'
        NODE_VERSION = '18.x' // Versión de Node.js a instalar
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/JhonTova/Jenkins.git'
            }
        }

        stage('Instalar Node.js') {
            steps {
                script {
                    // Verificar si Node.js ya está instalado
                    try {
                        sh 'node --version'
                        echo '✅ Node.js ya está instalado'
                    } catch (Exception e) {
                        echo 'Instalando Node.js...'
                        sh """
                            # Instalar Node.js y npm
                            curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | sudo -E bash -
                            sudo apt-get install -y nodejs
                            
                            # Verificar instalación
                            node --version
                            npm --version
                        """
                    }
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Iniciar base de datos') {
            steps {
                // Verificar si MySQL está instalado
                sh 'mysql --version || echo "MySQL no está instalado"'
                
                // Ejecutar script SQL (asumiendo credenciales por defecto)
                sh 'mysql -u root -p < database/init.sql || echo "Error al ejecutar script SQL"'
            }
        }

        stage('Ejecutar aplicación') {
            steps {
                sh 'nohup npm start &' // Usar nohup para evitar que se detenga
                sh 'sleep 5' // Esperar que la aplicación se inicie
            }
        }

        stage('Verificar') {
            steps {
                // Hacer una prueba de conexión
                sh '''
                    echo "Probando endpoint POST..."
                    curl -X POST http://localhost:3000/api/data \
                    -H "Content-Type: application/json" \
                    -d \'{"name":"test","value":"123"}\' || echo "Error en POST"
                    
                    echo "\nProbando endpoint GET..."
                    curl http://localhost:3000/api/data || echo "Error en GET"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completado - limpiando'
            // Alternativa más compatible para detener la aplicación
            sh '''
                PID=$(ps aux | grep "node app.js" | grep -v grep | awk '{print $2}')
                if [ ! -z "$PID" ]; then
                    kill -9 $PID || true
                fi
            '''
        }
    }
}