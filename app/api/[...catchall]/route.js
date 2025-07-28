// app/api/[...catchall]/route.js

export async function GET(req, { params }) {
  return new Response(
    JSON.stringify({
      error: 'API endpoint not found',
      path: `/${params.catchall?.join('/') || ''}`,
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function POST(req, { params }) {
  return new Response(
    JSON.stringify({
      error: 'POST endpoint not found',
      path: `/${params.catchall?.join('/') || ''}`,
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
