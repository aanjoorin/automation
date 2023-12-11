          if ( getValue(imageJsonSettings, 'pushToGCP') == 'true' ) {
            withCredentials([file(credentialsId: 'dbox1.json', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
              println('Pushing to Sandbox: dbox1')
              sh '''
                gcrane push /image.tar us.gcr.io/dbox1/${IMAGE_NAME}:${IMAGE_TAG}
                gcrane tag us.gcr.io/dbox1/${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_TAG}-${GIT_COMMIT_HASH}
              '''
            }
            withCredentials([file(credentialsId: 'come.json', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
              println('Pushing to Develop: come')
              sh '''
                gcrane push /image.tar us.gcr.io/come/${IMAGE_NAME}:${IMAGE_TAG}
                gcrane tag us.gcr.io/come/${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_TAG}-${GIT_COMMIT_HASH}
              '''
            }