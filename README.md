# petslocal

server: Node.js
db: PostgreSQL

## Instruction

Install dependencies
`npm install`
Run database migrations
`npm run up`
Start server
`npm start`

If need to undo database migrations
`npm run down`

## API

### POST /pets

### GET /pets/{id}

### GET /pets/{id}/matches

### POST /customers

### GET /customers/{id}

### GET /customers/{id}/matches

### POST /customers/{id}/adopt?pet_id={pet_id}

# Notes

Pets/Customers matches are stored in a table instead of being matched everytime the /matches API is called. This is to improve the response time of those 2 API calls, otherwise for Extension #3 the /matches calls will take a very long time. Assumption here is that the amount of requests for getting matches for pets/customers will be much higher than adding new pets/customers or customers adopting a pet. (Imagine customers checking everyday to see if there is any new match for them)

Due to time constraint, the extensions are not implemented (yet).
