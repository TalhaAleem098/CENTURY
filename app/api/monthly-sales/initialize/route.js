import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import MonthlySales from '@/models/MonthlySales';

export async function POST(request) {
  try {
    await connectDB();

    const { year } = await request.json();
    
    // If no year provided, use current year
    const targetYear = year || new Date().getFullYear();
    
    console.log(`=== INITIALIZING MONTHLY SALES FOR YEAR ${targetYear} ===`);

    const createdRecords = [];
    const existingRecords = [];

    // Create records for all 12 months
    for (let month = 1; month <= 12; month++) {
      try {
        // Get or create record using static method
        const record = await MonthlySales.getOrCreateRecord(targetYear, month);
        
        // Check if it was newly created or existed
        const existingRecord = await MonthlySales.findOne({ 
          year: targetYear, 
          month: month 
        });

        if (existingRecord.createdAt === existingRecord.updatedAt) {
          createdRecords.push({
            year: targetYear,
            month: month,
            monthName: record.monthName,
            status: 'created',
            data: record
          });
          console.log(`✓ ${record.monthName} - New record created`);
        } else {
          existingRecords.push({
            year: targetYear,
            month: month,
            monthName: record.monthName,
            status: 'already_exists',
            data: record
          });
          console.log(`✓ ${record.monthName} - Record already exists`);
        }
      } catch (error) {
        console.error(`Error processing month ${month}:`, error);
      }
    }

    console.log(`=== INITIALIZATION COMPLETE ===`);
    console.log(`Created: ${createdRecords.length} records`);
    console.log(`Existing: ${existingRecords.length} records`);

    return NextResponse.json({
      success: true,
      message: `Monthly sales records initialized for year ${targetYear}`,
      year: targetYear,
      summary: {
        totalMonths: 12,
        created: createdRecords.length,
        existing: existingRecords.length
      },
      details: {
        createdRecords,
        existingRecords
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error initializing monthly sales:', error);
    return NextResponse.json(
      { error: 'Failed to initialize monthly sales records' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();

    console.log(`=== FETCHING MONTHLY SALES FOR YEAR ${year} ===`);

    // Get all records for the specified year
    const records = await MonthlySales.find({ year: year }).sort({ month: 1 });

    const monthlyData = records.map(record => ({
      year: record.year,
      month: record.month,
      monthName: record.monthName,
      totalOrders: record.totalOrders,
      totalSales: record.totalSales,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }));

    // Calculate yearly totals
    const yearlyTotals = records.reduce((totals, record) => ({
      totalOrders: totals.totalOrders + record.totalOrders,
      totalSales: totals.totalSales + record.totalSales
    }), {
      totalOrders: 0,
      totalSales: 0
    });

    return NextResponse.json({
      success: true,
      year: year,
      recordsFound: records.length,
      monthlyData,
      yearlyTotals: {
        ...yearlyTotals,
        averageOrderValue: yearlyTotals.totalOrders > 0 ? Math.round(yearlyTotals.totalSales / yearlyTotals.totalOrders) : 0
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly sales records' },
      { status: 500 }
    );
  }
}
