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
        stage('Prepare Nginx Config') {
            steps {
                withCredentials([file(credentialsId: 'nginx-config', variable: 'NGINX_CONF')]) {
                    sh 'cp $NGINX_CONF ./nginx.conf'
                }
            }
        }
        stage('Build React') {
            steps {
                script {
                    // React Docker 이미지 빌드
                    sh '''
                        echo "REACT_APP_KAKAO_API_KEY=$REACT_APP_KAKAO_API_KEY" >> .env
                        echo "REACT_APP_REST_API_KEY=$REACT_APP_REST_API_KEY" >> .env
                        echo "REACT_APP_KAKAO_AUTH_URL=$REACT_APP_KAKAO_AUTH_URL" >> .env
                        echo "REACT_APP_REDIRECT_URI=$REACT_APP_REDIRECT_URI" >> .env
                        echo "SPRINGBOOT_API_URL=$SPRINGBOOT_API_URL" >> .env
                        echo "REACT_APP_API_URL=$REACT_APP_API_URL" >> .env
                        docker build --no-cache -t nolleogasil_frontend -f Dockerfile.react .
                    '''
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
                    sh 'docker push $DOCKER_CREDENTIALS_USR/nolleogasil_frontend'
                }
            }
        }
        stage('Deploy') {
            steps {
                withCredentials([
                      string(credentialsId: 'react_app_kakao_api_key', variable: 'REACT_APP_KAKAO_API_KEY'),
                      string(credentialsId: 'react_app_rest_api_key', variable: 'REACT_APP_REST_API_KEY'),
                      string(credentialsId: 'react_app_kakao_auth_url', variable: 'REACT_APP_KAKAO_AUTH_URL'),
                      string(credentialsId: 'react_app_redirect_uri', variable: 'REACT_APP_REDIRECT_URI'),
                      string(credentialsId: 'springboot_api_url', variable: 'SPRINGBOOT_API_URL'),
                      string(credentialsId: 'react_app_api_url', variable: 'REACT_APP_API_URL')
                ]){
                    script {
                        sh '''
                        docker pull $DOCKER_CREDENTIALS_USR/nolleogasil_frontend

                        # Docker에서 dangling 이미지 ID 목록 조회
                        dangling_images=$(docker images -f dangling=true -q)

                        # 결과가 비어 있지 않다면, 이미지 삭제
                        if [ -n "$dangling_images" ]; then
                            docker rmi -f $dangling_images
                        else
                            echo "No dangling images to remove."
                        fi

                        # react-container가 이미 있으면, 중지하고 삭제
                        if [ $(docker ps -q -f name=react-container) ]; then
                            echo "Stopping existing container..."
                            docker stop react-container || true
                        fi

                        if [ $(docker ps -aq -f name=react-container) ]; then
                            echo "Removing existing container..."
                            docker rm react-container || true
                        fi

                        docker run -d -p 3000:3000 --name react-container \
                            -e REACT_APP_KAKAO_API_KEY=$REACT_APP_KAKAO_API_KEY \
                            -e REACT_APP_REST_API_KEY=$REACT_APP_REST_API_KEY \
                            -e REACT_APP_KAKAO_AUTH_URL=$REACT_APP_KAKAO_AUTH_URL \
                            -e REACT_APP_REDIRECT_URI=$REACT_APP_REDIRECT_URI \
                            -e SPRINGBOOT_API_URL=$SPRINGBOOT_API_URL \
                            -e REACT_APP_API_URL=$REACT_APP_API_URL \
                            $DOCKER_CREDENTIALS_USR/nolleogasil_frontend
                        '''
                    }
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
