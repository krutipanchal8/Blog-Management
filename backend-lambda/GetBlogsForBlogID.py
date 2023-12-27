import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB client with Boto3
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BlogPosts')

def lambda_handler(event, context):
    try:
        # Parse the incoming event body to get the BlogID
        request_body = json.loads(event['body'])
        blog_id = request_body['BlogID']

        # Retrieve the specific item from the DynamoDB table
        response = table.get_item(
            Key={
                'BlogID': blog_id
            }
        )

        # Return the item if found
        return {
            'statusCode': 200,
            'body': json.dumps(response.get('Item', {}))
        }
    except ClientError as error:
        # Log and return the error if the operation fails
        print(f'DynamoDB Error: {error}')
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Failed to retrieve the blog post',
                'details': str(error)
            })
        }
