import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserInfo')  # Adjust with your table name

def lambda_handler(event, context):
    if not event.get('body'):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No request body provided'})
        }

    try:
        parsed_body = json.loads(event['body'])
        email = parsed_body.get('email')
        password = parsed_body.get('password')

        response = table.scan(
            FilterExpression='email = :email and password = :password',
            ExpressionAttributeValues={':email': email, ':password': password}
        )
        if response.get('Items'):
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Login successful'})
            }
        else:
            return {
                'statusCode': 401,
                'body': json.dumps({'error': 'Invalid email or password'})
            }
    except ClientError as error:
        print(f'DynamoDB Error: {error}')
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'An error occurred during login'})
        }
