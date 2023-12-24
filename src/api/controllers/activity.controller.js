const Activity = require('../models/activity.model');

/**
 * Get user list
 * @public
 */
exports.totalActivePlayersLastWeek = async (req, res, next) => {
  try {
    const date = new Date();
    const activities = await Activity.aggregate([
      // {
      //   $match: match,
      // },
      // {
      //   $project: {
      //     date: {
      //       $dateFromString: {
      //         dateString: '$lastActive',
      //         format: '%Y-%m-%d',
      //       },
      //     },
      //   },
      // },

      {
        $group: {
          _id: '$playerId',
          dateArray: {
            $addToSet: {
              $dateFromString: {
                dateString: '$lastActive',
                format: '%Y-%m-%d',
              },
            },
          },
        },
      },

      { $addFields: { latestActivity: { $max: '$dateArray' } } },
      {
        $match: {
          $and: [
            // eslint-disable-next-line max-len
            { latestActivity: { $lte: date, $gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      // {
      //   $addFields: {
      //     sevenDaysDate: {
      //       $dateSubtract: { startDate: '$latestActivity', unit: 'day', amount: 7 },
      //     },
      //   },
      // },
      // {
      //   $addFields: {
      //     filteredArray: {
      //       $filter: {
      //         input: '$dateArray',
      //         as: 'date',
      //         cond: {
      //           $and: [
      //             { $gte: ['$$date', date] },
      //             { $lte: ['$$date', '$latestActivity'] },
      //           ],
      //         },
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          _id: 0,
          playerId: '$_id',
          latestActivity: '$latestActivity',
        },
      },
    ]);
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
exports.dailyActivePlayerCountLastWeek = async (req, res, next) => {
  try {
    const date = new Date();
    const activities = await Activity.aggregate([
      // {
      //   $match: match,
      // },
      // {
      //   $project: {
      //     date: {
      //       $dateFromString: {
      //         dateString: '$lastActive',
      //         format: '%Y-%m-%d',
      //       },
      //     },
      //   },
      // },

      {
        $group: {
          _id: '$playerId',
          dateArray: {
            $addToSet: {
              $dateFromString: {
                dateString: '$lastActive',
                format: '%Y-%m-%d',
              },
            },
          },
        },
      },

      { $addFields: { latestActivity: { $max: '$dateArray' } } },
      {
        $match: {
          $and: [
            // eslint-disable-next-line max-len
            { latestActivity: { $lte: date, $gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      // {
      //   $addFields: {
      //     sevenDaysDate: {
      //       $dateSubtract: { startDate: '$latestActivity', unit: 'day', amount: 7 },
      //     },
      //   },
      // },
      // {
      //   $addFields: {
      //     filteredArray: {
      //       $filter: {
      //         input: '$dateArray',
      //         as: 'date',
      //         cond: {
      //           $and: [
      //             { $gte: ['$$date', date] },
      //             { $lte: ['$$date', '$latestActivity'] },
      //           ],
      //         },
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          _id: 0,
          playerId: '$_id',
          latestActivity: '$latestActivity',
        },
      },
      {
        // Group by the formatted date string and count unique players
        $group: {
          _id: '$latestActivity',
          uniquePlayerCount: { $addToSet: '$playerId' },
        },
      },
      {
        // Count the number of unique players
        $project: {
          _id: 0,
          date: '$_id',
          activePlayerCount: { $size: '$uniquePlayerCount' },
        },
      },
      {
        // Sort the results by date
        $sort: { date: -1 },
      },
    ]);
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
exports.averageActivePlayersLastWeek = async (req, res, next) => {
  try {
    const date = new Date();
    const activities = await Activity.aggregate([
      // {
      //   $match: match,
      // },
      // {
      //   $project: {
      //     date: {
      //       $dateFromString: {
      //         dateString: '$lastActive',
      //         format: '%Y-%m-%d',
      //       },
      //     },
      //   },
      // },

      {
        $group: {
          _id: '$playerId',
          dateArray: {
            $addToSet: {
              $dateFromString: {
                dateString: '$lastActive',
                format: '%Y-%m-%d',
              },
            },
          },
        },
      },

      { $addFields: { latestActivity: { $max: '$dateArray' } } },
      {
        $match: {
          $and: [
            // eslint-disable-next-line max-len
            { latestActivity: { $lte: date, $gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      // {
      //   $addFields: {
      //     sevenDaysDate: {
      //       $dateSubtract: { startDate: '$latestActivity', unit: 'day', amount: 7 },
      //     },
      //   },
      // },
      // {
      //   $addFields: {
      //     filteredArray: {
      //       $filter: {
      //         input: '$dateArray',
      //         as: 'date',
      //         cond: {
      //           $and: [
      //             { $gte: ['$$date', date] },
      //             { $lte: ['$$date', '$latestActivity'] },
      //           ],
      //         },
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          _id: 0,
          playerId: '$_id',
          latestActivity: '$latestActivity',
        },
      },
      {
        // Group by the formatted date string and count unique players
        $group: {
          _id: '$latestActivity',
          uniquePlayers: { $addToSet: '$playerId' },
        },
      },
      {
        // Add a new field to store the count of unique players
        $addFields: {
          activePlayerCount: { $size: '$uniquePlayers' },
        },
      },
      {
        // Group by null to calculate an overall average, summing the activePlayerCount
        // and counting the days to divide
        $group: {
          _id: null,
          totalActivePlayerCount: { $sum: '$activePlayerCount' },
          numberOfDays: { $sum: 1 },
        },
      },
      {
        // Calculate the average active player count
        $project: {
          _id: 0,
          averageActivePlayers: { $divide: ['$totalActivePlayerCount', 7] },
        },
      },
    ]);
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
exports.averagePlayTimeForAllPlayers = async (req, res, next) => {
  try {
    const date = new Date();
    const activities = await Activity.aggregate([
      // {
      //   $match: match,
      // },
      // {
      //   $project: {
      //     date: {
      //       $dateFromString: {
      //         dateString: '$lastActive',
      //         format: '%Y-%m-%d',
      //       },
      //     },
      //   },
      // },

      {
        $group: {
          _id: '$playerId',
          dateArray: {
            $addToSet: {
              $dateFromString: {
                dateString: '$lastActive',
                format: '%Y-%m-%d',
              },
            },
          },
        },
      },

      { $addFields: { latestActivity: { $max: '$dateArray' } } },
      {
        $match: {
          $and: [
            // eslint-disable-next-line max-len
            { latestActivity: { $lte: date, $gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      // {
      //   $addFields: {
      //     sevenDaysDate: {
      //       $dateSubtract: { startDate: '$latestActivity', unit: 'day', amount: 7 },
      //     },
      //   },
      // },
      // {
      //   $addFields: {
      //     filteredArray: {
      //       $filter: {
      //         input: '$dateArray',
      //         as: 'date',
      //         cond: {
      //           $and: [
      //             { $gte: ['$$date', date] },
      //             { $lte: ['$$date', '$latestActivity'] },
      //           ],
      //         },
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          _id: 0,
          playerId: '$_id',
          latestActivity: '$latestActivity',
        },
      },
      {
        // Group by the formatted date string and count unique players
        $group: {
          _id: '$latestActivity',
          uniquePlayers: { $addToSet: '$playerId' },
        },
      },
      {
        // Add a new field to store the count of unique players
        $addFields: {
          activePlayerCount: { $size: '$uniquePlayers' },
        },
      },
      {
        // Group by null to calculate an overall average, summing the activePlayerCount
        // and counting the days to divide
        $group: {
          _id: null,
          totalActivePlayerCount: { $sum: '$activePlayerCount' },
          numberOfDays: { $sum: 1 },
        },
      },
      {
        // Calculate the average active player count
        $project: {
          _id: 0,
          averageActivePlayers: { $divide: ['$totalActivePlayerCount', 7] },
        },
      },
    ]);
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
exports.dayWithMostInteraction = async (req, res, next) => {
  try {
    const date = new Date();
    const activities = await Activity.aggregate([
      // {
      //   $match: match,
      // },
      // {
      //   $project: {
      //     date: {
      //       $dateFromString: {
      //         dateString: '$lastActive',
      //         format: '%Y-%m-%d',
      //       },
      //     },
      //   },
      // },

      {
        $group: {
          _id: '$playerId',
          dateArray: {
            $addToSet: {
              $dateFromString: {
                dateString: '$lastActive',
                format: '%Y-%m-%d',
              },
            },
          },
        },
      },

      { $addFields: { latestActivity: { $max: '$dateArray' } } },
      {
        $match: {
          $and: [
            // eslint-disable-next-line max-len
            { latestActivity: { $lte: date, $gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      // {
      //   $addFields: {
      //     sevenDaysDate: {
      //       $dateSubtract: { startDate: '$latestActivity', unit: 'day', amount: 7 },
      //     },
      //   },
      // },
      // {
      //   $addFields: {
      //     filteredArray: {
      //       $filter: {
      //         input: '$dateArray',
      //         as: 'date',
      //         cond: {
      //           $and: [
      //             { $gte: ['$$date', date] },
      //             { $lte: ['$$date', '$latestActivity'] },
      //           ],
      //         },
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          _id: 0,
          playerId: '$_id',
          latestActivity: '$latestActivity',
        },
      },
      {
        // Group by the formatted date string and count unique players
        $group: {
          _id: '$latestActivity',
          uniquePlayers: { $addToSet: '$playerId' },
        },
      },
      {
        // Add a new field to store the count of unique players
        $addFields: {
          activePlayerCount: { $size: '$uniquePlayers' },
        },
      },
      {
        // Group by null to calculate an overall average, summing the activePlayerCount
        // and counting the days to divide
        $group: {
          _id: null,
          totalActivePlayerCount: { $sum: '$activePlayerCount' },
          numberOfDays: { $sum: 1 },
        },
      },
      {
        // Calculate the average active player count
        $project: {
          _id: 0,
          averageActivePlayers: { $divide: ['$totalActivePlayerCount', 7] },
        },
      },
    ]);
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
