import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB client with Boto3
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BlogPosts')

def lambda_handler(event, context):
    try:
        # Scan the DynamoDB table
        response = table.scan()

        # Return a successful response
        return {
            'statusCode': 200,
            'body': json.dumps(response.get('Items', []))
        }
    except ClientError as error:
        # Log and return the error if the operation fails
        print(f'DynamoDB Error: {error}')
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Failed to retrieve blog posts',
                'details': str(error)
            })
        }
