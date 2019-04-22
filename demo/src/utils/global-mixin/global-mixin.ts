import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixinShared from './global-mixin-shared';

@Component
export default class GlobalMixinWeb extends Mixins(GlobalMixinShared) {

}
