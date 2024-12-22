import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabase } from "../../src/supabase.client.ts";
import { handleError } from "../../src/errors.ts";

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return handleError("Method not allowed", 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return handleError("Unauthorized: Missing token", 401);
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: user, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return handleError("Unauthorized: Invalid token", 401);
  }

  const url = new URL(req.url);
  const authorId = url.searchParams.get('author_id');  // Optional
  const sort = url.searchParams.get('sort') || 'desc'; // Default to 'desc'
  const page = parseInt(url.searchParams.get('page') || '1'); // Default to page 1
  const pageSize = parseInt(url.searchParams.get('page_size') || '10'); // Default to 10 items per page

  let query = supabase
    .from('books')
    .select('*, authors(name)')
    .order('publish_date', { ascending: sort === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1);

  // Apply filtering if author_id is provided
  if (authorId) {
    query = query.eq('author_id', authorId);
  }

  const { data, error } = await query;

  if (error) {
    return handleError(error.message, 400);
  }

  return new Response(JSON.stringify({data}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

