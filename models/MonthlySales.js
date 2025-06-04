import mongoose from 'mongoose';

const MonthlySalesSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    index: true
  },
  
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    index: true
  },
  
  monthName: {
    type: String,
    required: true
  },
  
  totalOrders: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  
  totalSales: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true
});

// Compound index for unique year-month combination
MonthlySalesSchema.index({ year: 1, month: 1 }, { unique: true });

// Static method to add an order - automatically detects current month/year
MonthlySalesSchema.statics.addOrder = async function(orderAmount = 0, orderDate = null) {
  try {
    // Use provided date or current date
    const date = orderDate ? new Date(orderDate) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
    
    // Month names array
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthName = monthNames[month - 1];
    
    // console.log(`Adding order to: ${monthName} ${year}`);
    
    // Find existing record or create new one
    let record = await this.findOne({ year: year, month: month });
    
    if (!record) {
      // Create new record for this month/year
      record = new this({
        year: year,
        month: month,
        monthName: monthName,
        totalOrders: 1,
        totalSales: orderAmount
      });
      // console.log(`Created new record for ${monthName} ${year}`);
    } else {
      // Update existing record
      record.totalOrders += 1;
      record.totalSales += orderAmount;
      // console.log(`Updated existing record for ${monthName} ${year}`);
    }
    
    // Save the record
    await record.save();
    
    // console.log(`Order added successfully: ${monthName} ${year} - Orders: ${record.totalOrders}, Sales: ${record.totalSales}`);
    
    return {
      success: true,
      month: monthName,
      year: year,
      totalOrders: record.totalOrders,
      totalSales: record.totalSales
    };
    
  } catch (error) {
    console.error('Error adding order to monthly sales:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Static method to get monthly data for a specific year
MonthlySalesSchema.statics.getYearData = async function(year) {
  try {
    const records = await this.find({ year: year }).sort({ month: 1 });
    
    // Create array with all 12 months (fill missing months with 0 data)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const yearData = monthNames.map((monthName, index) => {
      const monthNumber = index + 1;
      const existingRecord = records.find(r => r.month === monthNumber);
      
      return {
        month: monthNumber,
        monthName: monthName,
        year: year,
        totalOrders: existingRecord ? existingRecord.totalOrders : 0,
        totalSales: existingRecord ? existingRecord.totalSales : 0
      };
    });
    
    return yearData;
  } catch (error) {
    console.error('Error getting year data:', error);
    return [];
  }
};

export default mongoose.models.MonthlySales || mongoose.model('MonthlySales', MonthlySalesSchema);

