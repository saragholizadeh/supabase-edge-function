import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: user, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({data}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

