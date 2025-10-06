export async function GET() {
    const response = await fetch('https://colabprod01.pace.edu/api/influx/sensordata/');
    const data = await response.json(); // Await the body as JSON
    return Response.json({ message: data });
}
