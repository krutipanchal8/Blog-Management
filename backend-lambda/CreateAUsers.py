import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserInfo')

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

    userId = parsed_body.get('userID')
    email = parsed_body.get('email')

    # Check if email already exists
    try:
        response = table.scan(
            FilterExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        if response.get('Items'):
            # Email already exists
            return {
                'statusCode': 409,
                'body': json.dumps({'error': 'Email already registered'})
            }

        # Proceed to create new user
        table.put_item(
            Item={
                'userID': userId,
                'firstName': parsed_body.get('firstName'),
                'lastName': parsed_body.get('lastName'),
                'email': email,
                'password': parsed_body.get('password')
            }
        )
        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'User created successfully', 'userId': userId})
        }
    except ClientError as error:
        print(f'DynamoDB Error: {error}')
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to create the user', 'details': str(error)})
        }
