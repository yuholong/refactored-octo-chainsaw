# petslocal

server: Node.js
db: PostgreSQL

## Instruction

setup a config.js file at project directory

```
module.exports = {
  development: {
    db: {
      username: 'postgres',
      password: 'password',
      database: 'database',
      host: '127.0.0.1',
      dialect: 'postgres'
    }
  },
  other_environment: {
    db: {
     ...
    }
  },
    ...
};
```

and also a config/config.json file for migration (this should be fixed and combined to the config.js in the future)

```
{
  "development": {
    "username": "postgres",
    "password": "password",
    "database": "database",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "other_env": {
      ...
  }
}
```

Install dependencies

```
npm install
```

Run database migrations

```
npm run up
```

Start server

```
npm start
```

If need to undo database migrations

```
npm run down
```

## Tests

To do testing, initialize the testing database first.

```
NODE_ENV=testing npm run up
```

Please note that running the test will wipe the tables in the database.

When the database is ready, run

```
NODE_ENV=testing npm test
```

For now there is an error when running the test for customer service as some error handlings are done during the router layer.

## API

### POST /pets

Note that ID is optional for this call. If an ID is provided, the system will check and see if it is valid or not, otherwise the pet will be automatically assigned an ID.

Sample request body:

```
{
	"name":"ching",
	"available_from":"2018-09-06",
	"age":3,
	"species":"dog",
	"breed":"terrier"
}
```

Sample Response:

```
{
    "statusCode": 200,
    "message": "OK",
    "data": {
        "id": 12,
        "name": "ching",
        "available_from": "2018-09-06T00:00:00.000Z",
        "age": 3,
        "species": "dog",
        "breed": "terrier",
        "updatedAt": "2018-07-25T14:26:57.724Z",
        "createdAt": "2018-07-25T14:26:57.724Z"
    }
}
```

### GET /pets/{id}

Sample response:

```
{
    "statusCode": 200,
    "message": "OK",
    "data": {
        "id": 11,
        "name": "crat",
        "available_from": "2018-09-06T00:00:00.000Z",
        "age": 3,
        "species": "rabbit",
        "breed": "",
        "createdAt": "2018-07-23T16:47:21.554Z",
        "updatedAt": "2018-07-23T16:47:21.554Z"
    }
}
```

### GET /pets/{id}/matches

Sample response

```
{
    "statusCode": 200,
    "message": "OK",
    "data": [
        {
            "id": 36,
            "preference": "{\"age\":{\"max\":10,\"min\":1},\"species\":[\"cat\",\"rabbit\",\"dog\"],\"breed\":[\"poodle\",\"terrier\"]}",
            "createdAt": "2018-07-24T13:41:35.868Z",
            "updatedAt": "2018-07-24T13:41:35.868Z"
        }
    ]
}
```

Can't find any match:

```
{
    "statusCode": 200,
    "message": "OK",
    "data": "No Matches"
}
```

### POST /customers

ID handling is similar to that of POST /pets

Sample request body:

```
{
  "preference":{
    "age":{
      "max":10,
      "min":1
    },
    "species":["cat","rabbit","dog"],
    "breed":["poodle","terrier"]
  }
}
```

Sample response:

```
{
    "statusCode": 200,
    "message": "OK",
    "data": {
        "id": 37,
        "preference": "{\"age\":{\"max\":10,\"min\":1},\"species\":[\"cat\",\"rabbit\",\"dog\"],\"breed\":[\"poodle\",\"terrier\"]}",
        "updatedAt": "2018-07-25T14:29:25.300Z",
        "createdAt": "2018-07-25T14:29:25.300Z"
    }
}
```

### GET /customers/{id}

```
{
    "statusCode": 200,
    "message": "OK",
    "data": {
        "id": 35,
        "preference": "{\"age\":{\"max\":2,\"min\":1},\"species\":[\"cat\",\"rabbit\",\"dog\"],\"breed\":[\"poodle\",\"terrier\"]}",
        "createdAt": "2018-07-24T13:41:21.249Z",
        "updatedAt": "2018-07-24T13:41:21.249Z"
    }
}
```

### GET /customers/{id}/matches

Similar to GET /pets/{id}/matches

### POST /customers/{id}/adopt?pet_id={pet_id}

Sample Response:

```
{
    "statusCode": 200,
    "message": "OK",
    "data": "Adopted."
}
```

# Notes

Pets/Customers matches are stored in a table instead of being matched everytime the /matches API is called. This is to improve the response time of those 2 API calls, otherwise for Extension #3 the /matches calls will take a very long time. Assumption here is that the amount of requests for getting matches for pets/customers will be much higher than adding new pets/customers or customers adopting a pet. (Imagine customers checking everyday to see if there is any new match for them)

Due to time constraint, the extensions are not implemented (yet).
