import Order from "../models/Order.js";

export const getAnalytics = async (req, res) => {
  try {
    const now = new Date();

    // ==========================================
    // TOTAL ORDERS
    // ==========================================

    const totalOrders = await Order.countDocuments();

    // ==========================================
    // TOTAL REVENUE
    // Only paid orders
    // ==========================================

    const revenueResult = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // ==========================================
    // TOTAL CUSTOMERS
    // Unique customer emails
    // ==========================================

    const customersResult = await Order.aggregate([
      {
        $group: {
          _id: "$shippingAddress.email",
        },
      },
      {
        $count: "total",
      },
    ]);

    const totalCustomers = customersResult[0]?.total || 0;

    // ==========================================
    // CURRENT MONTH
    // ==========================================

    const currentMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const currentMonthRevenueResult = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: currentMonthStart,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const currentMonthRevenue =
      currentMonthRevenueResult[0]?.total || 0;

    // ==========================================
    // PREVIOUS MONTH
    // ==========================================

    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const previousMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const previousMonthRevenueResult =
      await Order.aggregate([
        {
          $match: {
            isPaid: true,
            createdAt: {
              $gte: previousMonthStart,
              $lt: previousMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

    const previousMonthRevenue =
      previousMonthRevenueResult[0]?.total || 0;

    // ==========================================
    // GROWTH RATE
    // ==========================================

    let growthRate = 0;

    if (previousMonthRevenue > 0) {
      growthRate =
        ((currentMonthRevenue - previousMonthRevenue) /
          previousMonthRevenue) *
        100;
    } else if (currentMonthRevenue > 0) {
      growthRate = 100;
    }

    // ==========================================
    // REVENUE - LAST 7 DAYS
    // ==========================================

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const revenueChart = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: sevenDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: {
            $sum: "$totalPrice",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // ==========================================
    // TOP SELLING PRODUCTS
    // ==========================================

    const topProducts = await Order.aggregate([
      {
        $unwind: "$orderItems",
      },
      {
        $group: {
          _id: "$orderItems.name",
          sold: {
            $sum: "$orderItems.qty",
          },
        },
      },
      {
        $sort: {
          sold: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          sold: 1,
        },
      },
    ]);

    // ==========================================
    // ORDER STATUS
    // ==========================================

    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: {
            $ifNull: ["$status", "Processing"],
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          total: 1,
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    // ==========================================
    // PAYMENT METHODS
    // ==========================================

    const paymentMethods = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          method: "$_id",
          total: 1,
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    // ==========================================
    // WEEKLY PERFORMANCE
    // ==========================================

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weeklyPerformance = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: weekStart,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          orders: {
            $sum: 1,
          },
          revenue: {
            $sum: "$totalPrice",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // ==========================================
    // RESPONSE
    // ==========================================

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,

      currentMonthRevenue,
      previousMonthRevenue,

      growthRate: Number(growthRate.toFixed(1)),

      revenueChart,

      topProducts,

      orderStatus,

      paymentMethods,

      weeklyPerformance,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);

    res.status(500).json({
      message: "Failed to load analytics",
      error: error.message,
    });
  }
};