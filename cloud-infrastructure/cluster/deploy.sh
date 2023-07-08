    resourceGroupName="$environment-$locationPrefix"
    deploymentCommand="az deployment sub create"

    deploymentParamters="-l $location -n $resourceGroupName --output table -f ./main.bicep -p environment=$environment locationPrefix=$locationPrefix resourceGroupName=$resourceGroupName clusterUniqueName=$clusterUniqueName useMssqlElasticPool=$useMssqlElasticPool containerRegistryName=$CONTAINER_REGISTRY_NAME"

    cd "$(dirname "${BASH_SOURCE[0]}")"
    . ../deploy.sh