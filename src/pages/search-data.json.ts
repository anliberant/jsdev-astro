import { getAllSearchData } from '@/features/search/model/search-data';

export const prerender = true;

export async function GET() {
  const searchData = await getAllSearchData();

  return new Response(JSON.stringify(searchData), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
