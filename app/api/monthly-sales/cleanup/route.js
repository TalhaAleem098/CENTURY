import connectDB from '@/utils/connectDB';
import MonthlySales from '@/models/MonthlySales';

export async function POST(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    
    let deletedCount;
    
    if (year) {
      // Delete data for specific year
      const result = await MonthlySales.deleteMany({ year: parseInt(year) });
      deletedCount = result.deletedCount;
    } else {
      // Delete all data
      const result = await MonthlySales.deleteMany({});
      deletedCount = result.deletedCount;
    }

    return new Response(JSON.stringify({
      success: true,
      message: year ? 
        `Monthly sales data for year ${year} cleaned up successfully` : 
        'All monthly sales data cleaned up successfully',
      deletedCount
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Monthly sales cleanup error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to cleanup monthly sales data',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
