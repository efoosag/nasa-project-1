const { getAllLaunches, scheduleNewLaunch, existlaunchWithId,abortLaunchById } = require('../../model/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit)
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
    return res.status(400).json({
      error: 'Missing Required Launch Property',
    });
  }
  launch.launchDate = new Date(launch.launchDate);

  if(isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid Launch Date',
    })
  }

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  //if launch doesn't exist
  const existLaunch = await existlaunchWithId(launchId);
  if(!existLaunch) {
    return res.status(404).json({
      error: "Launch Not Found",
    })
  }
  //if launch exist
  const aborted = await abortLaunchById(launchId);
  if(!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted',
    })
  }
  return res.status(200).json({
    ok: true
  });
  
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}