# Supabase Edge Function: Bookstore API

This project implements a RESTful API for managing a bookstore database using Supabase Edge Functions. 
The API provides a single endpoint to retrieve books, filter by author, sort by publication date, and paginate the results. The API is secured with Supabase Authentication (Provided By Email and OTP).

---

## Features

- **Books API**
  - Endpoint: `GET /getBooks`
  - Supports optional query parameters for filtering, sorting, and pagination.
  - Secured with Supabase authentication.

- **Database**
  - Two tables: `authors` and `books`, with proper foreign key relationships.

- **Clean Code Structure**
  - Modularized code with separate files for Supabase client setup, error handling, and main logic.


## API Documentation

### Endpoint: `GET /getBooks`

#### Query Parameters:

| Parameter       | Type   | Description                                           |
|-----------------|--------|-------------------------------------------------------|
| `author_id`     | string | (Optional) Filter books by author ID.                |
| `sort`          | string | (Optional) Sort by publish date (`asc` or `desc`). Default: `desc`. |
| `page`          | number | (Optional) Page number for pagination. Default: `1`.  |
| `page_size`     | number | (Optional) Number of results per page. Default: `10`. |

#### Example Request:
```bash
GET /getBooks?author_id=1&sort=asc&page=1&page_size=5
```

#### Example Response:
```json
{
  "data": [
    {
        "book_id": 116,
        "title": "The Final Quest",
        "author_id": 1,
        "price": 51,
        "publish_date": "2015-12-22",
        "authors": {
            "name": "Alice"
        }
    },
  ]
}
```

#### Error Responses:
| Status Code | Message                          |
|-------------|----------------------------------|
| `400`       | "Invalid request"               |
| `401`       | "Unauthorized: Missing token"    |
| `405`       | "Method not allowed"            |

---

## Setup Instructions

### Prerequisites

- A Supabase project.
- Supabase CLI installed ([Installation Guide](https://supabase.com/docs/guides/cli)).
- Deno installed

### Steps

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd supabase/functions
   ```

2. **Set Environment Variables:**
   - Add your Supabase project URL and `anon` key in the environment variables:
     ```bash
     export SUPABASE_URL=<your-supabase-url>
     export SUPABASE_ANON_KEY=<your-anon-key>
     ```

3. **Deploy the Function:**
   ```bash
   supabase functions deploy getBooks
   ```

4. **Test the API:**
   Use a tool like Postman or curl to test the API:
   ```bash
   curl -H "Authorization: Bearer <your-jwt-token>" "<function-url>/getBooks?page=1&page_size=5"
   ```

---

## Database Schema

### `authors`
```sql
CREATE TABLE authors (
  author_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL
);
```

### `books`
```sql
CREATE TABLE books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INT REFERENCES authors(author_id) ON DELETE CASCADE,
  price INT8 NOT NULL,
  publish_date DATE NOT NULL
);
```

---

## Notes

- Ensure that your Supabase project has RLS (Row Level Security) enabled for better security.
- For large datasets, consider indexing columns used for filtering and sorting (e.g., `publish_date` and `author_id`).

---

## License
This project is open-source and available under the MIT License.

---

Feel free to contribute or suggest improvements!

