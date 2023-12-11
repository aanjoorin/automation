stage('Prisma Cloud Image Scan') {
    steps {
        script {
            // Assuming you have already built and pushed the Docker image
            def imageName = 'your-docker-image-name:latest'
            
            // Run Prisma Cloud image scan
            def imageScanResults = prismadata.prismaImageScan(
                imageName: imageName,
                cloudConfig: 'my-prisma-cloud-config',
                failBuild: true // Fail the build if vulnerabilities are found
            )

            // Check image scan results for vulnerabilities
            if (imageScanResults.vulnerabilities) {
                error("Prisma Cloud image scan detected vulnerabilities. Failing the build.")
            } else {
                echo "Prisma Cloud image scan passed. No vulnerabilities found."
            }
        }
    }
}



stage('Prisma Cloud Image Scan') {
    steps {
        script {
            // Assuming you have already built and pushed the Docker image
            def imageName = 'your-docker-image-name:latest'
            
            // Run Prisma Cloud image scan
            prismaCloudScan (
                imageName: imageName,
                cloudConfig: 'my-prisma-cloud-config'
            )

            // Check image scan results for vulnerabilities
            def scanResults = prismaCloudGetScanResults imageName: imageName
            if (scanResults.vulnerabilities) {
                error("Prisma Cloud image scan detected vulnerabilities. Failing the build.")
            } else {
                echo "Prisma Cloud image scan passed. No vulnerabilities found."
            }
        }
    }
}





pipeline {
    agent any

    // Define the list of Docker image names and tags
    environment {
        DOCKER_IMAGES = [
            "your-docker-image-name-1:tag-1",
            "your-docker-image-name-2:tag-2",
            "your-docker-image-name-3:tag-3"
            // Add more image names and tags as needed
        ]
    }

  stages {
      stage('Prisma Cloud Image Scan') {
        when {
        expression { getValue(globalJsonSettings, 'enablePrismaCloudScan').toBoolean() }
        }
          steps {
              script {
                  // Iterate over each image and tag in the list
                  for (def imageWithTag in DOCKER_IMAGES) {
                      // Extract the image name and tag from the list item
                      def (imageName, imageTag) = imageWithTag.tokenize(':')
                      def completeImageName = "${imageName}:${imageTag}"
                      
                      // Run Prisma Cloud image scan
                      prismaCloudScan (
                          imageName: completeImageName,
                          cloudConfig: 'my-prisma-cloud-config'
                      )
  
                      // Check image scan results for vulnerabilities
                      def scanResults = prismaCloudGetScanResults imageName: completeImageName
                      if (scanResults.vulnerabilities) {
                          error("Prisma Cloud image scan detected vulnerabilities for ${completeImageName}. Failing the build.")
                      } else {
                          echo "Prisma Cloud image scan passed for ${completeImageName}. No vulnerabilities found."
                      }
                  }
              }
          }
      }
      // Add more stages as needed
  }
  post {
      // Post-build actions, if any
  }





//latest

stage('Prisma Cloud Image Scan') {
    when {
        expression { getValue(globalJsonSettings, 'enablePrismaCloudScan').toBoolean() }
    }
    steps {
        script {
            // Iterate over each image and tag in the list
            for (def imageWithTag in DOCKER_IMAGES) {
                // Extract the image name and tag from the list item
                def (imageName, imageTag) = imageWithTag.tokenize(':')
                def completeImageName = "${imageName}:${imageTag}"

                // Run Prisma Cloud image scan
                prismaCloudScan(
                    imageName: completeImageName,
                    cloudConfig: 'my-prisma-cloud-config'
                )

                // Check image scan results for vulnerabilities
                def scanResults = prismaCloudGetScanResults(imageName: completeImageName)
                if (scanResults.vulnerabilities) {
                    error("Prisma Cloud image scan detected vulnerabilities for ${completeImageName}. Failing the build.")
                } else {
                    echo "Prisma Cloud image scan passed for ${completeImageName}. No vulnerabilities found."
                }
            }
        }
    }
}
// Add more stages as needed






stage('Prisma Cloud Image Scan') {
  steps {
    // Assuming you have the necessary Prisma Cloud credentials stored as a Jenkins secret
    withCredentials([string(credentialsId: 'prisma-cloud-credentials', variable: 'PRISMA_CLOUD_CREDENTIALS')]) {
      container(name: 'kaniko', shell: '/busybox/sh') {
        script {
          // Build the Docker image as usual using kaniko or any other tool
          buildImages(globalJsonSettings)

          // Get the image name and tag (adjust this based on how you tag your images)
          def imageName = "your-docker-registry/your-image-name"
          def imageTag = "latest"

          // Prisma Cloud image scanning
          sh '''
            docker login -u your-docker-registry-username -p your-docker-registry-password
            docker pull ${imageName}:${imageTag}
            docker tag ${imageName}:${imageTag} ${imageName}:prisma-scan

            # Run Prisma Cloud image scanning (adjust the parameters as needed)
            docker run --rm -e PRISMA_ACCESS_TOKEN="${PRISMA_CLOUD_CREDENTIALS}" -e GATEWAY_URL="https://prisma-cloud-url" -e IMAGE="${imageName}:prisma-scan" twistlock/cli:latest images scan
          '''
        }
      }
    }
  }
}
