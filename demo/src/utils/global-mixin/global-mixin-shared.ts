import { RawLocation } from 'vue-router';
import router from '~/router'

export const $login = async (): Promise<void> => {
  console.log('starting global-mixin login');
  try{
    const location: RawLocation = { name: 'home', params: { clearHistory: 'true'}};
    router.push(location);
  } catch (err) {
    throw err;
  }
}

export const $logout = async (): Promise<void> => {
  console.log('starting global-mixin logout');
  try{
    const location: RawLocation = { name: 'login', params: { clearHistory: 'true'}};
    router.push(location);
  } catch (err) {
    throw err;
  }
}
