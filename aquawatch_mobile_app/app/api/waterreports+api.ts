export async function GET() {
    const api_address = "http://10.86.80.189:8080";
    return Response.json({ api_address });
}
