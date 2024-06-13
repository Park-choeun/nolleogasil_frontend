pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('docker-credentials')  // Jenkins Credentials ID 사용
        REACT_APP_KAKAO_API_KEY = credentials('react_app_kakao_api_key')
        REACT_APP_REST_API_KEY = credentials('react_app_rest_api_key')
        REACT_APP_KAKAO_AUTH_URL = credentials('react_app_kakao_auth_url')
        REACT_APP_REDIRECT_URI = credentials('react_app_redirect_uri')
        REACT_APP_SPRINGBOOT_API_URL = credentials('react_app_springboot_api_url')
        REACT_APP_REACT_API_URL = credentials('react_app_react_api_url')
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
        stage('Build React') {
            steps {
                script {
                    // React Docker 이미지 빌드
                    sh '''
                    docker build -t $DOCKER_CREDENTIALS_USR/nolleogasil_frontend -f Dockerfile.react .\
                        --build-arg REACT_APP_KAKAO_API_KEY=${REACT_APP_KAKAO_API_KEY} \
                        --build-arg REACT_APP_REST_API_KEY=${REACT_APP_REST_API_KEY} \
                        --build-arg REACT_APP_KAKAO_AUTH_URL=${REACT_APP_KAKAO_AUTH_URL} \
                        --build-arg REACT_APP_REDIRECT_URI=${REACT_APP_REDIRECT_URI} \
                        --build-arg REACT_APP_SPRINGBOOT_API_URL=${REACT_APP_SPRINGBOOT_API_URL} \
                        --build-arg REACT_APP_API_URL=${REACT_APP_REACT_API_URL}
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

                    // React 이미지 푸시
                    sh 'docker push $DOCKER_CREDENTIALS_USR/nolleogasil_frontend'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sh '''
                    docker pull $DOCKER_CREDENTIALS_USR/nolleogasil_frontend

                    # react-container가 이미 있으면, 중지하고 삭제
                    if [ $(docker ps -q -f name=react-container) ]; then
                        echo "Stopping existing container..."
                        docker stop react-container || true
                    fi

                    if [ $(docker ps -aq -f name=react-container) ]; then
                        echo "Removing existing container..."
                        docker rm react-container || true
                    fi

                    # Docker에서 dangling 이미지 ID 목록 조회
                    dangling_images=$(docker images -f dangling=true -q)

                    # 결과가 비어 있지 않다면, 이미지 삭제
                    if [ -n "$dangling_images" ]; then
                        docker rmi -f $dangling_images
                    else
                        echo "No dangling images to remove."
                    fi

                    docker run -d -p 3000:3000 --name react-container \
                        -e REACT_APP_KAKAO_API_KEY=${REACT_APP_KAKAO_API_KEY} \
                        -e REACT_APP_REST_API_KEY=${REACT_APP_REST_API_KEY} \
                        -e REACT_APP_KAKAO_AUTH_URL=${REACT_APP_KAKAO_AUTH_URL} \
                        -e REACT_APP_REDIRECT_URI=${REACT_APP_REDIRECT_URI} \
                        -e REACT_APP_SPRINGBOOT_API_URL=${REACT_APP_SPRINGBOOT_API_URL} \
                        -e REACT_APP_REACT_API_URL=${REACT_APP_REACT_API_URL} \
                        $DOCKER_CREDENTIALS_USR/nolleogasil_frontend
                    '''
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
