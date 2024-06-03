pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('docker-credentials')  // Jenkins Credentials ID 사용
    }


    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[url: 'https://github.com/fourroro/nolleogasil_frontend.git', credentialsId: 'nolleogasil-jenkins-token']]
                ])
            }
        }
        // stage('npm') {
        //     steps {
        //         nodejs(nodeJSInstallationName: 'nodejs-21.7.2') {
        //             sh 'npm install && npm run build'
        //         }
        //     }
        // }
        stage('Build React') {
            steps {
                withCredentials([
                      string(credentialsId: 'react_app_kakao_api_key', variable: 'REACT_APP_KAKAO_API_KEY'),
                      string(credentialsId: 'react_app_rest_api_key', variable: 'REACT_APP_REST_API_KEY'),
                      string(credentialsId: 'react_app_kakao_auth_url', variable: 'REACT_APP_KAKAO_AUTH_URL'),
                      string(credentialsId: 'react_app_redirect_uri', variable: 'REACT_APP_REDIRECT_URI'),
                ]){
                    script {
                        // React Docker 이미지 빌드
                        sh '''
                            echo "REACT_APP_KAKAO_API_KEY=$REACT_APP_KAKAO_API_KEY" >> .env
                            echo "REACT_APP_REST_API_KEY=$REACT_APP_REST_API_KEY" >> .env
                            echo "REACT_APP_KAKAO_AUTH_URL=$REACT_APP_KAKAO_AUTH_URL" >> .env
                            echo "REACT_APP_REDIRECT_URI=$REACT_APP_REDIRECT_URI" >> .env
                            docker build -t nolleogasil_frontend -f Dockerfile.react .
                        '''
                    }
                }
            }
        }
        stage('Push Docker Images') {
            steps {
                script {
                    // Docker Hub 로그인
                    sh '''
                    echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin
                    '''

                    // Spring Boot 이미지 푸시
                    sh 'docker tag nolleogasil_frontend:latest $DOCKER_CREDENTIALS_USR/nolleogasil_frontend'
                    sh 'docker push $DOCKER_CREDENTIALS_USR/nolleogasil_frontend'
                }
            }
        }
    }
    post {
            failure {
                script {
                    currentBuild.result = 'FAILURE'
                    echo "Nolleogasil_frontend build failed with status: ${currentBuild.result}"
                }
            }
            always {
                echo 'Nolleogasil_frontend build and deployment completed.'
            }
        }
}
