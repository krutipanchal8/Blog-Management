import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB client with Boto3
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BlogPosts')

def lambda_handler(event, context):
    print("Event: ", event)

    # Check if the body exists in the event
    if not event.get('body'):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No request body provided'})
        }

    # Parse the request body and retrieve BlogID
    try:
        parsed_body = json.loads(event['body'])
        blog_id = parsed_body.get('BlogID')
        if not blog_id:
            raise ValueError("BlogID not provided in the request body")
    except (json.JSONDecodeError, ValueError) as error:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(error)})
        }

    # Delete the blog post from the DynamoDB table
    try:
        table.delete_item(
            Key={
                'BlogID': blog_id
            }
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Blog post deleted successfully'})
        }
    except ClientError as error:
        print(f'DynamoDB Error: {error}')
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to delete the blog post', 'details': str(error)})
        }
