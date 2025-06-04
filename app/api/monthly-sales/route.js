import connectDB from '@/utils/connectDB';
import MonthlySales from '@/models/MonthlySales';

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || new Date().getFullYear();
    
    // Fetch sales data for the specified year
    const sales = await MonthlySales.find({ year: parseInt(year) })
      .sort({ month: 1 })
      .lean();

    // Create array of all 12 months with default values
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const yearlyData = months.map((monthName, index) => {
      const monthKey = `${year}-${String(index + 1).padStart(2, '0')}`;
      const existingData = sales.find(sale => sale.month === monthKey);
      
      return existingData || {
        month: monthKey,
        monthName: `${monthName} ${year}`,
        year: parseInt(year),
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        refunds: 0,
      };
    });

    return new Response(JSON.stringify({
      success: true,
      year: parseInt(year),
      data: yearlyData,
      summary: {
        totalOrders: yearlyData.reduce((sum, month) => sum + month.totalOrders, 0),
        totalRevenue: yearlyData.reduce((sum, month) => sum + month.totalRevenue, 0),
        totalCustomers: yearlyData.reduce((sum, month) => sum + month.totalCustomers, 0),
        totalRefunds: yearlyData.reduce((sum, month) => sum + month.refunds, 0),
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Monthly sales fetch error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch monthly sales data',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { month, year, totalOrders, totalRevenue, totalCustomers, refunds } = body;

    if (!month || !year) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Month and year are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = `${monthNames[month - 1]} ${year}`;

    const salesData = await MonthlySales.findOneAndUpdate(
      { month: monthKey },
      {
        month: monthKey,
        monthName,
        year: parseInt(year),
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue || 0,
        totalCustomers: totalCustomers || 0,
        refunds: refunds || 0,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Monthly sales data updated successfully',
      data: salesData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Monthly sales update error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to update monthly sales data',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
