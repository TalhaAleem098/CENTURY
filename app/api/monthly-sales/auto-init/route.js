import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import MonthlySales from '@/models/MonthlySales';

export async function GET(request) {
  try {
    await connectDB();

    const currentYear = new Date().getFullYear();
    
    // console.log(`=== AUTO-INITIALIZING MONTHLY SALES FOR ${currentYear} ===`);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let initializedCount = 0;
    let existingCount = 0;

    // Create records for all 12 months of current year
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthNumber = monthIndex + 1; // 1-12
      const monthName = monthNames[monthIndex];

      try {
        // Check if record already exists using year and month numbers
        const existingRecord = await MonthlySales.findOne({ 
          year: currentYear, 
          month: monthNumber 
        });

        if (!existingRecord) {
          // Create new monthly sales record
          const newRecord = new MonthlySales({
            year: currentYear,
            month: monthNumber,
            monthName: monthName,
            totalOrders: 0,
            totalSales: 0
          });
          
          await newRecord.save();
          initializedCount++;
          // console.log(`✓ Initialized: ${monthName} ${currentYear}`);
        } else {
          existingCount++;
          // console.log(`✓ Already exists: ${monthName} ${currentYear}`);
        }
      } catch (error) {
        console.error(`Error with ${monthName} ${currentYear}:`, error);
      }
    }

    // console.log(`=== AUTO-INITIALIZATION COMPLETE ===`);
    // console.log(`Initialized: ${initializedCount}, Existing: ${existingCount}`);

    return NextResponse.json({
      success: true,
      message: `Monthly sales auto-initialized for ${currentYear}`,
      year: currentYear,
      initialized: initializedCount,
      existing: existingCount,
      total: 12
    });

  } catch (error) {
    console.error('Auto-initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-initialize monthly sales' },
      { status: 500 }
    );
  }
}
