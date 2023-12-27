import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB client with Boto3
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BlogPosts')

def lambda_handler(event, context):
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

    blog_id = parsed_body.get('BlogID')
    if not blog_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'BlogID is required'})
        }

    try:
        # Construct the update expression and attribute values
        update_expression = "set title = :t, author = :a, content = :c, DatePosted = :dp, email = :e, summary = :s"
        expression_attribute_values = {
            ':t': parsed_body.get('title'),
            ':a': parsed_body.get('author'),
            ':c': parsed_body.get('content'),
            ':dp': parsed_body.get('DatePosted'),
            ':e': parsed_body.get('email'),
            ':s': parsed_body.get('summary')
        }

        # Update the item in DynamoDB
        table.update_item(
            Key={'BlogID': blog_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Blog post updated successfully', 'BlogID': blog_id})
        }
    except ClientError as error:
        print(f'DynamoDB Error: {error}')
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to update the blog post', 'details': str(error)})
        }
