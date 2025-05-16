pipeline {
    agent {
        label 'agent1' // Puedes cambiarlo a agent2, agent3, etc.
    }

    environment {
        PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/JhonTova/Jenkins.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Iniciar base de datos') {
            steps {
                // Asumiendo que tienes MySQL Workbench local configurado
                sh 'mysql -u root -p < database/init.sql || true'
            }
        }

        stage('Ejecutar aplicación') {
            steps {
                sh 'npm start &'
            }
        }

        stage('Verificar') {
            steps {
                // Esperar un poco para que la aplicación se inicie
                sleep time: 5, unit: 'SECONDS'
                
                // Hacer una prueba de conexión
                sh '''
                    curl -X POST http://localhost:3000/api/data \
                    -H "Content-Type: application/json" \
                    -d \'{"name":"test","value":"123"}\' || true
                    
                    curl http://localhost:3000/api/data || true
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completado - limpiando'
            // Detener la aplicación si es necesario
            sh 'pkill -f "node app.js" || true'
        }
    }
}