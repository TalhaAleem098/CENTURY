import bwipjs from 'bwip-js';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  if (!text) {
    return new Response('Missing text', { status: 400 });
  }
  try {
    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text,
      scale: 3,
      height: 20,
      includetext: true,
      textxalign: 'center',
      backgroundcolor: 'FFFFFF',
      paddingwidth: 10,
      paddingheight: 6,
    });
    return new Response(png, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response('Barcode generation error', { status: 500 });
  }
}
