def call() {
  // ... (existing code for shared script)
}

def buildImages(settings) {
  def imageTag = getValue(settings, 'imageTag', 'latest')
  def dockerfilePath = getValue(settings, 'dockerfilePath', './Dockerfile')

  // Build the Docker images using kaniko
  sh "executor --dockerfile=${dockerfilePath} --destination=${IMAGE_NAME}:${imageTag} --context=${WORKSPACE}"
}

def pushToGCP(registry, settings) {
  def imageTag = getValue(settings, 'imageTag', 'latest')
  def imageName = getImageName(settings)

  // Set GCP project ID based on the environment and registry
  def gcpProjectId
  if (registry == "devops") {
    gcpProjectId = "devops-project-id"
  } else if (registry == "sandbox") {
    gcpProjectId = "sandbox-project-id"
  } else if (registry == "ncdeDev") {
    gcpProjectId = "ncde-dev-project-id"
  } else if (registry == "ncdeQA") {
    gcpProjectId = "ncde-qa-project-id"
  } else if (registry == "ncdeCert") {
    gcpProjectId = "ncde-cert-project-id"
  } else if (registry == "ncdeProd") {
    gcpProjectId = "ncde-prod-project-id"
  } else {
    error("Unknown registry: ${registry}")
    return
  }

  // Authenticate with GCP and push the image
  sh "gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}"
  sh "gcloud --project=${gcpProjectId} docker -- push gcr.io/${gcpProjectId}/${imageName}:${imageTag}"
}

// Helper function to get the image name
def getImageName(settings) {
  def imageName = getValue(settings, 'imageName', 'my-app')
  return imageName
}

// Helper function to safely get values from JSON
def getValue(settings, key, defaultValue = null) {
  def json = new groovy.json.JsonSlurper().parseText(settings)
  return json.has(key) ? json[key] : defaultValue
}
