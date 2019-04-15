import Router from 'vue-router';

const getCurrentPage = async (router: Router): Promise<string> => {
  return router.currentRoute.fullPath;
}

export default getCurrentPage