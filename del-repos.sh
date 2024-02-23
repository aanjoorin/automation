#!/bin/bash
POSITIONAL=()
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -u|--bb_username)
        BB_USERNAME="$2"
        shift # past argument
        shift # past value
        ;;
        -a|--bb_apitoken)
        BB_APITOKEN="$2"
        shift # past argument
        shift # past value
        ;;
        -p|--bb_projectkey)
        BB_PROJECTKEY="$2"
        shift # past argument
        shift # past value
        ;;
        -v|--ghe_username)
        GHE_USERNAME="$2"
        shift # past argument
        shift # past value
        ;;
        -o|--ghe_org)
        GHE_ORG="$2"
        shift # past argument
        shift # past value
        ;;
        -t|--ghe_apitoken)
        GHE_APITOKEN="$2"
        shift # past argument
        shift # past value
        ;;
        -r|--repos)
        REPOS=("$2")
        shift # past argument
        shift # past value
        ;;
        -*|--*)
        echo "Unknown option $1"
        exit 1
        ;;
        *)
        POSITIONAL+=("$1") # save positional args
        shift # past argument
        ;;
    esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters
GHE_API_URL="https://github.globalpay.com/api/v3"
if [ -z "$BB_USERNAME" ] || [ -z "$BB_APITOKEN" ] || [ -z "$BB_PROJECTKEY" ] || \
   [ -z "$GHE_USERNAME" ] || [ -z "$GHE_ORG" ] || [ -z "$GHE_APITOKEN" ] || \
   [ -z "$REPOS" ]
then
    echo "Usage: ./del-repos.sh -u <bb_username> -a <bb_apitoken> -p <bb_projectkey> -v <ghe_username> -o <ghe_org> -t <ghe_apitoken> -r <repo1,repo2,repo3>"
    exit 1
fi
for REPO in $(echo $REPOS | sed "s/,/ /g")
do
    curl -L \
    -X DELETE \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GHE_APITOKEN" \
    https://github.globalpay.com/api/v3/repos/$GHE_ORG/$REPO
    echo "Deleting repository: $REPO"
done
echo ""
echo "END DELETION"
