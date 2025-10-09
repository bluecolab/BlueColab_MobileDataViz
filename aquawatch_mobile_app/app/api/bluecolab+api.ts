export async function POST(request: Request) {
    const { request: url } = await request.json();
    console.log(url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    return Response.json(await response.json());
}
