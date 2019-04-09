import { Component, Vue } from 'vue-property-decorator';
import * as GlobalMixinShared from './global-mixin-shared';

@Component
export default class GlobalMixinWeb extends Vue {
  public shared = GlobalMixinShared;
}
