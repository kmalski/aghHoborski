<script>
import LoginMixin from '@/mixins/LoginMixin';
import SpectatorLoginForm from '@/components/login/SpectatorLoginForm';

export default {
  name: 'Home',
  mixins: [LoginMixin],
  components: {
    AppLoginForm: SpectatorLoginForm
  }
};
</script>
