import connectDB from '@/utils/connectDB';
import MonthlySales from '@/models/MonthlySales';

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const requestedYear = searchParams.get('year');
    const targetYear = requestedYear ? parseInt(requestedYear) : currentYear;
    const yearlyData = await MonthlySales.getYearData(targetYear);
    yearlyData.forEach((monthData, index) => {
      const status = monthData.totalOrders > 0 ? '📊' : '⚪';
    });
    
    const summary = {
      totalOrders: yearlyData.reduce((sum, month) => sum + month.totalOrders, 0),
      totalSales: yearlyData.reduce((sum, month) => sum + month.totalSales, 0),
      monthsWithOrders: yearlyData.filter(month => month.totalOrders > 0).length,
      monthsWithoutOrders: yearlyData.filter(month => month.totalOrders === 0).length
    };
    
    const response = {
      success: true,
      year: targetYear,
      currentDate: currentDate.toISOString(),
      isCurrentYear: targetYear === currentYear,
      isPreviousYear: targetYear === (currentYear - 1),
      data: yearlyData,
      summary: summary
    };
    
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ MONTHLY SALES FETCH ERROR:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch monthly sales data',
      error: error.message,
      timestamp: new Date().toISOString()
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
    const { month, year, totalOrders, totalSales } = body;
    if (!month || !year) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Month and year are required',
        received: { month, year }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthName = monthNames[month - 1];

    const salesData = await MonthlySales.findOneAndUpdate(
      { year: parseInt(year), month: parseInt(month) },
      {
        year: parseInt(year),
        month: parseInt(month),
        monthName: monthName,
        totalOrders: totalOrders || 0,
        totalSales: totalSales || 0,
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
    console.error('❌ MONTHLY SALES UPDATE ERROR:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to update monthly sales data',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
