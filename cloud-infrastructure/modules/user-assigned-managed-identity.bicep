param name string
param location string
param tags object
param containerRegistryName string
param keyVaultName string

resource userAssignedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: name
  location: location
  tags: tags
}


var containerRegistryResourceGroupName = 'shared'
module containerRegistryPermission './role-assignments-container-registry-acr-pull.bicep' = {
  name: 'container-registry-permission'
  scope: resourceGroup(subscription().subscriptionId, containerRegistryResourceGroupName)
  params: {
    containerRegistryName: containerRegistryName
    principalId: userAssignedIdentity.properties.principalId
  }
}

output id string = userAssignedIdentity.id
output clientId string = userAssignedIdentity.properties.clientId
output principalId string = userAssignedIdentity.properties.principalId
