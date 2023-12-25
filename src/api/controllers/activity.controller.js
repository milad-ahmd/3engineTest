const Activity = require('../models/activity.model');

const dayDuration = 10 * 24 * 60 * 60 * 1000; // last 10 days
/**
 * Get user list
 * @public
 */
exports.totalActivePlayersLastWeek = async (req, res, next) => {
  try {
    const date = new Date();
    const activities = await Activity.aggregate([
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
            { latestActivity: { $lte: date, $gte: new Date(new Date().getTime() - dayDuration) } },
          ],
        },
      },
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
            { latestActivity: { $lte: date, $gte: new Date(new Date().getTime() - dayDuration) } },
          ],
        },
      },
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
            { latestActivity: { $lte: date, $gte: new Date(new Date().getTime() - dayDuration) } },
          ],
        },
      },
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
          averageActivePlayers: { $divide: ['$totalActivePlayerCount', '$numberOfDays'] },
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
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: '$lastActive',
              format: '%Y-%m-%d',
            },
          },
        },
      },
      {
        $match: {
          $and: [
            {
              date: {
                $lte: date,
                $gte: new Date(new Date().getTime() - dayDuration),
              },
            },
          ],
        },
      },
      {
        // Group by playerId and sum the dailyPlaytime, count the number of entries
        $group: {
          _id: '$playerId',
          totalPlaytime: { $sum: '$dailyPlaytime' },
          activityCounted: { $sum: 1 },
        },
      },
      {
        // Calculate the average dailyPlaytime
        $project: {
          _id: 0,
          playerId: '$_id',
          averageDailyPlaytime: { $divide: ['$totalPlaytime', '$activityCounted'] },
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
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: '$lastActive',
              format: '%Y-%m-%d',
            },
          },
        },
      },
      {
        $match: {
          $and: [
            {
              date: {
                $lte: date,
                $gte: new Date(new Date().getTime() - dayDuration),
              },
            },
          ],
        },
      },
      {
        // Group by playerId and sum the dailyPlaytime, count the number of entries
        $group: {
          _id: '$date',
          totalPlaytime: { $sum: '$dailyPlaytime' },
        },
      },
      {
        // Sort by interactionCount to find the day with the most interactions
        $sort: { totalPlaytime: -1 },
      },
      {
        // Limit to the first result to get the day with the most interactions
        $limit: 1,
      },
      {
        // Optionally, project the result to format it as desired
        $project: {
          _id: 0,
          dayWithMostInteractions: '$_id',
          totalPlaytime: 1,
        },
      },
    ]);
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
