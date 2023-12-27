import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB client with Boto3
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BlogPosts')

def lambda_handler(event, context):
    print("Event: ",event)
    if not event.get('body'):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No request body provided'})
        }

    try:
        parsed_body = json.loads(event['body'])
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }

    title = parsed_body.get('title')
    author = parsed_body.get('author')
    content = parsed_body.get('content')
    date_posted = parsed_body.get('DatePosted')
    email = parsed_body.get('email')
    blog_id = parsed_body.get('BlogID')  # Assuming BlogID is provided in the request
    summary = parsed_body.get('summary')
    print("Blog id: ",blog_id)

    params = {
        'TableName': 'BlogPosts',
        'Item': {
            'BlogID': blog_id,
            'email' : email,
            'title': title,
            'author': author,
            'content': content,
            'DatePosted': date_posted,
            'summary': summary
        },
        'ConditionExpression': 'attribute_not_exists(BlogID)'
    }

    try:
        table.put_item(Item=params['Item'], ConditionExpression=params['ConditionExpression'])
        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'Blog post created successfully', 'BlogID': blog_id})
        }
    except ClientError as error:
        if error.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {
                'statusCode': 409,
                'body': json.dumps({'error': 'Blog post with the same BlogID already exists'})
            }
        else:
            print(f'DynamoDB Error: {error}')
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Failed to create the blog post', 'details': str(error)})
            }
