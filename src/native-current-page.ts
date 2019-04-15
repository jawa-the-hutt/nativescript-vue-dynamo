import { topmost } from 'tns-core-modules/ui/frame';

const getCurrentPage = () => {
  try {
    const page = topmost().currentPage.toString();
    console.log('getCurrentPage - page - ', page)
    return page;
  } catch (err) {
    throw err;
  }

}

export {
  getCurrentPage
}