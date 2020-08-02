const expect = require('chai').expect;
const sinon = require('sinon');
const config = require('../../config/general');

const {spy, stub} = sinon;

const ActivityController =
require('../controllers/activityController');

describe('Activity Controller', () => {
  let instance;
  let activityService;
  let tokenService;
  let createError;
  let json;
  let res;
  let next;
  let status;
  let loggerService;

  beforeEach(() => {
    activityService = {};
    tokenService = {};
    createError = {};
    status = stub();
    json = spy();
    loggerService = {};
    loggerService.logger = sinon.stub().resolves();
    loggerService.gethttpContext = sinon.stub().resolves();
    res = {json, status};
    next=()=>{
      return true;
    };
    status.returns(res);
    instance = new ActivityController(
        loggerService,
        config,
        createError,
        tokenService,
        activityService,
    );
  });

  describe('getActivities', () => {
    it('Should throw error invalid Args', async() => {
      const req = {headers: {authorization: null},
        body: {},
      };
      instance._logger.info = sinon.stub().resolves();
      instance._logger.error = sinon.stub().resolves();
      instance._createError = sinon.stub().resolves();
      await instance.getActivities(req, res, next);
      expect(res.status.calledWith(500));
    });

    it('Should throw error Unauthorized', async() => {
      const req = {headers: {authorization: 'Bearer defaultToken'},
        query: {
          type: 'quiz',
        },
      };
      instance._logger.info = sinon.stub().resolves();
      instance._logger.error = sinon.stub().resolves();
      instance._tokenService.getToken =
        sinon.stub().resolves({data: [{username: 'defaultUsername'}]});
      instance._createError = sinon.stub().resolves();
      await instance.getActivities(req, res, next);
      expect(
          instance._tokenService.getToken.calledOnce,
      ).to.be.true;
      expect(res.status.calledWith(203));
    });

    it('Get Actiivities', async() => {
      const req = {headers: {authorization: 'Bearer defaultToken'},
        query: {
          type: 'quiz',
        },
      };
      instance._logger.info = sinon.stub().resolves();
      instance._logger.error = sinon.stub().resolves();
      instance._tokenService.getToken =
        sinon.stub().resolves({data: [{username: 'defaultUsername'}]});
      instance._activityService.getActivitiesFromMoodle =
        sinon.stub().resolves({data: [{url: 'teste'}]});
      await instance.getActivities(req, res, next);
      expect(
          instance._tokenService.getToken.calledOnce,
      ).to.be.true;
      expect(
          instance._activityService.getActivitiesFromMoodle.calledOnce,
      ).to.be.true;
      expect(res.status.calledWith(200));
    });
  });
});
