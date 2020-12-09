<script>
import LoginMixin from '@/mixins/LoginMixin';
import HostLoginForm from '@/components/login/HostLoginForm';

export default {
  name: 'AdminLogin',
  mixins: [LoginMixin],
  components: {
    AppLoginForm: HostLoginForm
  }
};
</script>
